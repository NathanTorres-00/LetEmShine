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
