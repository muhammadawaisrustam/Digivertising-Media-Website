import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { ArrowIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { categoryOrder, getServicesByCategory, serviceCategories } from "@/content/services";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return pageMetadata({ locale, path: "/services", title: t.servicesPage.metaTitle, description: t.servicesPage.metaDescription });
}

export default async function ServicesPage() {
  const { locale, t } = await getDictionary();
  const lp = (p: string) => localizedPath(locale, p);

  return (
    <>
      <PageHeader
        eyebrow={t.servicesPage.eyebrow}
        title={t.servicesPage.title}
        lead={t.servicesPage.lead}
        crumbs={{
          label: t.common.breadcrumbLabel,
          items: [
            { name: t.common.breadcrumbHome, href: lp("/") },
            { name: t.nav.services, href: lp("/services") },
          ],
        }}
      >
        <nav aria-label={t.nav.services} className="mt-8 flex flex-wrap gap-2">
          {categoryOrder.map((id) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-line-strong px-4 py-2 text-sm text-muted hover:border-signal-400/50 hover:text-fg">
              {serviceCategories[id][locale].label}
            </a>
          ))}
        </nav>
      </PageHeader>

      {categoryOrder.map((id, i) => (
        <section key={id} id={id} aria-labelledby={`${id}-heading`} className={`section ${i % 2 ? "bg-ink-900/40" : ""} border-b border-line`}>
          <div className="container-page grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id={`${id}-heading`} className="text-h2">{serviceCategories[id][locale].label}</h2>
              <p className="mt-4 text-muted">{serviceCategories[id][locale].description}</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {getServicesByCategory(id).map((s) => (
                <li key={s.slug} className="card card-interactive reveal">
                  <Link href={lp(`/services/${s.slug}`)} className="flex h-full flex-col p-6">
                    <h3 className="text-h3">{s.content[locale].title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.content[locale].summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-signal-300">
                      {t.common.learnMore}
                      <span className="sr-only">: {s.content[locale].title}</span>
                      <ArrowIcon />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <CtaBand title={t.home.cta.title} text={t.home.cta.text} href={lp("/request-a-proposal")} label={t.common.startProject} />
    </>
  );
}
