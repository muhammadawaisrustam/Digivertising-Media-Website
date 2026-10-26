// Minimal stand-in for Supabase's API gateway, for local tests only.
// Routes /auth/v1 -> GoTrue and /rest/v1 -> PostgREST, and (like Supabase)
// uses the apikey header as the bearer token when no user token is sent.
// /storage/v1 is a tiny stand-in for Supabase Storage: an upload is first
// recorded in storage.objects through PostgREST *as the caller*, so the real
// storage access rules decide, and only then is the file written to disk.
// (PostgREST must expose the storage schema: db-schemas = "public,storage".)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const PORT = Number(process.env.GATEWAY_PORT ?? 54330);
const AUTH = Number(process.env.AUTH_PORT ?? 54331);
const REST = Number(process.env.REST_PORT ?? 54332);
const FILES = process.env.STORAGE_DIR ?? "/var/tmp/localsb/storage";
const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

const json = (res, status, body) => res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(body));
const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => resolve(Buffer.concat(chunks)));
  req.on("error", reject);
});
const safeKey = (key) => /^[\w-]+(\/[\w.-]+)+$/.test(key) && !key.split("/").includes("..");

function restInsertObject(auth, bucket, name, metadata) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ bucket_id: bucket, name, metadata });
    const r = http.request(
      { host: "127.0.0.1", port: REST, path: "/objects", method: "POST", headers: { authorization: auth, "content-type": "application/json", "content-profile": "storage", prefer: "return=minimal", "content-length": Buffer.byteLength(body) } },
      (up) => { up.resume(); up.on("end", () => resolve(up.statusCode)); },
    );
    r.on("error", () => resolve(502));
    r.end(body);
  });
}

async function storage(req, res, url, auth) {
  const pub = /^\/storage\/v1\/object\/public\/([\w-]+)\/(.+)$/.exec(url.split("?")[0]);
  if (pub && req.method === "GET") {
    const [, bucket, key] = pub;
    if (!safeKey(key)) return json(res, 400, { message: "bad key" });
    try {
      const bytes = await readFile(path.join(FILES, bucket, key));
      return res.writeHead(200, { "content-type": TYPES[key.split(".").pop()] ?? "application/octet-stream" }).end(bytes);
    } catch {
      return json(res, 404, { statusCode: "404", error: "not_found", message: "Object not found" });
    }
  }
  const up = /^\/storage\/v1\/object\/([\w-]+)\/(.+)$/.exec(url.split("?")[0]);
  if (up && req.method === "POST") {
    const [, bucket, key] = up;
    if (!safeKey(key)) return json(res, 400, { message: "bad key" });
    const bytes = await readBody(req);
    const status = await restInsertObject(auth, bucket, key, { mimetype: req.headers["content-type"], size: bytes.length });
    if (status !== 201) return json(res, 403, { statusCode: "403", error: "Unauthorized", message: "new row violates row-level security policy" });
    await mkdir(path.dirname(path.join(FILES, bucket, key)), { recursive: true });
    await writeFile(path.join(FILES, bucket, key), bytes);
    return json(res, 200, { Key: `${bucket}/${key}`, Id: key });
  }
  return json(res, 404, { message: "not supported by the local stand-in" });
}

http
  .createServer((req, res) => {
    const url = req.url ?? "/";
    let auth = req.headers.authorization;
    if (!auth && req.headers.apikey) auth = `Bearer ${req.headers.apikey}`;
    if (url.startsWith("/storage/v1/")) {
      storage(req, res, url, auth).catch((e) => json(res, 500, { message: String(e) }));
      return;
    }
    const target = url.startsWith("/auth/v1") ? { port: AUTH, path: url.slice(8) || "/" } : url.startsWith("/rest/v1") ? { port: REST, path: url.slice(8) || "/" } : null;
    if (!target) {
      res.writeHead(404).end("not found");
      return;
    }
    const headers = { ...req.headers, host: `127.0.0.1:${target.port}` };
    if (auth) headers.authorization = auth;
    const upstream = http.request({ host: "127.0.0.1", port: target.port, path: target.path, method: req.method, headers }, (up) => {
      res.writeHead(up.statusCode ?? 502, up.headers);
      up.pipe(res);
    });
    upstream.on("error", (e) => res.writeHead(502).end(String(e)));
    req.pipe(upstream);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`local supabase gateway on ${PORT}`));
