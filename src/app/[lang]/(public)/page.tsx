import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ServiceExplorer, type ExplorerCategory } from "@/components/sections/service-explorer";
import { WorkforceNetwork } from "@/components/sections/workforce-network";
import { HeroVisual } from "@/components/three/hero-visual";
import { StaticGlobe } from "@/components/three/static-globe";
import { CheckIcon, ArrowIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/ui/json-ld";
import { categoryOrder, getServicesByCategory, serviceCategories } from "@/content/services";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return pageMetadata({
    locale,
    path: "/",
    title: `${t.meta.titleSuffix} | ${t.home.metaTitle}`,
    description: t.meta.siteDescription,
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const { locale, t } = await getDictionary();
  const h = t.home;
  const lp = (p: string) => localizedPath(locale, p);

  const categories: ExplorerCategory[] = categoryOrder.map((id) => ({
    id,
    label: serviceCategories[id][locale].label,
    description: serviceCategories[id][locale].description,
    services: getServicesByCategory(id).map((s) => ({
      slug: s.slug,
      title: s.content[locale].title,
      summary: s.content[locale].summary,
      href: lp(`/services/${s.slug}`),
    })),
  }));

  return (
    <>
      <JsonLd data={[organizationSchema(t.meta.siteDescription), websiteSchema(locale)]} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-48 end-[-10%] h-[36rem] w-[36rem] rounded-full bg-signal-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-page relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <p className="eyebrow">{h.hero.eyebrow}</p>
            <h1 className="text-display mt-5 text-balance">
              {h.hero.title} <span className="text-gradient">{h.hero.titleAccent}</span>
            </h1>
            <p className="text-lead mt-6 max-w-2xl">{h.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={lp("/contact")} className="btn btn-primary">
                {t.common.startProject}
                <ArrowIcon />
              </Link>
              <Link href={lp("/services")} className="btn btn-secondary">
                {t.common.exploreServices}
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              {h.hero.facts.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-pulse-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none">
            <HeroVisual label={h.hero.visualLabel} fallback={<StaticGlobe className="h-full w-full" />} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section border-t border-line" aria-labelledby="services-heading">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">{h.services.eyebrow}</p>
            <h2 id="services-heading" className="text-h2 mt-4 text-balance">{h.services.title}</h2>
            <p className="text-lead mt-4">{h.services.lead}</p>
          </div>
          <div className="mt-12">
            <ServiceExplorer categories={categories} allHref={lp("/services")} allLabel={t.common.viewAllServices} />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section border-t border-line bg-ink-900/40" aria-labelledby="process-heading">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">{h.process.eyebrow}</p>
            <h2 id="process-heading" className="text-h2 mt-4 text-balance">{h.process.title}</h2>
          </div>
          <div className="mt-12">
            <ProcessSteps steps={h.process.steps} />
          </div>
        </div>
      </section>

      {/* AI workforce */}
      <section className="section border-t border-line" aria-labelledby="workforce-heading">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow">{h.workforce.eyebrow}</p>
            <h2 id="workforce-heading" className="text-h2 mt-4 text-balance">{h.workforce.title}</h2>
            <p className="text-lead mt-5">{h.workforce.lead}</p>
            <ul className="mt-8 space-y-4">
              {h.workforce.points.map((p) => (
                <li key={p} className="flex gap-3 text-fg/90">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <WorkforceNetwork nodes={h.workforce.nodes} label={h.workforce.diagramLabel} />
        </div>
      </section>

      {/* Principles */}
      <section className="section border-t border-line bg-ink-900/40" aria-labelledby="principles-heading">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">{h.principles.eyebrow}</p>
            <h2 id="principles-heading" className="text-h2 mt-4 text-balance">{h.principles.title}</h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {h.principles.items.map((item) => (
              <li key={item.title} className="card reveal p-6">
                <h3 className="text-h3">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={h.cta.title} text={h.cta.text} href={lp("/contact")} label={t.common.startProject} />
    </>
  );
}
