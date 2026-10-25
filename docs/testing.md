# Testing

## How to run

```bash
npm run check        # lint + type check + unit tests (fast)
npm run build        # production build, also validates all content
npm run test:e2e     # browser tests against the production build (desktop + mobile)
```

## What is covered (Phase 2 additions)

**Unit tests**
- Page schema: built-in pages valid in both languages, every block type's starting block valid, unsafe links (`javascript:`, `data:`, `//`, `http:`) rejected, empty required text, duplicate ids and a second hero rejected, search title/description limits.
- Storage: drafts never touch the live page, revisions capped at 20, concurrent writes keep all data.
- Page service: an invalid draft cannot be saved or published and the live page stays unchanged; restoring a version only changes the draft; landing page addresses validated.
- Leads: valid contact stored, field errors returned, honeypot and too-fast submissions rejected as spam, rate limit after 5, proposal stored with its qualification; qualification flags missing info, is deterministic and bilingual.
- Studio login: signed session tokens (expired, tampered, foreign secret rejected), exact password comparison, minimum secret strength.
- AI: "Not configured" reported honestly (also for unsupported provider names), mock labelled as test-only, suggestions validated and returned as a diff without changing the input, AI cannot approve testimonials or case studies, unsafe AI output rejected.
- Proxy: `/ar/studio` redirects to `/studio`.

**Browser tests**
- Contact form: errors for missing fields, successful send, honeypot rejected.
- Proposal assistant: step-by-step validation, focus moves to each step, review screen, consent required, result shows the three labelled sections and the "not a quote" disclaimer, missing website flagged. Arabic version is RTL and translated.
- Studio: every studio page and the preview redirect to login when signed out, `noindex` header and meta, wrong password rejected, dashboard shows the test AI label.
- Editor: create a landing page, clear a required field (error shown, Save and Publish disabled), edit, add an FAQ block, reorder with buttons and with the keyboard, save, preview iframe shows the draft, page still not public, publish, page live with the new order, history has one version.
- AI: suggestion shown as a diff labelled [TEST], editor unchanged until "Apply", live page unchanged. A second server with no AI shows "Not configured" and no suggest button.
- Enquiries submitted on the site appear in the studio.
- Accessibility (axe) also on `/about`, `/request-a-proposal` (both languages), `/studio/login` and the editor.

## What is covered (Phase 1)

**Unit tests (Vitest, `tests/unit/`)**
- Service content: all 24 required services exist once, related links are valid, titles and descriptions are unique, no guarantee claims, Arabic text is Arabic, proxy slug list matches content.
- Language paths: English unprefixed, Arabic under `/ar`, switching keeps the same page.
- Dictionaries: Arabic has exactly the same keys and list lengths as English.
- Proxy: English rewrite, Arabic pass-through, `/en` redirect, unknown services go to 404.

**Browser tests (Playwright, `tests/e2e/`), each on desktop Chrome and a Pixel 7 profile**
- Homepage loads without console errors; main navigation reaches Services, About, Contact.
- Service explorer tabs work with mouse and keyboard.
- All 24 service pages return 200 in both languages with the right `lang`.
- Unknown URLs return a real 404 status and a helpful page.
- Arabic: `lang="ar"`, `dir="rtl"`, translated navigation, mirrored layout, no horizontal overflow; language switcher keeps the current page.
- Mobile menu: opens, closes with Escape, returns focus to the button; no horizontal overflow on key pages.
- 3D fallback: reduced motion keeps the static globe and loads no canvas; the page is complete with JavaScript disabled.
- Accessibility: no serious or critical axe-core (WCAG 2 A/AA) violations on 6 key pages.
- SEO: title, description, single `h1`, canonical, `hreflang` en/ar/x-default and Open Graph on 12 page variants; sitemap (56 URLs with alternates); robots.txt; draft legal pages are `noindex` and not in the sitemap; structured data parses and contains no ratings, reviews or addresses; no broken internal links on key pages.

## Latest results (2026-10-25, Phase 2, cloud workspace, production build)

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, 0 problems |
| `npm run typecheck` | Pass |
| Unit tests | 46 / 46 passed |
| `npm run build` | Pass |
| Browser tests | 77 passed, 0 failed. 27 skipped by design (studio tests run on desktop only, mobile-only tests on desktop, duplicate metadata tests on mobile) |

Lighthouse after Phase 2 (mobile unless noted): `/` 95 / 100 / 100 / 100, LCP 2.9 s, TBT 100 ms, CLS 0. `/request-a-proposal` 96 / 100 / 100 / 100, LCP 2.7 s. `/` desktop 100 / 100 / 100 / 100, LCP 0.6 s. Same picture as Phase 1: the mobile LCP gap is the hero font (see below).

The browser tests start two production servers with test-only settings (a test studio password, raised rate limits, separate `.data-e2e` folders, and the mock AI provider on one of them). These values live in `playwright.config.ts` and are not real secrets.

## Phase 1 results (2026-10-24)

| Check | Result |
| --- | --- |
| Unit tests | 17 / 17 passed |
| `npm run build` | Pass, 60 public pages prerendered |
| Browser tests | 53 passed, 0 failed, 19 skipped by design |

### Lighthouse 12 (local production server, same machine)

These are lab measurements in a cloud container, not real-user data. "Mobile" uses Lighthouse's simulated slow 4G and CPU throttling. Results vary by a few points between runs.

| Page | Device | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.6 s | 20 ms | 0 |
| `/` | Mobile | 96 | 100 | 100 | 100 | 0.9 s | 2.8 s | 60 ms | 0 |
| `/ar` | Mobile | 86 | 100 | 100 | 100 | 2.4 s | 3.4 s | 170 ms | 0.002 |
| `/services/seo` | Mobile | 98 | 100 | 100 | 100 | 0.8 s | 2.3 s | 40 ms | 0 |

**Against the targets** (LCP ≤ 2.5 s, CLS ≤ 0.1): CLS meets the target everywhere. Desktop LCP meets it. Simulated mobile LCP is slightly above target on the English homepage (2.8 s) and the Arabic homepage (3.4 s). In both cases the LCP element is the hero heading waiting for its web font. INP cannot be measured in a lab; Total Blocking Time is low.

What was already done: phones skip the WebGL scene (the first mobile run, before this change, scored 66 with 1,570 ms blocking time), the 3D code only downloads after the page is idle, and the Arabic font is not preloaded on English pages (preloading it made English LCP worse, 3.7 s). Next options, to evaluate before launch: self-host a subset of the heading fonts, or use a system font for the hero heading on mobile. Real-user Core Web Vitals should be checked in Search Console after launch.

## Known limits of the test setup

- WebGL in the cloud container is software-rendered, so 3D performance numbers here are pessimistic for real devices.
- Storage is the local file store; Supabase and Row Level Security tests arrive in Phase 3.
- Rate limits are in memory, so they reset when the server restarts and are per server instance.
