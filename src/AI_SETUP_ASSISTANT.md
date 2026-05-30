# AI Assistant Setup Rules

**SYSTEM INSTRUCTION:** If you are an AI assistant (Cursor, Copilot,
Windsurf, etc.) opening this project, follow these steps to help the user
configure the environment efficiently.

> This file is intentionally short. The source of truth for database
> schema is [`supabase/migrations/`](../supabase/migrations/); for
> integration setup it is [`docs/INTEGRATIONS.md`](../docs/INTEGRATIONS.md).
> Do **not** invent or copy-paste SQL here — apply the migrations as-is.

## Phase 1: Environment configuration

1. **Environment variables:** check for `.env.local`. If missing, ask the
   user for their Supabase project URL and anon key, then create:

   ```env
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```

2. **Dependencies:** run `npm install` if `node_modules/` is missing.

## Phase 2: Database

Apply the migrations in `supabase/migrations/` in filename order. Two ways:

- **Supabase CLI** (preferred):

  ```bash
  npx supabase link --project-ref <ref>
  npx supabase db push
  ```

- **Supabase Studio**: open each `.sql` file in
  `supabase/migrations/` and paste it into the SQL Editor in order.

After migrations:

- Verify `public.testimonial_submissions`, `public.bookings`, and
  `public.published_testimonials` exist.
- Confirm `public.is_admin()` is a function that returns the JWT
  `app_metadata.role = 'admin'` check.

## Phase 3: Promote an admin user

Create a user in **Auth → Users → Add user**, then in **SQL Editor**:

```sql
UPDATE auth.users
SET raw_app_meta_data =
  COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
WHERE email = 'admin@example.com';
```

Ask the user to log out and back in so their JWT picks up the new role.

## Phase 4: Calendly + Stripe (optional, post-owner-meeting)

Follow [`docs/INTEGRATIONS.md`](../docs/INTEGRATIONS.md) end-to-end. The
booking integration is **not** wired yet — the public site shows a "coming
soon" card until `site.booking.calendlyUrl` is populated in
[`src/config/site.ts`](src/config/site.ts).

## Phase 5: Verification

1. `npm run dev` — landing page should render fully.
2. Visit `/share-your-story` — form should submit; check Supabase for a
   new row in `testimonial_submissions`.
3. Visit `/login` and sign in as the admin user — `/admin` should load.
4. Visit `/admin/testimonials` — your test submission should appear with
   "Approve / Decline / Publish" actions.
