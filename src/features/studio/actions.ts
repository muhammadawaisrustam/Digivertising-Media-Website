"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { suggestPageEdit, MAX_INSTRUCTION, type PageEditSuggestion } from "@/features/pages/ai-edit";
import { localeEnum, pageLocaleContentSchema, pageSlugSchema, type PageLocaleContent } from "@/features/pages/schema";
import { createLandingPage, discardDraft, getEditorState, pageTag, publishDraft, restoreRevision, saveDraft, type EditorState, type Result } from "@/features/pages/service";
import { getAiProvider } from "@/lib/ai";
import { assertStudio, endStudioSession, startStudioSession, studioAuthConfig, studioAuthMode, verifyStudioPassword } from "@/lib/auth/studio-auth";
import { createStudioClient } from "@/lib/supabase/clients";
import { clientIp } from "@/lib/security/client-ip";
import { rateLimit } from "@/lib/security/rate-limit";

/**
 * Studio server actions. Each one checks the studio session itself: hiding a
 * button in the UI is never treated as protection.
 */

function target(slug: unknown, locale: unknown) {
  const s = pageSlugSchema.safeParse(slug);
  const l = localeEnum.safeParse(locale);
  if (!s.success || !l.success) throw new Error("Invalid page or language.");
  return { slug: s.data, locale: l.data };
}

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!studioAuthConfig().ok) return { error: "The studio login is not set up on this server yet. See docs/editor.md." };
  const ip = await clientIp();
  // LOGIN_RATE_LIMIT exists only so automated tests can raise it.
  if (!rateLimit(`login:${ip}`, Number(process.env.LOGIN_RATE_LIMIT) || 5, 15 * 60 * 1000).allowed) return { error: "Too many attempts. Please wait 15 minutes and try again." };
  const password = String(formData.get("password") ?? "");

  if (studioAuthMode() === "supabase") {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    if (!email || !password) return { error: "Enter your email and password." };
    const client = await createStudioClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    // One message for every failure, so the form does not reveal which emails have accounts.
    if (error || !data.user) return { error: "Email or password is not correct." };
    const { data: profile } = await client.from("profiles").select("role").eq("id", data.user.id).maybeSingle<{ role: string }>();
    if (!profile || profile.role === "pending") {
      await client.auth.signOut();
      return { error: "Your account is waiting for the owner to give it access." };
    }
    redirect("/studio");
  }

  if (!verifyStudioPassword(password)) return { error: "That password is not correct." };
  await startStudioSession();
  redirect("/studio");
}

export async function logoutAction() {
  await endStudioSession();
  redirect("/studio/login");
}

export async function saveDraftAction(slug: string, locale: string, content: PageLocaleContent): Promise<Result<EditorState>> {
  await assertStudio();
  const t = target(slug, locale);
  const saved = await saveDraft(t.slug, t.locale, content);
  if (!saved.ok) return saved;
  return { ok: true, value: (await getEditorState(t.slug, t.locale))! };
}

/** Saves the current editor content as the draft, then publishes it. */
export async function publishAction(slug: string, locale: string, content: PageLocaleContent, note: string): Promise<Result<EditorState>> {
  await assertStudio();
  const t = target(slug, locale);
  const saved = await saveDraft(t.slug, t.locale, content);
  if (!saved.ok) return saved;
  const published = await publishDraft(t.slug, t.locale, String(note ?? ""));
  if (!published.ok) return published;
  // Refresh the cached public page so visitors see the new version straight away.
  updateTag(pageTag(t.slug, t.locale));
  return { ok: true, value: (await getEditorState(t.slug, t.locale))! };
}

export async function discardDraftAction(slug: string, locale: string): Promise<Result<EditorState>> {
  await assertStudio();
  const t = target(slug, locale);
  await discardDraft(t.slug, t.locale);
  const state = await getEditorState(t.slug, t.locale);
  return state ? { ok: true, value: state } : { ok: false, errors: ["This page has no published version yet."] };
}

export async function restoreRevisionAction(slug: string, locale: string, revisionId: string): Promise<Result<EditorState>> {
  await assertStudio();
  const t = target(slug, locale);
  const restored = await restoreRevision(t.slug, t.locale, String(revisionId));
  if (!restored.ok) return restored;
  return { ok: true, value: (await getEditorState(t.slug, t.locale))! };
}

export type CreatePageState = { error?: string };

export async function createLandingPageAction(_prev: CreatePageState, formData: FormData): Promise<CreatePageState> {
  await assertStudio();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const title = String(formData.get("title") ?? "");
  const locale = localeEnum.safeParse(formData.get("locale"));
  if (!locale.success) return { error: "Choose a language." };
  const result = await createLandingPage(slug, title, locale.data);
  if (!result.ok) return { error: result.errors.join(" ") };
  redirect(`/studio/pages/${slug}/${locale.data}`);
}

export type AiSuggestResult =
  | { ok: true; suggestion: PageEditSuggestion }
  | { ok: false; reason: "not_configured" | "invalid" | "failed"; message: string };

/** Asks the configured AI provider for a suggestion. Returns it for review only; nothing is saved. */
export async function aiSuggestAction(slug: string, locale: string, content: PageLocaleContent, instruction: string): Promise<AiSuggestResult> {
  await assertStudio();
  const t = target(slug, locale);
  const provider = getAiProvider();
  if (!provider) return { ok: false, reason: "not_configured", message: "AI is not configured on this server, so no suggestion was made." };
  const current = pageLocaleContentSchema.safeParse(content);
  if (!current.success) return { ok: false, reason: "invalid", message: "Fix the highlighted problems on the page before asking for an AI suggestion." };
  const text = String(instruction ?? "").trim();
  if (text.length < 5 || text.length > MAX_INSTRUCTION) return { ok: false, reason: "invalid", message: `Describe the change in 5 to ${MAX_INSTRUCTION} characters.` };
  try {
    const suggestion = await suggestPageEdit(provider, current.data, text, t.locale);
    return { ok: true, suggestion };
  } catch (err) {
    console.error("AI page edit failed", err);
    return { ok: false, reason: "failed", message: "The AI response could not be used (it failed or did not match the page format). Nothing was changed." };
  }
}
