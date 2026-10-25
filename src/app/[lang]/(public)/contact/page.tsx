import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return pageMetadata({ locale, path: "/contact", title: t.contact.metaTitle, description: t.contact.metaDescription });
}

export default async function ContactPage() {
  const { locale, t } = await getDictionary();
  const c = t.contact;
  const lp = (p: string) => localizedPath(locale, p);

  return (
    <>
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        crumbs={{
          label: t.common.breadcrumbLabel,
          items: [
            { name: t.common.breadcrumbHome, href: lp("/") },
            { name: t.nav.contact, href: lp("/contact") },
          ],
        }}
      />
      <div className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <section aria-labelledby="form-heading" className="card p-6 md:p-8">
            <h2 id="form-heading" className="text-h3">{c.formHeading}</h2>
            <p className="mt-3 leading-relaxed text-muted">{c.formPending}</p>
            {siteConfig.contactEmail ? (
              <p className="mt-6">
                <span className="block text-sm text-subtle">{c.emailHeading}</span>
                <a href={`mailto:${siteConfig.contactEmail}`} dir="ltr" className="text-lg font-semibold text-signal-300 hover:underline">
                  {siteConfig.contactEmail}
                </a>
              </p>
            ) : null}
          </section>

          <section aria-labelledby="prepare-heading">
            <h2 id="prepare-heading" className="text-h3">{c.prepareHeading}</h2>
            <ul className="mt-4 space-y-3">
              {c.prepare.map((item) => (
                <li key={item} className="flex gap-3 text-muted">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-pulse-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <section aria-labelledby="next-heading" className="card p-6 md:p-8">
            <h2 id="next-heading" className="text-h3">{c.nextHeading}</h2>
            <ol className="mt-5 space-y-5">
              {c.next.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-signal-400/40 font-display text-sm font-semibold text-pulse-300">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-muted">{step}</span>
                </li>
              ))}
            </ol>
            <Link href={lp("/services")} className="btn btn-secondary mt-8 w-full">
              {t.common.exploreServices}
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
