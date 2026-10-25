import type { Metadata } from "next";
import { PageBlocks } from "@/features/pages/blocks/page-blocks";
import { getPublishedContent } from "@/features/pages/service";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";

/** The About page is built from editable blocks (see /studio). */
export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getDictionary();
  const page = await getPublishedContent("about", locale);
  return pageMetadata({ locale, path: "/about", title: page!.meta.title, description: page!.meta.description });
}

export default async function AboutPage() {
  const { locale, t } = await getDictionary();
  const page = await getPublishedContent("about", locale);
  const crumbs = [
    { name: t.common.breadcrumbHome, href: localizedPath(locale, "/") },
    { name: t.nav.about, href: localizedPath(locale, "/about") },
  ];
  return <PageBlocks blocks={page!.blocks} locale={locale} t={t} crumbs={crumbs} />;
}
