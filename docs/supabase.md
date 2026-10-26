# Supabase: database and studio accounts

The site can store its data in two ways:

| Mode | When | Pages, versions, enquiries | Studio login |
| --- | --- | --- | --- |
| **Supabase** | `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are set | The Digivertising Supabase project, protected by access rules (Row Level Security) | Personal accounts (email + password) with roles |
| **Local** | Those two are empty | JSON files in `.data` | One owner password (`STUDIO_PASSWORD`, see `docs/editor.md`) |

Local mode is for development and automated tests only. Use Supabase for anything real, and always before deploying.

The Digivertising project is **"Digivertising Media and PR"** (`uqtgkaxsmstzrppikuyp`). The other project in the same Supabase account is unrelated and is never used by this site.

## 1. Connect your computer to Supabase (about 5 minutes)

1. Open `.env.local` in the project folder (copy `.env.example` if it does not exist yet).
2. Add these two lines. They are **public** values: Supabase designs them to be visible, and the access rules decide what they can do.
   ```
   SUPABASE_URL=https://uqtgkaxsmstzrppikuyp.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_U8fMtyqa6JqggpJW9rKLwQ_TDHAPWD-
   ```
3. Add the **secret key** yourself. It is private: it can bypass the access rules, so the site only uses it on the server, for one job (saving website enquiries).
   - In Supabase open the project, then **Project Settings → API Keys**.
   - Under **Secret keys**, copy the key that starts with `sb_secret_` (create one if the list is empty).
   - Paste it into `.env.local` only:
     ```
     SUPABASE_SECRET_KEY=sb_secret_...
     ```
   - Never paste it into chat, code, Git, or any variable starting with `NEXT_PUBLIC_`.
4. Restart the server (`Ctrl+C`, then `npm run dev`).

**Success looks like:** the studio sign-in page asks for **Email** and **Password**, and after signing in the Dashboard's Storage card says **Supabase database**. If it is orange and mentions `SUPABASE_SECRET_KEY`, step 3 is missing (pages still work, but enquiries cannot be saved).

## 2. Create your owner account

There is no public sign-up page. Accounts are created in Supabase:

1. In Supabase open **Authentication → Users → Add user → Create new user**.
2. Enter your email and a strong password. Tick **Auto Confirm User**.
3. The new account starts with the role **pending**, which has no access. Give it the **owner** role: open **SQL Editor**, paste this (with your email) and press **Run**:
   ```sql
   update public.profiles set role = 'owner' where email = 'you@example.com';
   ```
   (You can also ask Claude to do this step for you.)
4. Sign in at `/studio/login`.

Recommended: in **Authentication → Sign In / Providers**, turn off **Allow new users to sign up**. New accounts would be pending anyway, but this stops strangers creating them.

## 3. Roles

| Role | Can do |
| --- | --- |
| pending | Nothing. Every new account starts here until the owner assigns a role |
| viewer | See the dashboard and the pages list |
| editor | Everything a viewer can, plus create, edit, publish and restore pages, and use AI suggestions |
| admin | Everything an editor can, plus read website enquiries |
| owner | Everything, including changing other people's roles |

To change someone's role, use the same SQL as above with `'viewer'`, `'editor'` or `'admin'`. Only the owner can change roles, and nobody can raise their own role. Nothing can be deleted through the website.

These rules are enforced twice: by the website, and again by the database itself, so even a bug in the site cannot show enquiries to an editor.

## 4. Image uploads

Editors, admins and the owner can upload images in the page editor (the **Image and text** block). Uploads go to the **media** storage bucket in Supabase:

- JPG, PNG, WebP or AVIF only, up to 5 MB. SVG is refused because it can contain scripts. The site checks the file's real content, not just its name.
- Images are **public**: anyone with the address can view them, because they appear on public pages. Do not upload anything private.
- Files can't be renamed or deleted from the website yet. To remove one, use **Storage → media** in the Supabase dashboard.
- Without Supabase (local mode), uploads are saved in `.data/uploads` and served from `/media/...`.

## 5. What is where

- `supabase/migrations/`: the database structure and access rules, in the order they were applied.
- `src/lib/supabase/`: the three connections (public visitor, signed-in studio user, server-only secret key).
- `src/lib/database/supabase-store.ts`: saving and reading pages and enquiries.
- `src/lib/auth/studio-auth.ts`: sign-in and role checks.
- `src/proxy.ts`: keeps studio sign-ins fresh.
- `tests/db/rls-check.sql`: 17 access-rule checks. It rolls everything back, so it is safe to run on the live project (it was, on 2026-10-25: 17/17 passed).
- `tests/db/media-rls-check.sql`: 13 checks for image uploads, also rolled back (live project, 2026-10-26: 13/13 passed).
- `src/features/media/`: upload checks and storage.

## 6. Hosting notes (for later)

When the site is deployed, set the same three values in the hosting provider's environment settings (the secret key as a private/encrypted value). Set them **before** the build runs, because public pages are prepared during the build.

## Testing against a local copy

Automated Supabase tests never touch the live project. They run against a local, Supabase-compatible stack (Postgres 16, the Supabase Auth server and PostgREST behind `scripts/local-supabase/gateway.mjs`). The steps used in development:

1. Start Postgres, run `scripts/local-supabase/storage-stub.sql` (a minimal stand-in for Supabase's storage tables), then apply every file in `supabase/migrations/` in order.
2. Start the Auth server, PostgREST (with `db-schemas = "public,storage"`) and `node scripts/local-supabase/gateway.mjs` (port 54330). The gateway includes a tiny storage stand-in that records each upload through the database as the signed-in user, so the real storage access rules are tested. It does not enforce the bucket's size and type limits; the site checks those itself.
3. Print local-only keys with `node scripts/local-supabase/keys.mjs`.
4. Run:
   ```
   LOCAL_SUPABASE_URL=http://127.0.0.1:54330 LOCAL_SUPABASE_ANON_KEY=... LOCAL_SUPABASE_SERVICE_KEY=... npx vitest run tests/integration
   npm run build
   LOCAL_SUPABASE_URL=... LOCAL_SUPABASE_ANON_KEY=... LOCAL_SUPABASE_SERVICE_KEY=... npx playwright test -c playwright.supabase.config.ts
   psql -h 127.0.0.1 -p 54329 -U postgres -f tests/db/rls-check.sql
   ```
Both test configs refuse to run unless the URL points at `127.0.0.1` or `localhost`.
