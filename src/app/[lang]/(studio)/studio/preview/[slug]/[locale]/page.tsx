import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBlocks } from "@/features/pages/blocks/page-blocks";
import { localeEnum, pageSlugSchema } from "@/features/pages/schema";
import { getEditorState } from "@/features/pages/service";
import { localeMeta } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/get-dictionary-static";
import { requireStudio } from "@/lib/auth/studio-auth";

export const metadata: Metadata = { title: "Preview" };

/** Renders the saved draft (or live version) for the editor's preview frame. Studio only. */
export default async function PreviewPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  await requireStudio();
  const { slug, locale } = await params;
  const s = pageSlugSchema.safeParse(slug);
  const l = localeEnum.safeParse(locale);
  if (!s.success || !l.success) notFound();
  const state = await getEditorState(s.data, l.data);
  if (!state) notFound();
  return (
    <div lang={l.data} dir={localeMeta[l.data].dir} className={l.data === "ar" ? "preview-ar" : ""}>
      <p className="sticky top-0 z-50 bg-warning/90 px-4 py-1.5 text-center text-xs font-semibold text-ink-950" dir="ltr">
        Preview of the {state.hasDraft ? "saved draft" : "live version"}. Not visible to visitors.
      </p>
      <main>
        <PageBlocks blocks={state.working.blocks} locale={l.data} t={getDictionaryFor(l.data)} preview />
      </main>
    </div>
  );
}
