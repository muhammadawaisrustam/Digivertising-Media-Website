import Link from "next/link";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/paths";

export default async function NotFound() {
  const { locale, t } = await getDictionary();
  const lp = (p: string) => localizedPath(locale, p);
  const links = [
    { href: lp("/"), label: t.common.breadcrumbHome },
    { href: lp("/services"), label: t.nav.services },
    { href: lp("/about"), label: t.nav.about },
    { href: lp("/contact"), label: t.nav.contact },
  ];
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <title>{`${t.notFound.metaTitle} | ${t.meta.titleSuffix}`}</title>
      <p className="font-display text-sm font-semibold text-pulse-300">404</p>
      <h1 className="text-h1 mt-3">{t.notFound.title}</h1>
      <p className="text-lead mt-4 max-w-xl">{t.notFound.text}</p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="btn btn-secondary">{l.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
