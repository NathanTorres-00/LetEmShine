-- Role-based admin gating + bookings table hardening for Calendly + Stripe webhooks
--
-- Adds:
--   * public.is_admin() helper that reads app_metadata.role from the JWT
--   * role-scoped SELECT / UPDATE / DELETE policies on testimonial_submissions
--   * bookings.calendly_* and bookings.stripe_* columns for webhook ingest
--   * admin-only RLS policies on bookings
--   * promotes the bootstrap developer account to role=admin

-- 1. Helper function that reads the JWT app_metadata.role claim
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    FALSE
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. Tighten testimonial_submissions admin policies (replace USING(true) with role check)
DROP POLICY IF EXISTS "Admins can read testimonials" ON public.testimonial_submissions;
CREATE POLICY "Admins can read testimonials"
ON public.testimonial_submissions
FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonial_submissions;
CREATE POLICY "Admins can update testimonials"
ON public.testimonial_submissions
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonial_submissions;
CREATE POLICY "Admins can delete testimonials"
ON public.testimonial_submissions
FOR DELETE
TO authenticated
USING (public.is_admin());

-- 3. Bookings: enforce status enum + add Calendly + Stripe webhook columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'bookings'
      AND constraint_name = 'bookings_status_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_status_check
      CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled'));
  END IF;
END $$;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
  ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT,
  ADD COLUMN IF NOT EXISTS calendly_event_type TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid_cents INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_calendly_invitee_uri_key
  ON public.bookings (calendly_invitee_uri)
  WHERE calendly_invitee_uri IS NOT NULL;

CREATE INDEX IF NOT EXISTS bookings_booking_date_idx
  ON public.bookings (booking_date);

-- 4. Bookings RLS: admin-only read/write/delete from clients.
--    Calendly + Stripe webhooks will use the service_role which bypasses RLS.
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read bookings" ON public.bookings;
CREATE POLICY "Admins can read bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert bookings" ON public.bookings;
CREATE POLICY "Admins can insert bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
CREATE POLICY "Admins can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (public.is_admin());

REVOKE SELECT ON public.bookings FROM anon;

-- 5. Promote the bootstrap developer account to admin so the admin SPA keeps
--    working. Lucy's account should be created and promoted the same way once
--    provisioned (Supabase Auth Console -> User Management -> set role=admin).
UPDATE auth.users
SET raw_app_meta_data =
  COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
WHERE email = 'nathan3320torres@gmail.com';

-- 6. Drop the dead Figma Make KV table (never wired into the app; the edge
--    function that referenced it is also being deleted).
DROP TABLE IF EXISTS public.kv_store_6c8cffa7 CASCADE;
