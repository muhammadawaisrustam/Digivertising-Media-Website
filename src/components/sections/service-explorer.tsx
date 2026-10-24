"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/icons";

export type ExplorerCategory = {
  id: string;
  label: string;
  description: string;
  services: { slug: string; title: string; summary: string; href: string }[];
};

/**
 * Interactive service explorer (accessible tabs). Without JavaScript the first
 * category is shown and every service remains reachable from /services.
 */
export function ServiceExplorer({ categories, allHref, allLabel }: { categories: ExplorerCategory[]; allHref: string; allLabel: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const current = categories[active]!;

  function onKeyDown(e: React.KeyboardEvent) {
    const rtl = document.documentElement.dir === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const backward = rtl ? "ArrowRight" : "ArrowLeft";
    let next = active;
    if (e.key === forward || e.key === "ArrowDown") next = (active + 1) % categories.length;
    else if (e.key === backward || e.key === "ArrowUp") next = (active - 1 + categories.length) % categories.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = categories.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div role="tablist" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0" onKeyDown={onKeyDown}>
        {categories.map((c, i) => {
          const selected = i === active;
          return (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`${base}-tab-${c.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group shrink-0 rounded-2xl border px-5 py-4 text-start transition-colors lg:w-full ${
                selected
                  ? "border-signal-400/50 bg-gradient-to-r from-signal-500/15 to-pulse-400/5 text-fg shadow-[var(--shadow-glow)]"
                  : "border-line bg-white/[0.02] text-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-display text-base font-semibold whitespace-nowrap lg:text-lg">{c.label}</span>
                <span className={`hidden text-xs tabular-nums lg:inline ${selected ? "text-pulse-300" : "text-subtle"}`}>
                  {String(c.services.length).padStart(2, "0")}
                </span>
              </span>
              <span className="mt-1 hidden text-sm leading-relaxed text-muted lg:block">{c.description}</span>
            </button>
          );
        })}
      </div>

      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${current.id}`} className="lg:col-span-8">
        <p className="mb-5 text-muted lg:hidden">{current.description}</p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {current.services.map((s) => (
            <li key={s.slug} className="card card-interactive">
              <Link href={s.href} className="flex h-full flex-col p-6">
                <span className="font-display text-lg font-semibold text-fg">{s.title}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.summary}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-signal-300">
                  <span className="sr-only">{s.title}: </span>
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={allHref} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-signal-300 hover:text-signal-400">
          {allLabel}
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}
