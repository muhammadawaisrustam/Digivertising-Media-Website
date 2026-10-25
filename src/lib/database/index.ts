import "server-only";
import path from "node:path";
import { createPublicClient, createSecretClient, createStudioClient, hasSecretKey } from "@/lib/supabase/clients";
import { isSupabaseMode } from "@/lib/supabase/config";
import { FileStore } from "./file-store";
import { SupabasePublicReader, SupabaseStore } from "./supabase-store";
import type { LeadStore, LeadWriter, PageStore, PublicPageReader } from "./types";

/**
 * Picks where data lives.
 * - Supabase mode (SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY set):
 *   the Digivertising Supabase project, with Row Level Security.
 * - Otherwise: JSON files in DATA_DIR (default ./.data) for local development and tests.
 */

let fileStore: FileStore | null = null;

export function getFileStore(): FileStore {
  fileStore ??= new FileStore(process.env.DATA_DIR ?? path.join(process.cwd(), ".data"));
  return fileStore;
}

/** For the public website: published pages only. */
export function getPublicReader(): PublicPageReader {
  return isSupabaseMode() ? new SupabasePublicReader(createPublicClient()) : getFileStore();
}

/** For the public forms: stores a validated enquiry. */
export function getLeadWriter(): LeadWriter {
  return isSupabaseMode() ? new SupabaseStore(createSecretClient()) : getFileStore();
}

/** For the studio: acts as the signed-in user, so database access rules apply. */
export async function getStudioStore(): Promise<PageStore & LeadStore> {
  if (!isSupabaseMode()) return getFileStore();
  const client = await createStudioClient();
  const { data } = await client.auth.getUser();
  return new SupabaseStore(client, data.user?.id ?? null);
}

export type StorageStatus = { kind: "supabase" | "file"; ready: boolean; note: string };

export function storageDescription(): StorageStatus {
  if (isSupabaseMode()) {
    return hasSecretKey()
      ? { kind: "supabase", ready: true, note: "Supabase project. Pages, versions and enquiries are stored in the database with access rules." }
      : { kind: "supabase", ready: false, note: "Supabase is connected, but SUPABASE_SECRET_KEY is missing, so website enquiries cannot be saved. Add it to .env.local (see docs/supabase.md)." };
  }
  return {
    kind: "file",
    ready: true,
    note: "Local file storage (.data folder). Fine on your own computer. Not persistent on serverless hosting: connect Supabase before deploying.",
  };
}
