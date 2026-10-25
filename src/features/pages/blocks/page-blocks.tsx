import Link from "next/link";
import { ContactForm } from "@/features/leads/contact-form";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ServiceExplorer, type ExplorerCategory } from "@/components/sections/service-explorer";
import { WorkforceNetwork } from "@/components/sections/workforce-network";
import { HeroVisual } from "@/components/three/hero-visual";
import { StaticGlobe } from "@/components/three/static-globe";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { Breadcrumbs, type Crumb } from "@/components/ui/page-header";
import { categoryOrder, getServicesByCategory, serviceCategories } from "@/content/services";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { localizedPath } from "@/i18n/paths";
import type { Block, BlockSettings } from "../schema";

type Ctx = { locale: Locale; t: Dictionary; preview: boolean; crumbs?: Crumb[] };

const bg: Record<BlockSettings["background"], string> = {
  default: "",
  subtle: "bg-ink-900/40",
  glow: "bg-[radial-gradient(ellipse_at_top,rgb(76_125_255/0.16),transparent_65%)]",
};
const pad: Record<BlockSettings["spacing"], string> = {
  compact: "py-10 md:py-14",
  normal: "section",
  spacious: "py-24 md:py-36",
};

function Section({ block, children, label }: { block: Block; children: React.ReactNode; label?: string }) {
  const { background, spacing, align } = block.settings;
  return (
    <section
      data-block={block.type}
      data-block-id={block.id}
      aria-labelledby={label}
      className={`border-t border-line first:border-t-0 ${bg[background]} ${pad[spacing]} ${align === "center" ? "text-center" : ""}`}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

function Heading({ id, level, children, className = "" }: { id: string; level: 1 | 2; children: React.ReactNode; className?: string }) {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <Tag id={id} className={`${level === 1 ? "text-h1" : "text-h2"} text-balance ${className}`}>
      {children}
    </Tag>
  );
}

function Intro({ eyebrow, heading, lead, id, level, center }: { eyebrow?: string; heading: string; lead?: string; id: string; level: 1 | 2; center: boolean }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading id={id} level={level} className={eyebrow ? "mt-4" : ""}>{heading}</Heading>
      {lead ? <p className="text-lead mt-4">{lead}</p> : null}
    </div>
  );
}

function PreviewOnlyNotice({ children }: { children: React.ReactNode }) {
  return (
    <p role="note" className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
      {children}
    </p>
  );
}

