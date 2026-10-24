# Brand and design system

## Concept

The mark is a **"D" whose counter holds a broadcast signal**: a node with an emitting arc. It combines the three halves of the business: *digital* (the node), *advertising/media* (the broadcast) and *PR* (a voice being heard). The gradient runs from Signal Blue to Pulse Cyan.

These are original first concepts. Treat them as a starting point to refine, not final artwork.

## Files (`public/brand/`)

| File | Use |
| --- | --- |
| `logo-dark-bg.svg` | Full logo for dark backgrounds (primary) |
| `logo-light-bg.svg` | Full logo for white/light backgrounds |
| `icon.svg` | Mark only, colour |
| `icon-mono-light.svg` / `icon-mono-dark.svg` | One-colour mark for dark / light backgrounds |
| `../favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png` | Browser and device icons |
| `../og-default.png` | Default social sharing image (1200x630) |

The wordmark in the SVG files uses live text (Sora, falling back to system fonts). Before sending logos to print or a third party, open them in a vector editor (for example Inkscape, free) and convert text to outlines. After editing the SVGs, run `npm run brand:assets` to regenerate the PNG/ICO files.

## Tokens (`src/app/globals.css`, `@theme` block)

| Token | Value | Use |
| --- | --- | --- |
| `ink-950` | `#05080f` | Page background |
| `ink-900 / 800 / 700` | `#0a1020 / #0f1830 / #17233f` | Surfaces and cards |
| `fg` | `#eef2fa` | Main text |
| `muted` | `#a3aec5` | Secondary text (AA contrast on ink-950) |
| `subtle` | `#7c89a6` | Small meta text |
| `signal-500` | `#4c7dff` | Primary accent (Signal Blue) |
| `pulse-400` | `#22d3ee` | Secondary accent (Pulse Cyan) |
| `success / warning / danger` | `#34d399 / #fbbf24 / #f87171` | Status colours (used in the studio later) |

- **Typography:** Sora (headings), Inter (body), IBM Plex Sans Arabic (all Arabic text). Fluid scale utilities: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`.
- **Radius:** `sm 8px`, `md 12px`, `lg 20px`, `xl 28px`. Buttons are pill-shaped.
- **Shadows:** `shadow-card` (depth), `shadow-glow` (accent focus).
- **Motion:** `ease-out-expo`, 150/250/500 ms. All motion is disabled under `prefers-reduced-motion`.
- **Components:** `.btn .btn-primary .btn-secondary`, `.card .card-interactive`, `.glass`, `.eyebrow`, `.section`, `.container-page`.

The primary button uses dark text on the bright gradient, which passes WCAG AA contrast; white text on Signal Blue would not.
