# Editing content (until the visual editor arrives)

The visual page editor comes in Phase 2. Until then, text lives in a few plain data files. Each change is checked automatically: if something is missing or too long, `npm run build` stops and tells you which file and field.

## Service pages: `src/content/services/`

Each service has an English (`en`) and Arabic (`ar`) block with the same fields:

| Field | Shown as | Tips |
| --- | --- | --- |
| `title` | Page heading, cards | Short and clear |
| `metaTitle` | Browser tab / Google title | Max 70 characters |
| `metaDescription` | Google snippet | Max 170 characters |
| `summary` | Card text and page lead | 1 to 2 sentences |
| `intro` | First paragraph | Answer "what is it and who is it for" |
| `signals` | "When this service helps" | At least 3 |
| `includes` | "What is included" cards | At least 3 |
| `deliverables` | "What you receive" | At least 3 |
| `note` (optional) | "Setting expectations" box | Honest limits, e.g. no guaranteed rankings |
| `faqs` | FAQ accordion | Real customer questions |

`related` lists up to 4 other service slugs shown at the bottom of the page.

Adding a new service also requires adding its slug to `src/content/services/slugs.ts` (a test checks they match).

## Menus, homepage, about and contact: `src/i18n/dictionaries/`

`en.ts` and `ar.ts` must have exactly the same structure. TypeScript and a unit test will flag any missing Arabic text.

## Business details: `src/config/site.ts`

Set `contactEmail` (for example `"hello@yourdomain.com"`) and `socialProfiles` once confirmed. They then appear in the footer, contact page and structured data automatically. Leave them as `null` / empty until real.

## Content rules

- No invented clients, testimonials, numbers, awards or guarantees.
- Arabic text is a first draft and should be reviewed by a native speaker.
- Legal pages (`src/content/legal.ts`) are templates: fill in the `[bracketed]` parts with a legal adviser, then set `legalStatus.reviewed = true` to publish them in search and the sitemap.
