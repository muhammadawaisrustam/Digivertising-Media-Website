import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createStudioClient } from "@/lib/supabase/clients";
import { isSupabaseMode } from "@/lib/supabase/config";
import { detectImageType, MAX_UPLOAD_BYTES, MIME_BY_EXT, UPLOAD_NAME, type ImageType } from "./image-type";

/**
 * Image uploads for the page editor.
 * - Supabase mode: the public "media" bucket, uploaded as the signed-in user,
 *   so the storage access rules decide (editors and above, uploads/ folder only).
 * - Local mode: files in DATA_DIR/uploads, served by /media/<file>.
 * Callers must check the studio role first.
 */

export const MEDIA_BUCKET = "media";

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

export function localUploadDir(): string {
  return path.join(process.env.DATA_DIR ?? path.join(process.cwd(), ".data"), "uploads");
}

export async function uploadImage(file: File | null): Promise<UploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "Choose an image file first." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "The image is larger than 5 MB. Make it smaller and try again." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) return { ok: false, error: "Only JPG, PNG, WebP or AVIF images can be uploaded." };
  const name = `${randomUUID()}.${type.ext}`;
  return isSupabaseMode() ? uploadToSupabase(name, bytes, type) : uploadToDisk(name, bytes);
}

async function uploadToSupabase(name: string, bytes: Uint8Array, type: ImageType): Promise<UploadResult> {
  const client = await createStudioClient();
  const key = `uploads/${new Date().toISOString().slice(0, 7)}/${name}`;
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(key, bytes, { contentType: type.mime, cacheControl: "31536000", upsert: false });
  if (error) {
    console.error("Image upload failed", error);
    return { ok: false, error: "The image could not be uploaded. Please try again." };
  }
  return { ok: true, url: client.storage.from(MEDIA_BUCKET).getPublicUrl(key).data.publicUrl };
}

async function uploadToDisk(name: string, bytes: Uint8Array): Promise<UploadResult> {
  const dir = localUploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes, { flag: "wx" });
  return { ok: true, url: `/media/${name}` };
}

/** Reads a locally uploaded file. Returns null for anything that is not an uploader-made name. */
export async function readLocalUpload(name: string): Promise<{ bytes: Buffer; mime: string } | null> {
  if (isSupabaseMode() || !UPLOAD_NAME.test(name)) return null;
  try {
    const bytes = await readFile(path.join(localUploadDir(), name));
    return { bytes, mime: MIME_BY_EXT[name.split(".").pop() as ImageType["ext"]] };
  } catch {
    return null;
  }
}
