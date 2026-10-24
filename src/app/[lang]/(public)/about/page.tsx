import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { ProcessSteps } from "@/components/sections/process-steps";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return pageMetadata({ locale, path: "/about", title: t.about.metaTitle, description: t.about.metaDescription });
}

export default async function AboutPage() {
  const { locale, t } = await getDictionary();
  const a = t.about;
  const lp = (p: string) => localizedPath(locale, p);

  return (
    <>
      <PageHeader
        eyebrow={a.eyebrow}
        title={a.title}
        lead={a.lead}
        crumbs={{
          label: t.common.breadcrumbLabel,
          items: [
            { name: t.common.breadcrumbHome, href: lp("/") },
            { name: t.nav.about, href: lp("/about") },
          ],
        }}
      />

      <section className="section" aria-labelledby="believe">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <h2 id="believe" className="text-h2 lg:col-span-4">{a.positioningHeading}</h2>
          <div className="space-y-6 text-lg leading-relaxed text-fg/85 lg:col-span-8">
            {a.positioning.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-ink-900/40" aria-labelledby="values">
        <div className="container-page">
          <h2 id="values" className="text-h2">{a.valuesHeading}</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {a.values.map((v) => (
              <li key={v.title} className="card reveal p-6">
                <h3 className="text-h3">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="process">
        <div className="container-page">
          <h2 id="process" className="text-h2">{a.processHeading}</h2>
          <div className="mt-10">
            <ProcessSteps steps={t.home.process.steps} />
          </div>
        </div>
      </section>

      <CtaBand title={t.home.cta.title} text={t.home.cta.text} href={lp("/contact")} label={t.common.startProject} />
    </>
  );
}
