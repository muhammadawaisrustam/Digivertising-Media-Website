import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { checkStudioConfig, createSessionToken, passwordMatches, SESSION_HOURS, verifySessionToken } from "./session-token";

/**
 * Interim studio login: one owner password from the server environment and a
 * signed, httpOnly session cookie. It is replaced by Supabase Auth with roles
 * in Phase 3. Every studio page AND every studio server action checks it.
 */

export const STUDIO_COOKIE = "dv_studio";

export function studioAuthConfig() {
  return checkStudioConfig(process.env.STUDIO_PASSWORD, process.env.SESSION_SECRET);
}

export function verifyStudioPassword(input: string): boolean {
  const config = studioAuthConfig();
  if (!config.ok) return false;
  return passwordMatches(input, process.env.STUDIO_PASSWORD!);
}

export async function isStudioSignedIn(): Promise<boolean> {
  // Read the cookie first: this also makes every studio page render per request,
  // so settings from the server environment are never frozen into a build.
  const token = (await cookies()).get(STUDIO_COOKIE)?.value;
  if (!studioAuthConfig().ok) return false;
  // The expiry check uses the current time, so it must run at request time.
  await connection();
  return verifySessionToken(token, process.env.SESSION_SECRET!);
}

/** For pages: sends visitors who are not signed in to the login page. */
export async function requireStudio(): Promise<void> {
  if (!(await isStudioSignedIn())) redirect("/studio/login");
}

/** For server actions: refuses to run unless signed in. */
export async function assertStudio(): Promise<void> {
  if (!(await isStudioSignedIn())) throw new Error("Not signed in to the studio.");
}

export async function startStudioSession(): Promise<void> {
  (await cookies()).set(STUDIO_COOKIE, createSessionToken(process.env.SESSION_SECRET!), {
    httpOnly: true,
    sameSite: "strict",
    // Browsers accept Secure cookies on http://localhost, so this also works for local testing.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endStudioSession(): Promise<void> {
  (await cookies()).delete(STUDIO_COOKIE);
}
