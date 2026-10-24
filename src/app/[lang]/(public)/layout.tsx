import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDictionary } from "@/i18n/get-dictionary";

/** Shared shell for all public marketing pages (the private studio gets its own). */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getDictionary();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-fg px-4 py-2 font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:start-4 focus:top-3"
      >
        {t.common.skipToContent}
      </a>
      <SiteHeader locale={locale} t={t} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} t={t} />
    </>
  );
}
