import "server-only";
import path from "node:path";
import { FileStore } from "./file-store";
import type { LeadStore, PageStore } from "./types";

let store: (PageStore & LeadStore) | null = null;

/**
 * Returns the configured data store. Today that is the local file store; the
 * Supabase store is added in Phase 3 and selected automatically when configured.
 */
export function getStore(): PageStore & LeadStore {
  if (!store) {
    store = new FileStore(process.env.DATA_DIR ?? path.join(process.cwd(), ".data"));
  }
  return store;
}

export function storageDescription(): { kind: "file"; persistent: boolean; note: string } {
  return {
    kind: "file",
    persistent: true,
    note: "Local file storage (.data folder). Fine on your own computer or a single server. Not persistent on serverless hosting: connect Supabase before deploying.",
  };
}
