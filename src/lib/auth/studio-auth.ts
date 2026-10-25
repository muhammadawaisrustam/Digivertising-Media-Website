import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createStudioClient } from "@/lib/supabase/clients";
import { isSupabaseMode } from "@/lib/supabase/config";
import { checkStudioConfig, createSessionToken, passwordMatches, SESSION_HOURS, verifySessionToken } from "./session-token";

/**
 * Studio sign-in.
 * - Supabase mode: Supabase Auth accounts. Each person has a role in the
 *   profiles table (owner, admin, editor, viewer; new accounts are "pending").
 *   Database access rules enforce the same roles again.
 * - Local mode (no Supabase settings): one owner password from .env.local and a
 *   signed, httpOnly cookie. For development and automated tests.
 * Every studio page and every studio server action checks the session itself.
 */

export type StudioRole = "owner" | "admin" | "editor" | "viewer";
export type StudioUser = { id: string; email: string; role: StudioRole | "pending" };

export const STAFF: StudioRole[] = ["owner", "admin", "editor", "viewer"];
export const EDITORS: StudioRole[] = ["owner", "admin", "editor"];
export const ADMINS: StudioRole[] = ["owner", "admin"];

export const STUDIO_COOKIE = "dv_studio";

export function studioAuthMode(): "supabase" | "password" {
  return isSupabaseMode() ? "supabase" : "password";
}

export function studioAuthConfig() {
  if (isSupabaseMode()) return { ok: true as const };
  return checkStudioConfig(process.env.STUDIO_PASSWORD, process.env.SESSION_SECRET);
}

export function hasRole(user: StudioUser | null, roles: StudioRole[]): user is StudioUser & { role: StudioRole } {
  return Boolean(user && user.role !== "pending" && roles.includes(user.role));
}

/** The signed-in studio user, or null. Always evaluated per request. */
export async function getStudioUser(): Promise<StudioUser | null> {
  // Reading cookies first makes every studio page render per request, so
  // settings from the environment are never frozen into a build.
  const store = await cookies();
  await connection();
  if (isSupabaseMode()) {
    const client = await createStudioClient();
    const { data } = await client.auth.getUser(); // verified with Supabase, not just decoded
    if (!data.user) return null;
    const { data: profile } = await client.from("profiles").select("role").eq("id", data.user.id).maybeSingle<{ role: StudioUser["role"] }>();
    return { id: data.user.id, email: data.user.email ?? "", role: profile?.role ?? "pending" };
  }
  if (!studioAuthConfig().ok) return null;
  if (!verifySessionToken(store.get(STUDIO_COOKIE)?.value, process.env.SESSION_SECRET!)) return null;
  return { id: "local-owner", email: "", role: "owner" };
}

export async function isStudioSignedIn(): Promise<boolean> {
  return hasRole(await getStudioUser(), STAFF);
}

/** For pages: sends visitors without access to the login page. */
export async function requireStudio(roles: StudioRole[] = STAFF): Promise<StudioUser & { role: StudioRole }> {
  const user = await getStudioUser();
  if (!user) redirect("/studio/login");
  if (user.role === "pending") redirect("/studio/login?status=pending");
  if (!hasRole(user, roles)) redirect("/studio?denied=1");
  return user;
}

export class StudioAccessError extends Error {}

/** For server actions: refuses to run unless the user has one of the roles. */
export async function assertStudio(roles: StudioRole[] = EDITORS): Promise<StudioUser & { role: StudioRole }> {
  const user = await getStudioUser();
  if (!hasRole(user, roles)) throw new StudioAccessError("You do not have permission to do this in the studio.");
  return user;
}

/* Local password mode ------------------------------------------------------ */

export function verifyStudioPassword(input: string): boolean {
  if (isSupabaseMode()) return false;
  const config = studioAuthConfig();
  if (!config.ok) return false;
  return passwordMatches(input, process.env.STUDIO_PASSWORD!);
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

/* Both modes ---------------------------------------------------------------- */

export async function endStudioSession(): Promise<void> {
  if (isSupabaseMode()) await (await createStudioClient()).auth.signOut();
  (await cookies()).delete(STUDIO_COOKIE);
}
