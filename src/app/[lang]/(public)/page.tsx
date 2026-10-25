import type { Metadata } from "next";
import { JsonLd } from "@/components/ui/json-ld";
import { PageBlocks } from "@/features/pages/blocks/page-blocks";
import { getPublishedContent } from "@/features/pages/service";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

/** The homepage is built from editable blocks (see /studio). */
export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getDictionary();
  const page = await getPublishedContent("home", locale);
  return pageMetadata({ locale, path: "/", title: page!.meta.title, description: page!.meta.description, absoluteTitle: true });
}

export default async function HomePage() {
  const { locale, t } = await getDictionary();
  const page = await getPublishedContent("home", locale);
  return (
    <>
      <JsonLd data={[organizationSchema(t.meta.siteDescription), websiteSchema(locale)]} />
      <PageBlocks blocks={page!.blocks} locale={locale} t={t} />
    </>
  );
}
