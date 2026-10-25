# Architecture

## Overview

One Next.js 16 application (App Router, TypeScript strict). The public site, and later the private studio, live in the same codebase but in separate route groups with separate layouts and, from Phase 3, separate access control.

```
src/
  proxy.ts                    Language routing (runs before each page request)
  app/
    [lang]/                   Root layout: <html lang dir>, fonts, global metadata
      (public)/               Public website shell (header, footer)
        page.tsx about/       Homepage and About, rendered from editable blocks
        landing/[slug]/       Landing pages created in the studio
        contact/ request-a-proposal/ privacy/ terms/
        services/ services/[slug]/
        not-found.tsx         Bilingual 404 page
        [...missing]/         Sends unknown URLs to the 404 page
      (studio)/studio/        Private studio (noindex, English only)
        (workspace)/          Dashboard, pages, editor, leads, login
        preview/              Draft preview shown inside the editor
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
  features/pages/             Block schema, built-in pages, page service, AI edit, diff
  features/leads/             Form schemas, rule-based qualification, form components
  features/studio/            Studio actions (all check the session) and editor UI
  lib/database/               Storage interfaces, Supabase store and local file store
  lib/supabase/               Supabase connections (public, signed-in user, server-only secret)
  lib/auth/                   Temporary studio login (signed httpOnly cookie)
  lib/ai/                     Provider-agnostic AI interface, test-only mock provider
  lib/security/               Rate limiting, client IP
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

## Editable pages (Phase 2)

- A page is `{ meta, blocks[] }` per language, validated by Zod (`src/features/pages/schema.ts`). 12 block types; see [editor.md](editor.md).
- Storage keeps `published`, `draft` and up to 20 `revisions` per page and language. Saving only touches the draft. Publishing validates again, records a revision and calls `updateTag` so the cached public page refreshes immediately.
- If nothing has been published, the built-in version (`seed.ts`, built from the dictionaries) is shown, so an empty database never breaks the site. A stored version that fails validation is ignored in favour of the built-in one.
- Public pages read published content through a cached function (`'use cache'` + `cacheTag`).
- Known limit: an unpublished landing page address returns the 404 page with a `noindex` tag but HTTP status 200 (partial prerendering streams the status before the page is known). Search engines will not index it. A proxy check will return a real 404 once Supabase is in place.

## Forms and leads (Phase 2)

- Contact form and the five-step proposal assistant share Zod schemas between browser (instant feedback) and server (the real check).
- Spam protection: honeypot field, minimum fill time (3 s), rate limit (5 per 10 minutes per IP, in memory). IPs are not stored.
- The proposal result is a deterministic, rule-based summary (areas involved, missing information, typical deliverables, discovery questions), clearly labelled as automated and not a quote. No AI and no prices.

## Studio security (Phase 2, temporary)

- One owner password (`STUDIO_PASSWORD`) and an HMAC-signed, httpOnly, SameSite=Strict session cookie (12 hours, `SESSION_SECRET`). Login is rate limited (5 attempts per 15 minutes).
- Every studio page calls `requireStudio()` and every studio server action calls `assertStudio()`; hiding UI is never the protection.
- Studio responses send `X-Robots-Tag: noindex` and the robots meta tag; only the preview route may be framed, and only by the site itself.
- This password mode is only used when Supabase is not configured (local development and tests).

### Supabase mode (Phase 3)
- Supabase Auth accounts (email + password). Roles live in `profiles`: pending (default, no access), viewer, editor, admin, owner.
- Pages: `requireStudio(roles)`. Server actions: `assertStudio(roles)`. Editing needs editor or above, enquiries need admin or above.
- The studio talks to the database as the signed-in user, so Row Level Security enforces the same roles again. The public site reads only through `published_page` and `published_landing_slugs`. The secret key is used on the server for one job: inserting validated enquiries.
- `src/proxy.ts` refreshes Supabase sessions on `/studio` requests. Details and setup: `docs/supabase.md`.

## AI layer (Phase 2)

- `src/lib/ai/` defines `generateStructuredOutput`, `generateText`, `checkAvailability` and `getConfigurationStatus`. Features never call a vendor directly.
- With no `AI_PROVIDER`, features report "Not configured". There is no silent fallback to made-up output.
- `AI_PROVIDER=mock` is a test-only provider with fixed output labelled `[TEST]`.
- AI page edits return validated blocks only, are shown as a diff, and need an explicit "Apply" plus save and publish by the owner. Testimonial permission and case-study verification flags cannot be changed by AI.

## Security baseline (Phase 1)

- No secrets are stored in the project. `.env*` files are git-ignored; `.env.example` contains placeholders only.
- Baseline headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` (DENY, except the studio preview which is SAMEORIGIN), `Permissions-Policy`; `X-Powered-By` removed.
- JSON-LD is serialised with `<` escaped.
- A full Content-Security-Policy, authentication and Row Level Security arrive in Phase 3.
