export type NameDisplayPermission =
  | "full_name"
  | "first_only"
  | "initials_only"
  | "anonymous";

export type PhotoPermission = "yes_before_after" | "smile_only" | "no";

export type TestimonialStatus = "pending" | "approved" | "published" | "declined";

export type TestimonialSubmissionInsert = {
  full_name: string;
  email?: string | null;
  city?: string | null;
  what_made_you_book?: string | null;
  smile_before?: string | null;
  smile_after?: string | null;
  experience_highlights?: string | null;
  would_recommend?: string | null;
  headline_quote: string;
  additional_notes?: string | null;
  nps_score?: number | null;
  name_display_permission: NameDisplayPermission;
  photo_permission: PhotoPermission;
  consent_to_publish: boolean;
};

export type TestimonialSubmission = TestimonialSubmissionInsert & {
  id: string;
  created_at: string;
  status: TestimonialStatus;
  admin_notes: string | null;
};

/** Row shape from the public `published_testimonials` view (no PII like email). */
export type PublishedTestimonial = {
  id: string;
  created_at: string;
  full_name: string;
  city: string | null;
  headline_quote: string;
  experience_highlights: string | null;
  nps_score: number | null;
  name_display_permission: NameDisplayPermission;
  photo_permission: PhotoPermission;
};

export function formatDisplayName(
  fullName: string,
  permission: NameDisplayPermission,
): string {
  const trimmed = fullName.trim();
  if (!trimmed || permission === "anonymous") return "Verified client";

  const parts = trimmed.split(/\s+/);
  if (permission === "initials_only") {
    return parts
      .map((p) => p.charAt(0).toUpperCase())
      .join(".")
      .concat(".");
  }

  if (permission === "first_only") {
    const first = parts[0];
    const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return lastInitial ? `${first} ${lastInitial}.` : first;
  }

  return trimmed;
}
