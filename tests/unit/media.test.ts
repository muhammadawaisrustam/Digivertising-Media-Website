import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { detectImageType, MAX_UPLOAD_BYTES } from "@/features/media/image-type";

// A real 1x1 PNG.
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==", "base64");
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0]);
const WEBP = Buffer.concat([Buffer.from("RIFF"), Buffer.from([0x24, 0, 0, 0]), Buffer.from("WEBPVP8 ")]);
const AVIF = Buffer.concat([Buffer.from([0, 0, 0, 0x20]), Buffer.from("ftypavif"), Buffer.alloc(8)]);
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "dv-media-"));
  process.env.DATA_DIR = dir;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
});
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("image type detection", () => {
  it("recognises JPG, PNG, WebP and AVIF from their first bytes", () => {
    expect(detectImageType(JPEG)?.ext).toBe("jpg");
    expect(detectImageType(PNG)?.ext).toBe("png");
    expect(detectImageType(WEBP)?.ext).toBe("webp");
    expect(detectImageType(AVIF)?.ext).toBe("avif");
  });

  it("refuses SVG, HTML and tiny files, whatever their name says", () => {
    expect(detectImageType(SVG)).toBeNull();
    expect(detectImageType(Buffer.from("<html><body>hi</body></html>"))).toBeNull();
    expect(detectImageType(Buffer.from([0xff, 0xd8]))).toBeNull();
  });
});

describe("local uploads", () => {
  it("stores a valid image under a random name and serves it back", async () => {
    const { uploadImage, readLocalUpload } = await import("@/features/media/service");
    const result = await uploadImage(new File([PNG], "photo.png", { type: "image/png" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.url).toMatch(/^\/media\/[0-9a-f-]{36}\.png$/);
    const served = await readLocalUpload(result.url.slice("/media/".length));
    expect(served?.mime).toBe("image/png");
    expect(served?.bytes.equals(PNG)).toBe(true);
  });

  it("rejects an SVG renamed to .png, empty files and files over 5 MB", async () => {
    const { uploadImage } = await import("@/features/media/service");
    expect(await uploadImage(new File([SVG], "evil.png", { type: "image/png" }))).toEqual({ ok: false, error: "Only JPG, PNG, WebP or AVIF images can be uploaded." });
    expect((await uploadImage(new File([], "empty.png"))).ok).toBe(false);
    const big = new File([PNG, Buffer.alloc(MAX_UPLOAD_BYTES)], "big.png");
    expect(await uploadImage(big)).toEqual({ ok: false, error: "The image is larger than 5 MB. Make it smaller and try again." });
  });

  it("never serves names the uploader did not create", async () => {
    const { readLocalUpload } = await import("@/features/media/service");
    for (const name of ["../../package.json", "..%2F..%2Fpackage.json", "notes.txt", "00000000-0000-0000-0000-000000000000.svg"]) {
      expect(await readLocalUpload(name)).toBeNull();
    }
  });
});
