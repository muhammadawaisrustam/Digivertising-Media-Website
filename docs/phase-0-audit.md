# Phase 0: Environment audit and plan

Audit date: 2026-10-24. Everything below was checked, not assumed.

## 1. What was found

| Item | Finding |
| --- | --- |
| Project repository | None. The owner's GitHub account has two repositories (`target-kitchen-studio` and the personal `github.io` site). Neither is related, so neither was touched. A new private repository `digivertising-website` was requested from the owner. |
| Working directory | Empty cloud workspace. No existing project files, so nothing could be overwritten. |
| Node.js / npm | Node 22.22.0, npm 10.9.4 (pnpm and yarn also available; npm chosen as the simplest). |
| Git | 2.43.0 |
| Browser for tests | Chromium with Playwright 1.63 is preinstalled. `@playwright/test` is pinned to 1.63.0 to match it. |
| Docker | Available (useful later for running Supabase locally). |
| Supabase CLI | Not installed. Not needed until Phase 3. |
| Supabase projects | Not accessed. The unrelated existing project will not be used; a new project will be created only with the owner's approval in Phase 3. |
| Credentials | None present, none requested. |

## 2. What is configured now (after Phase 1)

- Next.js 16.4.3 (App Router, Turbopack, Cache Components), React 19.3, TypeScript strict mode.
- Tailwind CSS 4 with project design tokens.
- Three.js 0.186 + React Three Fiber 9.8 for the 3D hero.
- Zod 4 for content validation.
- Vitest 5 (unit tests), Playwright 1.63 + axe-core (browser and accessibility tests), ESLint 9.

## 3. What is missing (and when it will be added)

| Missing | Needed for | Owner action? |
| --- | --- | --- |
| GitHub repository | Saving work permanently, version history | Yes: create `digivertising-website` (private, empty) |
| Business email and social links | Contact page, footer, Organization schema | Yes: tell us which to publish |
| Domain | Canonical URLs, sitemap, launch | Later; decide before deployment |
| New Supabase project | Leads, page editor, studio login (Phase 2 to 3) | Yes, with approval; step-by-step guide will be provided |
| Free AI provider | AI editing, quotation assistant, agents (Phase 2 and 4) | Yes, choose after we compare current free tiers |
| Legal review | Privacy policy and terms | Yes, before launch |
| Arabic native review | Arabic copy quality | Recommended before launch |

## 4. Architecture decisions and adjustments

- **One Next.js application** with separate route groups: `(public)` for the website now, `(studio)` for the private workspace later. No microservices.
- **Dependencies were checked before install.** `@react-three/drei` was *not* installed: the hero only needs core React Three Fiber, and skipping Drei keeps the 3D download smaller. It can be added later if a feature needs it.
- **Next.js 16 changes respected.** This version renamed `middleware` to `proxy`, enables Cache Components by default and requires `generateStaticParams` for root parameters. The bundled docs in `node_modules/next/dist/docs` were read before writing code.
- **Languages.** English is served without a prefix (`/about`), Arabic under `/ar` (`/ar/about`). `src/proxy.ts` rewrites English URLs internally and redirects `/en/...` to avoid duplicate pages. Every page has a real Arabic version, with `lang="ar"` and `dir="rtl"`.
- **Content separated from code.** Service copy lives in `src/content/services/*.ts`, interface text in `src/i18n/dictionaries/*.ts`, legal templates in `src/content/legal.ts`, business facts in `src/config/site.ts`. Content is validated with Zod so a broken entry fails the build instead of the live site. In Phase 2 these move into the database-backed page editor.
- **Honest placeholders.** Unconfirmed facts (email, social links) are `null` and hidden. There are no testimonials, client logos, case studies or statistics, because none have been provided.
- **Pages not built yet on purpose:** `/work`, `/insights`, `/industries` and `/request-a-proposal`. They are not linked anywhere until there is real content or a working feature behind them.

## 5. Risks

- Free tiers (hosting, database, AI) change. Limits will be re-checked at the time each is chosen and documented in `docs/free-tier-limitations.md`.
- The Arabic copy was drafted without a native reviewer.
- The cloud workspace is temporary. Until the GitHub repository exists, a copy of the project is saved to the project files folder after each milestone.

## 6. First milestone (Phase 1) and acceptance check

See `docs/testing.md` for actual results. Acceptance criteria:

| Criterion | Status |
| --- | --- |
| Site starts locally | Done: `npm run build` and `npm start` verified |
| Main routes render | Done: 60 pages built (30 per language), all return 200 in tests |
| Mobile navigation works | Done: tested on a Pixel 7 profile, including Escape and focus return |
| RTL Arabic layout works | Done: `lang`/`dir` checked, layout mirrors, no horizontal overflow |
| 3D section has a fallback | Done: static SVG globe without JS, with reduced motion, on low-power devices and without WebGL |
| No major route is a placeholder | Done, with one note: the contact page explains that the inquiry form arrives in Phase 2, and no email is shown until one is confirmed |
