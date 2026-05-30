-- Fix admin testimonial reads returning 403 from PostgREST.
--
-- Migration 20260523000100 revoked SELECT from authenticated but RLS policies
-- alone cannot grant table access — authenticated must keep SELECT at the
-- privilege level; is_admin() still limits which rows are visible.

GRANT SELECT ON public.testimonial_submissions TO authenticated;
