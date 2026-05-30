# Shine by Lucy (Let 'Em Shine)

Premium teeth-whitening marketing site for **Lucy / Shine by Lucy** with a
lightweight admin console. Built with React + Vite + Tailwind + Supabase.

See [`LET_EM_SHINE_PRD.md`](../LET_EM_SHINE_PRD.md) for product context.

## Quick start

```bash
npm install
npm run dev
```

You'll need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in a local
`.env.local` for the testimonial form and admin console to work. Without
them the site still renders — Supabase-dependent areas show a graceful
"temporarily unavailable" state.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Motion (animation), Lucide (icons)
- Supabase (Postgres + Auth)
- Deployed on Vercel

## Project structure

```
src/
  components/        Public landing-page sections + shared UI
  pages/             Standalone pages (/share-your-story)
  admin/             Admin SPA (under /admin/*)
  config/site.ts     Owner-supplied content (email, hours, social, Calendly URL)
  utils/supabase/    Supabase client (lazy proxy, env-safe)
  design-system/     Tailwind class recipes (ds.btnPrimary, ds.cardElevated, ...)
supabase/migrations/ Canonical database schema
docs/                Integration runbooks (Calendly + Stripe)
```

## Database

The live schema is the set of files in
[`supabase/migrations/`](../supabase/migrations/). Apply them via the
Supabase CLI or paste them into the Studio SQL Editor. Migrations create:

- `public.testimonial_submissions` — public inserts allowed (with consent
  flag); admin-only read/update gated by `is_admin()`.
- `public.published_testimonials` (view) — public read of approved
  testimonials with PII columns (e.g. email) stripped.
- `public.bookings` — admin-only RLS; populated by Calendly webhook (see
  [`docs/INTEGRATIONS.md`](../docs/INTEGRATIONS.md)).
- `public.is_admin()` — JWT-based role check used by all admin RLS policies.

A user is promoted to admin by setting `raw_app_meta_data.role = 'admin'`
on their `auth.users` row (see the integrations doc).

## Admin console

Visit `/login` and sign in with a Supabase Auth user whose
`app_metadata.role = 'admin'`. Routes under `/admin/*`:

- `/admin` — dashboard metrics
- `/admin/bookings` — booking list (populated by Calendly webhook)
- `/admin/calendar` — calendar view of bookings
- `/admin/testimonials` — review + publish testimonial submissions

## Public testimonial capture

Share `/share-your-story` with clients post-session to collect testimonials.
Submissions land in `testimonial_submissions` with `status = 'pending'` and
appear in the admin Testimonials page for approval.

## Deployment

Production: Vercel (auto-deploys from `main`). Required env vars:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set them in **Vercel → Project Settings → Environment Variables** scoped
to *Production*, *Preview*, and *Development*, then redeploy.

## Connecting Calendly + Stripe

Not connected yet — owner needs to provision the accounts first. Full
walkthrough in [`docs/INTEGRATIONS.md`](../docs/INTEGRATIONS.md).
