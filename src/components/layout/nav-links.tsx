"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./nav-items";

/** Normalises internal (/en/...) and public paths so active states work in both. */
export function usePublicPathname(): string {
  const raw = usePathname() ?? "/";
  return raw === "/en" ? "/" : raw.startsWith("/en/") ? raw.slice(3) : raw;
}

export function isActive(pathname: string, href: string): boolean {
  if (href === "/" || href === "/ar") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePublicPathname();
  return (
    <nav aria-label={label} className="hidden md:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                  active ? "bg-white/[0.07] text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
