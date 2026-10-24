"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { switchLocalePath } from "@/i18n/paths";
import { usePublicPathname } from "./nav-links";

export function LanguageSwitcher({
  target,
  label,
  ariaLabel,
  className = "",
}: {
  target: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
}) {
  const pathname = usePublicPathname();
  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      aria-label={ariaLabel}
      className={`inline-flex min-h-10 items-center rounded-full border border-line-strong px-3.5 text-sm font-medium text-fg transition-colors hover:border-signal-400/60 hover:bg-white/5 ${className}`}
    >
      {label}
    </Link>
  );
}
