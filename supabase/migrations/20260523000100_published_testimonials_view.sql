-- Safe public read path for displaying approved testimonials on the marketing site.
--
-- The view runs as its owner (security_invoker = false) and only exposes
-- display-safe columns. Anon clients reading `published_testimonials` go through
-- the view; direct SELECT on `testimonial_submissions` from anon/authenticated
-- is denied (admin reads use the role-gated SELECT policy).

DROP VIEW IF EXISTS public.published_testimonials;
CREATE VIEW public.published_testimonials
WITH (security_invoker = false)
AS
SELECT
  id,
  created_at,
  full_name,
  city,
  headline_quote,
  experience_highlights,
  nps_score,
  name_display_permission,
  photo_permission
FROM public.testimonial_submissions
WHERE status = 'published' AND consent_to_publish = true;

GRANT SELECT ON public.published_testimonials TO anon, authenticated;

REVOKE SELECT ON public.testimonial_submissions FROM anon;
REVOKE SELECT ON public.testimonial_submissions FROM authenticated;

-- authenticated still needs table-level SELECT; RLS + is_admin() restricts rows.
GRANT SELECT ON public.testimonial_submissions TO authenticated;
