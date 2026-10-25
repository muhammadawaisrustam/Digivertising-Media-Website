// Prints local-only test keys (signed with the well-known local JWT secret).
import { createHmac } from "node:crypto";
const secret = process.env.JWT_SECRET ?? "super-secret-jwt-token-with-at-least-32-characters-long";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const sign = (payload) => {
  const head = b64({ alg: "HS256", typ: "JWT" });
  const body = b64({ iss: "supabase-local", iat: 1700000000, exp: 2000000000, ...payload });
  return `${head}.${body}.${createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url")}`;
};
console.log(`ANON_KEY=${sign({ role: "anon" })}`);
console.log(`SERVICE_KEY=${sign({ role: "service_role" })}`);
