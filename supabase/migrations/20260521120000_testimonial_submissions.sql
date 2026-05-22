-- Testimonial capture for Let Em Shine / Shine by Lucy
-- Run in Supabase SQL Editor (or via CLI) after restoring the project.

CREATE TABLE IF NOT EXISTS public.testimonial_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  city TEXT,
  what_made_you_book TEXT,
  smile_before TEXT,
  smile_after TEXT,
  experience_highlights TEXT,
  would_recommend TEXT,
  headline_quote TEXT NOT NULL,
  additional_notes TEXT,
  nps_score INTEGER CHECK (nps_score IS NULL OR (nps_score >= 1 AND nps_score <= 10)),
  name_display_permission TEXT NOT NULL DEFAULT 'first_only'
    CHECK (name_display_permission IN ('full_name', 'first_only', 'initials_only', 'anonymous')),
  photo_permission TEXT NOT NULL DEFAULT 'no'
    CHECK (photo_permission IN ('yes_before_after', 'smile_only', 'no')),
  consent_to_publish BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'published', 'declined')),
  admin_notes TEXT
);

ALTER TABLE public.testimonial_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public testimonial submission" ON public.testimonial_submissions;
CREATE POLICY "Allow public testimonial submission"
ON public.testimonial_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (consent_to_publish = true);

DROP POLICY IF EXISTS "Admins can read testimonials" ON public.testimonial_submissions;
CREATE POLICY "Admins can read testimonials"
ON public.testimonial_submissions
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonial_submissions;
CREATE POLICY "Admins can update testimonials"
ON public.testimonial_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
