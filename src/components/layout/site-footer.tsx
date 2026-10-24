import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { categoryOrder, getServicesByCategory } from "@/content/services";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizedPath } from "@/i18n/paths";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = await currentYear();
  const lp = (p: string) => localizedPath(locale, p);
  // Two services per category keep the footer short; the full list is on /services.
  const featured = categoryOrder.flatMap((c) => getServicesByCategory(c).slice(0, 2));

  return (
    <footer className="border-t border-line bg-ink-900/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          {siteConfig.contactEmail ? (
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-4 inline-block text-sm text-signal-300 hover:underline">
              {siteConfig.contactEmail}
            </a>
          ) : null}
        </div>

        <nav aria-labelledby="footer-services" className="md:col-span-4">
          <h2 id="footer-services" className="text-sm font-semibold text-fg">
            {t.footer.servicesHeading}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            {featured.map((s) => (
              <li key={s.slug}>
                <Link href={lp(`/services/${s.slug}`)} className="text-muted hover:text-fg">
                  {s.content[locale].title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={lp("/services")} className="font-medium text-signal-300 hover:text-signal-400">
                {t.common.viewAllServices}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-company" className="md:col-span-2">
          <h2 id="footer-company" className="text-sm font-semibold text-fg">
            {t.footer.companyHeading}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href={lp("/about")} className="text-muted hover:text-fg">{t.nav.about}</Link></li>
            <li><Link href={lp("/services")} className="text-muted hover:text-fg">{t.nav.services}</Link></li>
            <li><Link href={lp("/contact")} className="text-muted hover:text-fg">{t.nav.contact}</Link></li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-legal" className="md:col-span-2">
          <h2 id="footer-legal" className="text-sm font-semibold text-fg">
            {t.footer.legalHeading}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href={lp("/privacy")} className="text-muted hover:text-fg">{t.footer.privacy}</Link></li>
            <li><Link href={lp("/terms")} className="text-muted hover:text-fg">{t.footer.terms}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-6 text-xs text-subtle">
          © {year} {siteConfig.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
