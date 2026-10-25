import type { Metadata } from "next";
import { CheckIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";
import { ProposalAssistant } from "@/features/leads/proposal-assistant";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return pageMetadata({ locale, path: "/request-a-proposal", title: t.proposalPage.metaTitle, description: t.proposalPage.metaDescription });
}

export default async function RequestProposalPage() {
  const { locale, t } = await getDictionary();
  const p = t.proposalPage;
  const lp = (path: string) => localizedPath(locale, path);
  return (
    <>
      <PageHeader
        eyebrow={p.eyebrow}
        title={p.title}
        lead={p.lead}
        crumbs={{
          label: t.common.breadcrumbLabel,
          items: [
            { name: t.common.breadcrumbHome, href: lp("/") },
            { name: p.eyebrow, href: lp("/request-a-proposal") },
          ],
        }}
      />
      <div className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ProposalAssistant locale={locale} />
        </div>
        <aside className="lg:col-span-4">
          <section aria-labelledby="how-heading" className="card p-6">
            <h2 id="how-heading" className="text-h3">{p.asideHeading}</h2>
            <ul className="mt-4 space-y-4">
              {p.aside.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-pulse-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-subtle">{t.contact.emailAlt}</p>
            <a href={`mailto:${siteConfig.contactEmail}`} dir="ltr" className="font-semibold text-signal-300 hover:underline">{siteConfig.contactEmail}</a>
          </section>
        </aside>
      </div>
    </>
  );
}
