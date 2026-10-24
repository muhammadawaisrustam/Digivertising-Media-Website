import { PageHeader } from "@/components/ui/page-header";
import type { LegalDoc } from "@/content/legal";
import { legalStatus } from "@/content/legal";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function LegalPage({ doc, t, crumbs }: { doc: LegalDoc; t: Dictionary; crumbs: { name: string; href: string }[] }) {
  return (
    <>
      <PageHeader eyebrow={t.footer.legalHeading} title={doc.title} crumbs={{ label: t.common.breadcrumbLabel, items: crumbs }} />
      <div className="container-page max-w-3xl py-12 md:py-16">
        {!legalStatus.reviewed ? (
          <p role="note" className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
            <strong className="font-semibold">{t.common.draftNotice}: </strong>
            {t.legal.reviewBanner}
          </p>
        ) : null}
        <p className="mt-6 text-sm text-subtle">
          {t.legal.updated}: {legalStatus.lastUpdated ?? "—"}
        </p>
        <div className="prose-legal">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-3">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
