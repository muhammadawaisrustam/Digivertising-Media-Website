// Minimal stand-in for Supabase's API gateway, for local tests only.
// Routes /auth/v1 -> GoTrue and /rest/v1 -> PostgREST, and (like Supabase)
// uses the apikey header as the bearer token when no user token is sent.
import http from "node:http";

const PORT = Number(process.env.GATEWAY_PORT ?? 54330);
const AUTH = Number(process.env.AUTH_PORT ?? 54331);
const REST = Number(process.env.REST_PORT ?? 54332);

http
  .createServer((req, res) => {
    const url = req.url ?? "/";
    const target = url.startsWith("/auth/v1") ? { port: AUTH, path: url.slice(8) || "/" } : url.startsWith("/rest/v1") ? { port: REST, path: url.slice(8) || "/" } : null;
    if (!target) {
      res.writeHead(404).end("not found");
      return;
    }
    const headers = { ...req.headers, host: `127.0.0.1:${target.port}` };
    if (!headers.authorization && headers.apikey) headers.authorization = `Bearer ${headers.apikey}`;
    const upstream = http.request({ host: "127.0.0.1", port: target.port, path: target.path, method: req.method, headers }, (up) => {
      res.writeHead(up.statusCode ?? 502, up.headers);
      up.pipe(res);
    });
    upstream.on("error", (e) => res.writeHead(502).end(String(e)));
    req.pipe(upstream);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`local supabase gateway on ${PORT}`));
