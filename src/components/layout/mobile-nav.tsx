"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "./nav-items";
import { isActive, usePublicPathname } from "./nav-links";

type Props = {
  items: NavItem[];
  cta: NavItem;
  labels: { open: string; close: string; nav: string };
  languageSwitcher: React.ReactNode;
};

export function MobileNav({ items, cta, labels, languageSwitcher }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePublicPathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the menu whenever the route changes (state survives navigation otherwise).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      // Keep keyboard focus inside the open menu.
      const focusable = [buttonRef.current, ...panel.querySelectorAll<HTMLElement>("a, button")].filter(
        (el): el is HTMLElement => Boolean(el),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-fg"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="glass fixed inset-x-0 top-0 z-40 h-dvh overflow-y-auto px-4 pb-10 pt-24"
      >
        <nav aria-label={labels.nav}>
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3.5 font-display text-2xl font-semibold ${
                      active ? "bg-white/[0.07] text-fg" : "text-fg/85"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-8 flex flex-wrap items-center gap-3 px-4">
          <Link href={cta.href} onClick={() => setOpen(false)} className="btn btn-primary">
            {cta.label}
          </Link>
          {languageSwitcher}
        </div>
      </div>
    </div>
  );
}
