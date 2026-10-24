# Architecture

## Overview

One Next.js 16 application (App Router, TypeScript strict). The public site, and later the private studio, live in the same codebase but in separate route groups with separate layouts and, from Phase 3, separate access control.

```
src/
  proxy.ts                    Language routing (runs before each page request)
  app/
    [lang]/                   Root layout: <html lang dir>, fonts, global metadata
      (public)/               Public website shell (header, footer)
        page.tsx              Homepage
        about/ contact/ privacy/ terms/
        services/ services/[slug]/
        not-found.tsx         Bilingual 404 page
        [...missing]/         Sends unknown URLs to the 404 page
      (studio)/               Phase 3+: private workspace, own layout
    sitemap.ts robots.ts manifest.ts
  components/
    brand/                    Logo
    layout/                   Header, footer, mobile menu, language switcher
    sections/                 Page sections (service explorer, process, CTA...)
    three/                    3D hero, static fallback, shared globe geometry
    ui/                       Small shared pieces (icons, page header, JSON-LD)
  content/                    Business content as validated data (services, legal)
  i18n/                       Locales, path helpers, English/Arabic dictionaries
  config/site.ts              Business facts (name, URL, email, social links)
  lib/seo/                    Metadata, structured data and sitemap helpers
tests/unit, tests/e2e         Vitest and Playwright tests
```

## Languages

- English: `/about`. Arabic: `/ar/about`. Internally every page lives under `app/[lang]`, so English requests are rewritten to `/en/...` by `src/proxy.ts`. Visiting `/en/...` directly redirects (308) to the unprefixed URL so search engines see one address per page.
- `lang` is a Next.js root parameter, read anywhere on the server with `getDictionary()` (`src/i18n/get-dictionary.ts`).
- Layout direction uses CSS logical properties (`ms-`, `ps-`, `start-`, `text-start`) so RTL mirrors automatically. Arrows flip with `rtl:-scale-x-100`.
- Every page exists in both languages, so every page gets `hreflang` alternates and appears twice in the sitemap.

## Rendering and performance

- All public pages are prerendered at build time (static HTML). Cache Components is enabled, as Next.js 16 recommends.
- The 3D hero follows a progressive enhancement path:
  1. The server renders a static SVG globe (`static-globe.tsx`), so the first view is instant and works without JavaScript.
  2. After the page is idle, `hero-visual.tsx` checks reduced-motion preference, Save-Data, CPU cores, device memory and WebGL support.
  3. Only if all checks pass is the Three.js scene downloaded (dynamic import) and faded in. It pauses when scrolled off screen and falls back to the SVG if WebGL fails or the context is lost.
- Scroll reveal animations use CSS scroll-driven animations, so no animation JavaScript ships. Unsupported browsers simply show content without animation.

## Content model

Service content is typed and validated with Zod (`src/content/services/schema.ts`). The build fails if an entry is missing a field, has a too-long meta description or links to a non-existent related service. This shape is designed to move into the database-backed page editor in Phase 2 and to be exportable to another CMS later.

## Security baseline (Phase 1)

- No secrets or credentials exist in the project yet. `.env*` files are git-ignored; `.env.example` contains placeholders only.
- Baseline headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`; `X-Powered-By` removed.
- JSON-LD is serialised with `<` escaped.
- A full Content-Security-Policy, authentication and Row Level Security arrive in Phase 3.
