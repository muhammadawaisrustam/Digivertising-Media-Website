/**
 * Upload checks that do not trust the browser: the file type is read from the
 * first bytes of the file, not from its name or the declared type.
 * Only raster images are accepted. SVG is refused because it can contain scripts.
 */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type ImageType = { mime: "image/jpeg" | "image/png" | "image/webp" | "image/avif"; ext: "jpg" | "png" | "webp" | "avif" };

const ascii = (bytes: Uint8Array, start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));

export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (bytes[0] === 0x89 && ascii(bytes, 1, 4) === "PNG" && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return { mime: "image/png", ext: "png" };
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (ascii(bytes, 4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(bytes, 8, 12))) return { mime: "image/avif", ext: "avif" };
  return null;
}

/** File names produced by the uploader: a random id and a known extension. */
export const UPLOAD_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/;

export const MIME_BY_EXT: Record<ImageType["ext"], ImageType["mime"]> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };
