# Changelog

## 0.3.0 (Phase 3, part 1) - 2026-10-25

### Added
- Supabase project "Digivertising Media and PR": tables for profiles, pages, page versions, enquiries and an audit log, with Row Level Security on every table and no delete access (`supabase/migrations/`).
- Studio accounts with roles (pending, viewer, editor, admin, owner). New accounts have no access until the owner assigns a role. Roles are checked by the site and again by the database.
- Pages, versions and enquiries are stored in Supabase when it is configured. The public site reads only published pages through two read functions. The secret key is used on the server only, to save enquiries.
- Studio header shows who is signed in and their role; enquiries are hidden from editors and viewers; viewers cannot open the editor.
- Tests: Supabase storage integration tests, a Supabase-mode browser suite and a 17-point access-rule check, all run against a local copy. The access-rule check also passed on the live project (rolled back, no data left).
- Docs: `docs/supabase.md` (beginner setup, roles, owner account).

### Changed
- Without Supabase settings the site keeps working in local mode (files and one password) for development and tests.


## 0.2.0 (Phase 2) - 2026-10-25

### Added
- Block-based page model with 12 block types, Zod validation, drafts, publishing and 20-version history per page and language.
- Homepage and About now render from editable blocks (built-in versions until something is published). Landing pages at `/landing/<slug>`.
- Contact form and a five-step proposal assistant (`/request-a-proposal`) in English and Arabic, with honeypot, minimum fill time and rate limiting. The result screen separates automated qualification, indicative planning and the human-reviewed proposal, and is clearly not a quote.
- Private studio at `/studio` (temporary password login): dashboard, pages list, landing page creation, visual block editor with drag-and-drop and keyboard reordering, live validation, device preview, save, publish, restore and discard, and a read-only enquiries list.
- Provider-agnostic AI interface. AI page suggestions are shown as a diff and only applied on request. Shows "Not configured" until a free provider is chosen; a labelled test-only mock provider is used by automated tests.
- Local JSON file storage behind storage interfaces, ready to swap for Supabase in Phase 3.
- Docs: `docs/editor.md`. New unit and browser tests (see `docs/testing.md`).

### Changed
- "Start a project" buttons now open the proposal assistant. The contact page shows the contact form.
- `X-Frame-Options` is `SAMEORIGIN` for the studio preview only; studio responses are `noindex`.

## 0.1.0 (Phase 0 and Phase 1) - 2026-10-24

### Added
- Environment audit and implementation plan (`docs/phase-0-audit.md`).
- Next.js 16 app with strict TypeScript, Tailwind CSS 4, ESLint, Vitest and Playwright.
- Original brand concept: "D" broadcast mark, wordmark, light/dark/mono variants, favicons, social image, design tokens.
- Public site in English and Arabic (RTL): homepage, services overview, 24 service pages, about, contact, draft privacy and terms, bilingual 404.
- Interactive 3D hero globe (Three.js / React Three Fiber) with static SVG fallback, reduced-motion, low-power and no-WebGL handling.
- Accessible service explorer, mobile menu with focus management, animated AI-workforce diagram.
- SEO foundations: per-page titles and descriptions, canonical URLs, hreflang alternates, Open Graph, sitemap with language alternates, robots.txt, Organization/WebSite/Service/BreadcrumbList structured data.
- Baseline security headers.
- 17 unit tests and 53 browser tests (desktop + mobile), including axe accessibility checks.
