import Link from "next/link";
import { JsonLd } from "./json-ld";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <>
      <nav aria-label={label} className="text-sm text-subtle">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-muted">{item.name}</span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-fg">{item.name}</Link>
                    <span aria-hidden="true" className="text-line-strong">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items.map((c) => ({ name: c.name, path: c.href })))} />
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: { items: Crumb[]; label: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-signal-500/20 blur-3xl rtl:translate-x-1/2"
        aria-hidden="true"
      />
      <div className="container-page relative py-14 md:py-20">
        {crumbs ? <Breadcrumbs items={crumbs.items} label={crumbs.label} /> : null}
        <p className="eyebrow mt-6">{eyebrow}</p>
        <h1 className="text-h1 mt-4 max-w-4xl text-balance">{title}</h1>
        {lead ? <p className="text-lead mt-5 max-w-3xl">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
