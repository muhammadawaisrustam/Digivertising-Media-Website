import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed session tokens for the interim studio login. Pure functions so they
 * can be unit tested. Format: "<expiresAtMs>.<signature>".
 */

export const SESSION_HOURS = 12;

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  // Compare fixed-length hashes so the comparison time does not reveal length or content.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function createSessionToken(secret: string, now = Date.now()): string {
  const expires = String(now + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires, secret)}`;
}

export function verifySessionToken(token: string | undefined, secret: string, now = Date.now()): boolean {
  if (!token) return false;
  const [expires, signature, extra] = token.split(".");
  if (!expires || !signature || extra !== undefined || !/^\d+$/.test(expires)) return false;
  if (!safeEqual(signature, sign(expires, secret))) return false;
  return Number(expires) > now;
}

export function passwordMatches(input: string, expected: string): boolean {
  return safeEqual(input, expected);
}

/** Minimum strength for the studio secrets, checked at runtime. */
export function checkStudioConfig(password: string | undefined, secret: string | undefined): { ok: true } | { ok: false; problem: string } {
  if (!password || !secret) return { ok: false, problem: "STUDIO_PASSWORD and SESSION_SECRET are not set in the server environment (.env.local)." };
  if (password.length < 12) return { ok: false, problem: "STUDIO_PASSWORD must be at least 12 characters." };
  if (secret.length < 32) return { ok: false, problem: "SESSION_SECRET must be at least 32 characters." };
  return { ok: true };
}
