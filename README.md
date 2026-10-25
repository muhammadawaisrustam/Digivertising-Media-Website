# Digivertising Media & PR: website and agency workspace

The public website for Digivertising Media & PR (English and Arabic), and, in later phases, a private studio for editing pages, managing leads and running AI-assisted workflows.

## Current status

| Area | Status |
| --- | --- |
| Brand identity, logo, design tokens | Implemented and tested |
| Homepage with interactive 3D hero and fallback | Implemented and tested |
| 24 service pages, services overview, about, contact | Implemented and tested (English + Arabic) |
| Arabic right-to-left layout | Implemented and tested. Arabic copy needs native review |
| Sitemap, robots.txt, canonical and language tags, structured data | Implemented and tested |
| Privacy and terms pages | Draft templates, hidden from search until legally reviewed |
| Contact / quotation form, page editor, database, login | Planned (Phases 2 to 3) |
| AI agents, research, approvals dashboard | Planned (Phases 4 to 6) |
| Deployment | Not deployed. Will only happen with the owner's approval |

Phase details: [docs/phase-0-audit.md](docs/phase-0-audit.md). Test results: [docs/testing.md](docs/testing.md).

## Run it on your computer (beginner steps)

You need **Node.js 22.12 or newer** ([download the LTS version](https://nodejs.org)) and **Git** ([download](https://git-scm.com/downloads)).

1. Open a terminal (on Windows: "Terminal" or "PowerShell"; on Mac: "Terminal").
2. Download the project:
   ```bash
   git clone https://github.com/muhammadawaisrustam/Digivertising-Media-Website.git
   cd Digivertising-Media-Website
   ```
3. Install the packages (takes a minute or two the first time):
   ```bash
   npm install
   ```
   Success looks like `added ... packages` with no red `ERR!` lines.
4. Start the development server:
   ```bash
   npm run dev
   ```
   Success looks like `Local: http://localhost:3000`.
5. Open http://localhost:3000 in your browser. The Arabic site is at http://localhost:3000/ar.
6. To stop the server, click in the terminal and press `Ctrl + C`.

Having trouble? See [docs/troubleshooting.md](docs/troubleshooting.md).

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build (also validates all content) |
| `npm start` | Runs the production build on port 3000 |
| `npm run check` | Lint + type check + unit tests |
| `npm run test:e2e` | Browser tests (run `npm run build` first) |
| `npm run brand:assets` | Regenerates PNG icons and the social image from the SVG logo |

## Where things live

| To change... | Edit... |
| --- | --- |
| Service page text | `src/content/services/*.ts` |
| Menus, buttons, homepage, about, contact text | `src/i18n/dictionaries/en.ts` and `ar.ts` |
| Business email, social links, site address | `src/config/site.ts` |
| Colours, fonts, spacing | `src/app/globals.css` (the `@theme` block) |
| Logo files | `public/brand/` |

More: [docs/content-guide.md](docs/content-guide.md), [docs/architecture.md](docs/architecture.md), [docs/brand.md](docs/brand.md).

Routine edits without touching code arrive with the visual page editor in Phase 2.
