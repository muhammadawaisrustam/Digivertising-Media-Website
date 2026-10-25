import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editablePages, isFixedPage, pagePath } from "@/features/pages/seed";
import { localeEnum, pageSlugSchema } from "@/features/pages/schema";
import { getEditorState } from "@/features/pages/service";
import { PageEditor } from "@/features/studio/editor/page-editor";
import { localizedPath } from "@/i18n/paths";
import { aiStatus } from "@/lib/ai";
import { requireStudio } from "@/lib/auth/studio-auth";
import { languageName } from "@/features/studio/labels";

export const metadata: Metadata = { title: "Edit page" };

export default async function EditPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  await requireStudio();
  const { slug, locale } = await params;
  const s = pageSlugSchema.safeParse(slug);
  const l = localeEnum.safeParse(locale);
  if (!s.success || !l.success) notFound();
  const state = await getEditorState(s.data, l.data);
  if (!state) notFound();
  const label = isFixedPage(s.data) ? editablePages[s.data].label : s.data;
  const other = l.data === "en" ? "ar" : "en";

  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb" className="text-sm text-subtle">
        <Link href="/studio/pages" className="hover:text-fg">Pages</Link> / <span className="text-muted">{label}</span>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-h2">
          {label} <span className="text-muted">· {languageName[l.data]}</span>
        </h1>
        {isFixedPage(s.data) ? (
          <Link href={`/studio/pages/${s.data}/${other}`} className="text-sm text-signal-300 underline">Edit the {languageName[other]} version</Link>
        ) : null}
      </div>
      <PageEditor key={`${s.data}-${l.data}`} initial={state} publicUrl={localizedPath(l.data, pagePath(s.data))} ai={aiStatus()} pageLabel={label} />
    </div>
  );
}
