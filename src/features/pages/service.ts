import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import { getPublicReader, getStudioStore } from "@/lib/database";
import type { PageRecord } from "@/lib/database/types";
import { describeIssues, pageLocaleContentSchema, pageSlugSchema, type PageLocaleContent } from "./schema";
import { blankLandingPage, isFixedPage, seedPage } from "./seed";

export const pageTag = (slug: string, locale: Locale) => `page:${slug}:${locale}`;

export type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

/**
 * Published content for a public page. Cached; publishing invalidates the tag.
 * Falls back to the built-in version when nothing has been published yet.
 * A stored version that no longer passes validation is ignored, so a bad
 * record can never break the live page.
 */
export async function getPublishedContent(slug: string, locale: Locale): Promise<PageLocaleContent | null> {
  "use cache";
  cacheTag(pageTag(slug, locale));
  cacheLife("days");
  const published = await getPublicReader().getPublished(slug, locale);
  if (published) {
    const parsed = pageLocaleContentSchema.safeParse(published);
    if (parsed.success) return parsed.data;
    console.error(`Stored page ${slug}/${locale} failed validation; serving the built-in version.`);
  }
  return seedPage(slug, locale);
}

export type EditorState = {
  slug: string;
  locale: Locale;
  published: PageLocaleContent | null;
  /** What the editor should open: the saved draft, or a copy of the published version. */
  working: PageLocaleContent;
  hasDraft: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
  revisions: PageRecord["revisions"];
  usingBuiltIn: boolean;
};

export async function getEditorState(slug: string, locale: Locale): Promise<EditorState | null> {
  const record = await (await getStudioStore()).getPage(slug, locale);
  const builtIn = seedPage(slug, locale);
  const published = record?.published ?? builtIn;
  const working = record?.draft ?? published;
  if (!working) return null;
  return {
    slug,
    locale,
    published,
    working,
    hasDraft: Boolean(record?.draft),
    publishedAt: record?.publishedAt ?? null,
    updatedAt: record?.updatedAt ?? null,
    revisions: record?.revisions ?? [],
    usingBuiltIn: !record?.published && Boolean(builtIn),
  };
}

export async function listEditablePages(): Promise<{ slug: string; locales: Locale[]; hasDraft: boolean; publishedAt: string | null }[]> {
  const records = await (await getStudioStore()).listPages();
  const map = new Map<string, { slug: string; locales: Locale[]; hasDraft: boolean; publishedAt: string | null }>();
  for (const slug of ["home", "about"]) map.set(slug, { slug, locales: ["en", "ar"], hasDraft: false, publishedAt: null });
  for (const r of records) {
    const entry = map.get(r.slug) ?? { slug: r.slug, locales: [], hasDraft: false, publishedAt: null };
    if (!entry.locales.includes(r.locale)) entry.locales.push(r.locale);
    entry.hasDraft ||= Boolean(r.draft);
    if (r.publishedAt && (!entry.publishedAt || r.publishedAt > entry.publishedAt)) entry.publishedAt = r.publishedAt;
    map.set(r.slug, entry);
  }
  return [...map.values()];
}

/** Validates and saves a draft. The published page is never touched. */
export async function saveDraft(slug: string, locale: Locale, input: unknown): Promise<Result<PageLocaleContent>> {
  if (!pageSlugSchema.safeParse(slug).success) return { ok: false, errors: ["Invalid page address."] };
  const parsed = pageLocaleContentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: describeIssues(parsed.error) };
  await (await getStudioStore()).saveDraft(slug, locale, parsed.data);
  return { ok: true, value: parsed.data };
}

/**
 * Publishes the saved draft. The draft is validated again at publish time; if it
 * fails, nothing changes and the current live page stays as it is.
 */
export async function publishDraft(slug: string, locale: Locale, note: string): Promise<Result<PageLocaleContent>> {
  const record = await (await getStudioStore()).getPage(slug, locale);
  if (!record?.draft) return { ok: false, errors: ["There is no saved draft to publish. Save your changes first."] };
  const parsed = pageLocaleContentSchema.safeParse(record.draft);
  if (!parsed.success) return { ok: false, errors: describeIssues(parsed.error) };
  await (await getStudioStore()).publish(slug, locale, parsed.data, note.slice(0, 200) || "Published from the studio editor");
  return { ok: true, value: parsed.data };
}

/** Copies an earlier published version into the draft so it can be reviewed and re-published. */
export async function restoreRevision(slug: string, locale: Locale, revisionId: string): Promise<Result<PageLocaleContent>> {
  const record = await (await getStudioStore()).getPage(slug, locale);
  const revision = record?.revisions.find((r) => r.id === revisionId);
  if (!revision) return { ok: false, errors: ["That version could not be found."] };
  return saveDraft(slug, locale, revision.content);
}

export async function discardDraft(slug: string, locale: Locale) {
  await (await getStudioStore()).discardDraft(slug, locale);
}

export async function createLandingPage(slug: string, title: string, locale: Locale): Promise<Result<string>> {
  const s = pageSlugSchema.safeParse(slug);
  if (!s.success || isFixedPage(slug)) return { ok: false, errors: ["Use lowercase letters, numbers and hyphens, e.g. google-ads-audit."] };
  if (await (await getStudioStore()).getPage(slug, locale)) return { ok: false, errors: ["A page with that address already exists."] };
  if (!title.trim()) return { ok: false, errors: ["Enter a page title."] };
  const result = await saveDraft(slug, locale, blankLandingPage(title.trim()));
  return result.ok ? { ok: true, value: slug } : result;
}

/** Slugs of landing pages that have a published version in this language. */
export async function listPublishedLandingSlugs(locale: Locale): Promise<string[]> {
  return getPublicReader().listPublishedLandingSlugs(locale);
}
