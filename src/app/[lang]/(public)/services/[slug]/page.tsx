import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHeader } from "@/components/ui/page-header";
import { getRelatedServices, getService, serviceCategories, services } from "@/content/services";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";
import { serviceSchema } from "@/lib/seo/structured-data";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const { locale } = await getDictionary();
  const c = service.content[locale];
  return pageMetadata({ locale, path: `/services/${slug}`, title: c.metaTitle, description: c.metaDescription });
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const { locale, t } = await getDictionary();
  const c = service.content[locale];
  const d = t.serviceDetail;
  const lp = (p: string) => localizedPath(locale, p);
  const category = serviceCategories[service.category][locale];
  const related = getRelatedServices(service);

  return (
    <>
      <JsonLd
        data={serviceSchema({ name: c.title, description: c.metaDescription, path: lp(`/services/${slug}`), category: category.label, locale })}
      />
      <PageHeader
        eyebrow={category.label}
        title={c.title}
        lead={c.summary}
        crumbs={{
          label: t.common.breadcrumbLabel,
          items: [
            { name: t.common.breadcrumbHome, href: lp("/") },
            { name: t.nav.services, href: lp("/services") },
            { name: c.title, href: lp(`/services/${slug}`) },
          ],
        }}
      >
        <Link href={lp("/request-a-proposal")} className="btn btn-primary mt-8">
          {t.common.startProject}
          <ArrowIcon />
        </Link>
      </PageHeader>

      <div className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <article className="space-y-14 lg:col-span-8">
          <p className="text-lg leading-relaxed text-fg/90">{c.intro}</p>

          <section aria-labelledby="signals">
            <h2 id="signals" className="text-h2">{d.signalsHeading}</h2>
            <ul className="mt-6 space-y-3">
              {c.signals.map((s) => (
                <li key={s} className="flex gap-3 text-muted">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-pulse-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="includes">
            <h2 id="includes" className="text-h2">{d.includesHeading}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {c.includes.map((item) => (
                <li key={item.title} className="card p-6">
                  <h3 className="text-h3">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq">
            <h2 id="faq" className="text-h2">{d.faqHeading}</h2>
            <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
              {c.faqs.map((f) => (
                <details key={f.q} className="group p-5 open:bg-white/[0.02]">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium text-fg [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-semibold">{f.q}</h3>
                    <span aria-hidden="true" className="mt-0.5 text-xl leading-none text-signal-300 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-6 lg:col-span-4">
          <section aria-labelledby="deliverables" className="card p-6 lg:sticky lg:top-24">
            <h2 id="deliverables" className="text-h3">{d.deliverablesHeading}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {c.deliverables.map((x) => (
                <li key={x} className="flex gap-2.5 text-muted">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            {c.note ? (
              <div className="mt-6 rounded-xl border border-warning/30 bg-warning/5 p-4">
                <h3 className="text-sm font-semibold text-warning">{d.noteHeading}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.note}</p>
              </div>
            ) : null}
          </section>
        </aside>
      </div>

      {related.length ? (
        <section aria-labelledby="related" className="section border-t border-line bg-ink-900/40">
          <div className="container-page">
            <h2 id="related" className="text-h2">{d.relatedHeading}</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.slug} className="card card-interactive">
                  <Link href={lp(`/services/${r.slug}`)} className="flex h-full flex-col p-5">
                    <h3 className="font-display font-semibold text-fg">{r.content[locale].title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{r.content[locale].summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaBand title={d.ctaTitle} text={d.ctaText} href={lp("/request-a-proposal")} label={t.common.startProject} />
    </>
  );
}
