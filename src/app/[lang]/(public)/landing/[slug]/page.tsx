import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBlocks } from "@/features/pages/blocks/page-blocks";
import { getPublishedContent, listPublishedLandingSlugs } from "@/features/pages/service";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";
import { pageMetadata } from "@/lib/seo/metadata";

/** Landing pages created in the studio. Only published pages are visible. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const slugs = await listPublishedLandingSlugs(params.lang === "ar" ? "ar" : "en");
  // At least one entry is required for prerendering; the placeholder renders a 404.
  return (slugs.length ? slugs : ["__none"]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/landing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getDictionary();
  const page = await getPublishedContent(slug, locale);
  if (!page) return {};
  return pageMetadata({ locale, path: `/landing/${slug}`, title: page.meta.title, description: page.meta.description });
}

export default async function LandingPage({ params }: PageProps<"/[lang]/landing/[slug]">) {
  const { slug } = await params;
  const { locale, t } = await getDictionary();
  const page = await getPublishedContent(slug, locale);
  if (!page) notFound();
  const crumbs = [
    { name: t.common.breadcrumbHome, href: localizedPath(locale, "/") },
    { name: page.meta.title, href: localizedPath(locale, `/landing/${slug}`) },
  ];
  return <PageBlocks blocks={page.blocks} locale={locale} t={t} crumbs={crumbs} />;
}
