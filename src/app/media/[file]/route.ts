import { readLocalUpload } from "@/features/media/service";

/** Serves images uploaded in local mode. In Supabase mode images come from Supabase Storage instead. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const upload = await readLocalUpload((await params).file);
  if (!upload) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(upload.bytes), {
    headers: {
      "Content-Type": upload.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
