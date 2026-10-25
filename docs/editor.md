# Studio and page editor

The studio is the private part of the site at `/studio`. In Phase 2 it lets the owner edit the homepage, the About page and new landing pages, preview changes, publish them, restore earlier versions and read website enquiries.

## 1. Set up the studio login (one time)

The studio uses a temporary single-owner password until Supabase accounts arrive in Phase 3.

1. In the project folder, copy `.env.example` to a new file called `.env.local`.
   - Mac/Linux: `cp .env.example .env.local`
   - Windows PowerShell: `Copy-Item .env.example .env.local`
2. Create a random session secret. In the terminal run:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
   Copy the long line it prints.
3. Open `.env.local` in a text editor and fill in:
   ```
   STUDIO_PASSWORD=choose-a-long-password-you-do-not-use-elsewhere
   SESSION_SECRET=paste-the-long-line-from-step-2
   ```
   The password must be at least 12 characters, the secret at least 32.
4. Restart the server (`Ctrl + C`, then `npm run dev`).
5. Open http://localhost:3000/studio and sign in.

Keep `.env.local` private. It is git-ignored, so it is never uploaded to GitHub. Never paste these values into code, chat messages or commits. Changing `SESSION_SECRET` signs everyone out.

**Success looks like:** the Dashboard with cards for Pages, Website enquiries, Storage and AI provider.
**If you see "The studio login is not set up on this server yet":** one of the two values is missing or too short, or the server was not restarted.

## 2. Edit a page

1. Go to **Pages** and choose the language link (English or Arabic) next to a page.
2. On the left is the list of **blocks** (sections of the page). Click a block to edit it on the right.
3. Reorder blocks by dragging the ⠿ handle, or with the keyboard (focus the handle, press Space, use the arrow keys, press Space again), or with the ↑ ↓ buttons.
4. Add a block with the menu under the list. Duplicate (⧉) or remove (✕) blocks with the buttons on each row.
5. Edit the **Search result text** (page title up to 70 characters, description up to 170). These appear in Google results.
6. Problems are shown in red as you type (for example an empty required field or an unsafe link). **Save draft** and **Publish** stay disabled until they are fixed, so a broken page can never go live.

### Save, preview, publish

- **Save draft** stores your changes privately. The live page does not change.
- **Preview** shows the last saved draft at mobile (375 px), tablet (768 px) or desktop (1280 px) width.
- **Publish** saves and makes the version live immediately (you are asked to confirm). The previous live version is kept in **Publishing and history**.
- **Restore to draft** copies an older version into the draft so you can review and publish it again. Up to 20 versions are kept per page and language.
- **Discard draft** throws away the draft and unsaved changes. The live page stays as it is.

### New landing pages

On the **Pages** screen, fill in a title and an address such as `google-ads-audit` and press **Create draft**. The page will live at `/landing/google-ads-audit` (or `/ar/landing/...` for Arabic) and is invisible until you publish it.

## 3. Supported blocks

| Block | Use it for | Notes |
| --- | --- | --- |
| Hero | Main heading, intro, up to two buttons, short facts | One per page. Visual: 3D globe or a simple header |
| Text | Heading and paragraphs | Separate paragraphs with an empty line |
| Image and text | An image beside text and an optional button | Image must be a file in `/public` or an `https://` address. Uploads come with Supabase storage |
| Services | Interactive explorer or a grid of service cards | Can be limited to chosen categories |
| Feature list | Up to 12 cards with title and text | |
| Process steps | 2 to 8 numbered steps | |
| Testimonial | A real client quote | Only shown publicly after you tick "I have the client's written permission" |
| Case study | A real project | Only shown publicly after you tick "verified" |
| FAQ | Questions and answers | |
| Call to action | Highlighted band with one button | |
| Contact form | The website contact form | |
| 3D visual section | Text beside the AI workforce network or the globe | |

Links accept site paths (`/contact`, `/ar/contact`), `https://` addresses, `mailto:` and `#anchors`. `javascript:` and `data:` links are always rejected.

## 4. AI suggestions

Each page editor has an **AI suggestions** panel.

- **Right now it shows "Not configured".** No AI provider is connected, so the panel says so and offers no button. Nothing pretends to be AI.
- When a free hosted provider is chosen and its key is added to `.env.local` (server only), you will be able to describe a change, such as "make the intro shorter". The suggestion is shown as a list of exact changes (old text struck through, new text added). Nothing changes until you press **Apply to editor**, and nothing goes live until you save and publish.
- Safety rules built in: the AI only returns page blocks, which are validated like your own edits; it cannot run commands, change logins or touch code; it never sees leads or passwords; and it can never mark a testimonial or case study as approved.
- `AI_PROVIDER=mock` exists only for automated tests. Its output is fixed sample text labelled **[TEST]** and it must not be used on a live site.

## 5. Website enquiries

**Leads** lists submissions from the contact form and the proposal assistant, newest first, with the automated (rule-based, not AI) priority and missing information. It is read-only in Phase 2; statuses, notes and the approval queue come with the CRM in Phase 4.

## Where the data lives (Phase 2)

Drafts, published versions and enquiries are stored as JSON files in the `.data` folder (git-ignored). This is fine on your own computer, but **not** on serverless hosting, where files disappear. Supabase replaces it in Phase 3, before any deployment.

## For developers: adding a block type

1. Add a Zod schema in `src/features/pages/schema.ts` and include it in `blockSchema`.
2. Render it in `src/features/pages/blocks/page-blocks.tsx`.
3. Describe its fields, label and starting content in `src/features/studio/editor/block-fields.ts`.
4. Add it to the table above. The unit test checks that every type's starting block is valid.
