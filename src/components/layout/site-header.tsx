import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizedPath } from "@/i18n/paths";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { getNavItems } from "./nav-items";
import { NavLinks } from "./nav-links";

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  const items = getNavItems(locale, t);
  const other: Locale = locale === "en" ? "ar" : "en";
  const cta = { href: localizedPath(locale, "/contact"), label: t.common.startProject };
  const switcher = <LanguageSwitcher target={other} label={t.common.switchTo} ariaLabel={t.common.switchToLabel} />;

  return (
    <header className="glass sticky top-0 z-50 border-b border-line">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href={localizedPath(locale, "/")} className="relative z-50 rounded-lg">
          <Logo />
        </Link>
        <NavLinks items={items} label={t.common.mainNavigation} />
        <div className="hidden items-center gap-3 md:flex">
          {switcher}
          <Link href={cta.href} className="btn btn-primary">
            {cta.label}
          </Link>
        </div>
        <MobileNav
          items={items}
          cta={cta}
          labels={{ open: t.common.openMenu, close: t.common.closeMenu, nav: t.common.mainNavigation }}
          languageSwitcher={switcher}
        />
      </div>
    </header>
  );
}