function renderBlock(block: Block, ctx: Ctx, level: 1 | 2) {
  const { locale, t } = ctx;
  const hid = `h-${block.id}`;
  const center = block.settings.align === "center";

  switch (block.type) {
    case "hero": {
      const d = block.data;
      const ctas = (
        <div className={`mt-8 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
          {d.primaryCta ? (
            <Link href={d.primaryCta.href} className="btn btn-primary">
              {d.primaryCta.label}
              <ArrowIcon />
            </Link>
          ) : null}
          {d.secondaryCta ? <Link href={d.secondaryCta.href} className="btn btn-secondary">{d.secondaryCta.label}</Link> : null}
        </div>
      );
      const title = (
        <>
          {d.title}
          {d.titleAccent ? <> <span className="text-gradient">{d.titleAccent}</span></> : null}
        </>
      );
      if (d.visual === "none") {
        return (
          <section key={block.id} data-block="hero" data-block-id={block.id} className="relative overflow-hidden border-b border-line">
            <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-signal-500/20 blur-3xl rtl:translate-x-1/2" aria-hidden="true" />
            <div className={`container-page relative py-14 md:py-20 ${center ? "text-center" : ""}`}>
              {ctx.crumbs ? <Breadcrumbs items={ctx.crumbs} label={t.common.breadcrumbLabel} /> : null}
              {d.eyebrow ? <p className="eyebrow mt-6">{d.eyebrow}</p> : null}
              <Heading id={hid} level={level} className={`mt-4 max-w-4xl ${center ? "mx-auto" : ""}`}>{title}</Heading>
              {d.lead ? <p className={`text-lead mt-5 max-w-3xl ${center ? "mx-auto" : ""}`}>{d.lead}</p> : null}
              {d.primaryCta || d.secondaryCta ? ctas : null}
            </div>
          </section>
        );
      }
      return (
        <section key={block.id} data-block="hero" data-block-id={block.id} className="relative overflow-hidden">
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute -top-48 end-[-10%] h-[36rem] w-[36rem] rounded-full bg-signal-500/20 blur-3xl" aria-hidden="true" />
          <div className="container-page relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              {d.eyebrow ? <p className="eyebrow">{d.eyebrow}</p> : null}
              {level === 1 ? (
                <h1 id={hid} className="text-display mt-5 text-balance">{title}</h1>
              ) : (
                <h2 id={hid} className="text-display mt-5 text-balance">{title}</h2>
              )}
              {d.lead ? <p className="text-lead mt-6 max-w-2xl">{d.lead}</p> : null}
              {ctas}
              {d.facts.length ? (
                <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
                  {d.facts.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-pulse-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none">
              {ctx.preview ? (
                <div role="img" aria-label={t.home.hero.visualLabel} className="relative aspect-square w-full" data-visual-mode="static">
                  <StaticGlobe className="h-full w-full" />
                </div>
              ) : (
                <HeroVisual label={t.home.hero.visualLabel} fallback={<StaticGlobe className="h-full w-full" />} />
              )}
            </div>
          </div>
        </section>
      );
    }

    case "text":
      return (
        <Section key={block.id} block={block} label={block.data.heading ? hid : undefined}>
          <div className={center ? "mx-auto max-w-3xl" : "grid gap-10 lg:grid-cols-12"}>
            {block.data.heading ? (
              <div className={center ? "" : "lg:col-span-4"}>
                {block.data.eyebrow ? <p className="eyebrow">{block.data.eyebrow}</p> : null}
                <Heading id={hid} level={level} className={block.data.eyebrow ? "mt-4" : ""}>{block.data.heading}</Heading>
              </div>
            ) : null}
            <div className={`space-y-6 text-lg leading-relaxed text-fg/85 ${center ? "mt-6" : block.data.heading ? "lg:col-span-8" : "lg:col-span-12 max-w-3xl"}`}>
              {block.data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </Section>
      );

    case "imageText": {
      const d = block.data;
      return (
        <Section key={block.id} block={block} label={hid}>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className={d.imagePosition === "start" ? "lg:order-2" : ""}>
              <Heading id={hid} level={level}>{d.heading}</Heading>
              <p className="text-lead mt-4 whitespace-pre-line">{d.text}</p>
              {d.cta ? (
                <Link href={d.cta.href} className="btn btn-secondary mt-6">{d.cta.label}</Link>
              ) : null}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- editor images can come from any approved https source */}
            <img src={d.image.src} alt={d.image.alt} loading="lazy" decoding="async" className="card w-full object-cover" />
          </div>
        </Section>
      );
    }

    case "serviceGrid": {
      const d = block.data;
      const cats = d.categories.length ? categoryOrder.filter((c) => d.categories.includes(c)) : categoryOrder;
      const lp = (p: string) => localizedPath(locale, p);
      const categories: ExplorerCategory[] = cats.map((id) => ({
        id,
        label: serviceCategories[id][locale].label,
        description: serviceCategories[id][locale].description,
        services: getServicesByCategory(id).map((s) => ({
          slug: s.slug,
          title: s.content[locale].title,
          summary: s.content[locale].summary,
          href: lp(`/services/${s.slug}`),
        })),
      }));
      return (
        <Section key={block.id} block={block} label={hid}>
          <Intro eyebrow={d.eyebrow} heading={d.heading} lead={d.lead} id={hid} level={level} center={center} />
          <div className="mt-12 text-start">
            {d.layout === "explorer" ? (
              <ServiceExplorer categories={categories} allHref={lp("/services")} allLabel={t.common.viewAllServices} />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.flatMap((c) => c.services).map((s) => (
                  <li key={s.slug} className="card card-interactive">
                    <Link href={s.href} className="flex h-full flex-col p-6">
                      <span className="font-display text-lg font-semibold">{s.title}</span>
                      <span className="mt-2 text-sm text-muted">{s.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      );
    }

    case "featureList": {
      const d = block.data;
      return (
        <Section key={block.id} block={block} label={hid}>
          <Intro eyebrow={d.eyebrow} heading={d.heading} lead={d.lead} id={hid} level={level} center={center} />
          <ul className={`mt-12 grid gap-4 text-start sm:grid-cols-2 ${d.items.length % 3 === 0 ? "lg:grid-cols-3" : d.items.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
            {d.items.map((item, i) => (
              <li key={i} className="card reveal p-6">
                <h3 className="text-h3">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      );
    }

    case "process":
      return (
        <Section key={block.id} block={block} label={hid}>
          <Intro eyebrow={block.data.eyebrow} heading={block.data.heading} id={hid} level={level} center={center} />
          <div className="mt-12 text-start">
            <ProcessSteps steps={block.data.steps} />
          </div>
        </Section>
      );

    case "testimonial": {
      const d = block.data;
      if (!d.permissionConfirmed && !ctx.preview) return null;
      return (
        <Section key={block.id} block={block}>
          {!d.permissionConfirmed ? <PreviewOnlyNotice>Hidden on the live site until you confirm you have permission to publish this testimonial.</PreviewOnlyNotice> : null}
          <figure className={`card max-w-3xl p-8 ${center ? "mx-auto" : ""}`}>
            <blockquote className="text-xl leading-relaxed text-fg">&ldquo;{d.quote}&rdquo;</blockquote>
            <figcaption className="mt-5 text-sm text-muted">
              <span className="font-semibold text-fg">{d.name}</span>
              {d.role || d.company ? `, ${[d.role, d.company].filter(Boolean).join(", ")}` : ""}
            </figcaption>
          </figure>
        </Section>
      );
    }

    case "caseStudy": {
      const d = block.data;
      if (!d.verified && !ctx.preview) return null;
      const parts = locale === "ar"
        ? [["التحدي", d.challenge], ["النهج", d.approach], ["النتيجة", d.outcome]]
        : [["Challenge", d.challenge], ["Approach", d.approach], ["Outcome", d.outcome]];
      return (
        <Section key={block.id} block={block} label={hid}>
          {!d.verified ? <PreviewOnlyNotice>Hidden on the live site until you mark this case study as verified (real project, client permission, accurate results).</PreviewOnlyNotice> : null}
          <p className="eyebrow">{d.client}</p>
          <Heading id={hid} level={level} className="mt-4">{d.title}</Heading>
          <dl className="mt-10 grid gap-4 text-start md:grid-cols-3">
            {parts.map(([k, v]) => (
              <div key={k} className="card p-6">
                <dt className="text-sm font-semibold text-pulse-300">{k}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{v}</dd>
              </div>
            ))}
          </dl>
          {d.link ? <Link href={d.link.href} className="btn btn-secondary mt-8">{d.link.label}</Link> : null}
        </Section>
      );
    }

    case "faq":
      return (
        <Section key={block.id} block={block} label={hid}>
          <Heading id={hid} level={level}>{block.data.heading}</Heading>
          <div className={`mt-8 max-w-3xl divide-y divide-line rounded-2xl border border-line text-start ${center ? "mx-auto" : ""}`}>
            {block.data.items.map((f, i) => (
              <details key={i} className="group p-5 open:bg-white/[0.02]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-semibold">{f.q}</h3>
                  <span aria-hidden="true" className="mt-0.5 text-xl leading-none text-signal-300 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed whitespace-pre-line text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      );

    case "cta":
      return (
        <section key={block.id} data-block="cta" data-block-id={block.id} className={pad[block.settings.spacing]}>
          <div className="container-page">
            <div className="card reveal relative overflow-hidden px-6 py-12 text-center md:px-12 md:py-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(76_125_255/0.22),transparent_60%)]" aria-hidden="true" />
              <Heading id={hid} level={level} className="relative mx-auto max-w-2xl">{block.data.title}</Heading>
              {block.data.text ? <p className="text-lead relative mx-auto mt-4 max-w-xl">{block.data.text}</p> : null}
              <Link href={block.data.button.href} className="btn btn-primary relative mt-8">
                {block.data.button.label}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      );

    case "contactForm":
      return (
        <Section key={block.id} block={block} label={hid}>
          <div className={`max-w-2xl ${center ? "mx-auto" : ""}`}>
            <Heading id={hid} level={level}>{block.data.heading}</Heading>
            {block.data.lead ? <p className="text-lead mt-4">{block.data.lead}</p> : null}
            <div className="mt-8 text-start">
              <ContactForm locale={locale} disabled={ctx.preview} />
            </div>
          </div>
        </Section>
      );

    case "visual": {
      const d = block.data;
      return (
        <Section key={block.id} block={block} label={hid}>
          <div className="grid items-center gap-12 text-start lg:grid-cols-2">
            <div className="reveal">
              {d.eyebrow ? <p className="eyebrow">{d.eyebrow}</p> : null}
              <Heading id={hid} level={level} className={d.eyebrow ? "mt-4" : ""}>{d.heading}</Heading>
              {d.lead ? <p className="text-lead mt-5">{d.lead}</p> : null}
              {d.points.length ? (
                <ul className="mt-8 space-y-4">
                  {d.points.map((p) => (
                    <li key={p} className="flex gap-3 text-fg/90">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {d.visual === "workforce" ? (
              <WorkforceNetwork nodes={t.home.workforce.nodes} label={t.home.workforce.diagramLabel} />
            ) : (
              <div role="img" aria-label={t.home.hero.visualLabel} className="mx-auto aspect-square w-full max-w-md">
                <StaticGlobe className="h-full w-full" />
              </div>
            )}
          </div>
        </Section>
      );
    }
  }
}

/** Renders a page's blocks. The first heading on the page is always the h1. */
export function PageBlocks({ blocks, locale, t, preview = false, crumbs }: { blocks: Block[]; locale: Locale; t: Dictionary; preview?: boolean; crumbs?: Crumb[] }) {
  const heroIndex = blocks.findIndex((b) => b.type === "hero");
  const h1Index = heroIndex >= 0 ? heroIndex : blocks.findIndex((b) => b.type !== "contactForm");
  return (
    <>
      {blocks.map((block, i) => renderBlock(block, { locale, t, preview, crumbs }, i === h1Index ? 1 : 2))}
    </>
  );
}
