import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { legalStatus, privacyPolicy } from "@/content/legal";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getDictionary();
  const doc = privacyPolicy[locale];
  // Kept out of search results until the legal text has been reviewed.
  return pageMetadata({ locale, path: "/privacy", title: doc.title, description: doc.metaDescription, noIndex: !legalStatus.reviewed });
}

export default async function Page() {
  const { locale, t } = await getDictionary();
  const doc = privacyPolicy[locale];
  return (
    <LegalPage
      doc={doc}
      t={t}
      crumbs={[
        { name: t.common.breadcrumbHome, href: localizedPath(locale, "/") },
        { name: doc.title, href: localizedPath(locale, "/privacy") },
      ]}
    />
  );
}
