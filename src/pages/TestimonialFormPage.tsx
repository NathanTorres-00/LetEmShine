import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { supabase } from "../utils/supabase/client";
import type {
  NameDisplayPermission,
  PhotoPermission,
  TestimonialSubmissionInsert,
} from "../types/testimonial";
import { ds } from "../design-system/classes";
import { Logo } from "../components/Logo";
import { siteHeaderHeight } from "../components/Header";

const initialForm: TestimonialSubmissionInsert = {
  full_name: "",
  email: "",
  city: "",
  what_made_you_book: "",
  smile_before: "",
  smile_after: "",
  experience_highlights: "",
  would_recommend: "",
  headline_quote: "",
  additional_notes: "",
  nps_score: undefined,
  name_display_permission: "first_only",
  photo_permission: "no",
  consent_to_publish: false,
};

function FieldGroup({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-text-primary">
        {label}
        {required && <span className="text-text-secondary ml-1">*</span>}
      </Label>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${ds.cardElevated} p-8 md:p-10 space-y-6`}>
      <div>
        <h2 className={`text-2xl ${ds.headingSection}`}>{title}</h2>
        {description && (
          <p className={`${ds.textBody} mt-2`}>{description}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function TestimonialFormPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof TestimonialSubmissionInsert>(
    key: K,
    value: TestimonialSubmissionInsert[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!form.headline_quote.trim()) {
      toast.error('Please complete: "Let Em Shine helped me…"');
      return;
    }
    if (!form.consent_to_publish) {
      toast.error("Please confirm we may review and publish your feedback.");
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      toast.error("This form is not configured yet. Please contact Let Em Shine.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email?.trim() || null,
        city: form.city?.trim() || null,
        what_made_you_book: form.what_made_you_book?.trim() || null,
        smile_before: form.smile_before?.trim() || null,
        smile_after: form.smile_after?.trim() || null,
        experience_highlights: form.experience_highlights?.trim() || null,
        would_recommend: form.would_recommend?.trim() || null,
        headline_quote: form.headline_quote.trim(),
        additional_notes: form.additional_notes?.trim() || null,
        nps_score: form.nps_score ?? null,
        name_display_permission: form.name_display_permission,
        photo_permission: form.photo_permission,
        consent_to_publish: true,
      };

      const { error } = await supabase.from("testimonial_submissions").insert(payload);

      if (error) throw error;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error(
        "We could not save your response. Please try again or email contact@letemshine.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={ds.page}>
        <div className={ds.decorGradientRight} />
        <div className="container mx-auto px-6 py-24 max-w-2xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-50 text-neutral-900 mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className={`text-4xl ${ds.headingDisplay} mb-4`}>
            Thank you for sharing!
          </h1>
          <p className={`text-lg ${ds.textBody} mb-8`}>
            Lucy will review your words and reach out if we&apos;d like to feature your story on
            the site. We may lightly edit for length — you&apos;ll always get final approval
            before anything goes live.
          </p>
          <Button
            asChild
            className={`${ds.btnPrimaryLg} h-12`}
          >
            <Link to="/">Back to Let Em Shine</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={ds.page}>
      <div className={ds.decorGradientRight} />
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border-default bg-bg-default/90 backdrop-blur-md`}
        style={{ height: siteHeaderHeight }}
      >
        <div className="container mx-auto h-full max-w-6xl px-6 flex items-center justify-between">
          <Link to="/" className="shrink-0 py-1" aria-label="Shine by Lucy — Home">
            <Logo className="h-[30px]" />
          </Link>
          <Link
            to="/"
            className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors"
          >
            Main site
          </Link>
        </div>
      </header>

      <main
        className="relative z-10 container mx-auto px-6 py-12 md:py-16 max-w-3xl"
        style={{ paddingTop: siteHeaderHeight + 48 }}
      >
        <div className="text-center mb-12">
          <p className={`${ds.labelCaps} mb-3`}>Client stories</p>
          <h1 className={`text-4xl md:text-5xl mb-4`}>
            Share your{" "}
            <span className={`${ds.displayScript} text-5xl md:text-6xl text-neutral-900`}>
              shine
            </span>{" "}
            story
          </h1>
          <p className={`text-lg ${ds.textBody} max-w-xl mx-auto`}>
            A few honest answers help us celebrate real results. Reply in your own words — a
            sentence or two per question is perfect.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <SectionCard
            title="About you"
            description="So we know who to thank and how to reach you if we feature your story."
          >
            <FieldGroup label="Full name" required>
              <Input
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="Your name"
                className={`${ds.inputField} h-11`}
                autoComplete="name"
              />
            </FieldGroup>
            <div className="grid md:grid-cols-2 gap-6">
              <FieldGroup label="Email" hint="Optional — only if we need to follow up.">
                <Input
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                  className={`${ds.inputField} h-11`}
                  autoComplete="email"
                />
              </FieldGroup>
              <FieldGroup label="City or neighborhood" hint="Helps local visitors relate.">
                <Input
                  value={form.city ?? ""}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="e.g. Bright City"
                  className={`${ds.inputField} h-11`}
                />
              </FieldGroup>
            </div>
          </SectionCard>

          <SectionCard
            title="Your experience"
            description="There are no wrong answers — we're looking for what felt true to you."
          >
            <FieldGroup
              label="What made you book with Let Em Shine?"
              hint="Price, Lucy, a friend’s referral, an upcoming event — whatever applied."
            >
              <Textarea
                value={form.what_made_you_book ?? ""}
                onChange={(e) => update("what_made_you_book", e.target.value)}
                rows={3}
                className={`${ds.inputField} min-h-[88px]`}
              />
            </FieldGroup>
            <FieldGroup label="How would you describe your smile before your visit?">
              <Textarea
                value={form.smile_before ?? ""}
                onChange={(e) => update("smile_before", e.target.value)}
                rows={3}
                className={`${ds.inputField} min-h-[88px]`}
              />
            </FieldGroup>
            <FieldGroup label="How do you feel about your smile after?">
              <Textarea
                value={form.smile_after ?? ""}
                onChange={(e) => update("smile_after", e.target.value)}
                rows={3}
                className={`${ds.inputField} min-h-[88px]`}
              />
            </FieldGroup>
            <FieldGroup label="What stood out about the appointment?">
              <Textarea
                value={form.experience_highlights ?? ""}
                onChange={(e) => update("experience_highlights", e.target.value)}
                rows={3}
                placeholder="Comfort, professionalism, speed, how Lucy explained things…"
                className={`${ds.inputField} min-h-[88px]`}
              />
            </FieldGroup>
            <FieldGroup label="Would you recommend us? Why or why not?">
              <Textarea
                value={form.would_recommend ?? ""}
                onChange={(e) => update("would_recommend", e.target.value)}
                rows={3}
                className={`${ds.inputField} min-h-[88px]`}
              />
            </FieldGroup>
          </SectionCard>

          <SectionCard
            title="For our website"
            description="This is the line we might feature on the homepage — keep it short and heartfelt."
          >
            <FieldGroup
              label='Complete: "Let Em Shine helped me…"'
              required
              hint="10–20 words works great."
            >
              <Textarea
                value={form.headline_quote}
                onChange={(e) => update("headline_quote", e.target.value)}
                rows={2}
                placeholder="Let Em Shine helped me feel confident smiling in photos again."
                className={`${ds.inputField} min-h-[72px]`}
              />
            </FieldGroup>
            <FieldGroup label="How likely are you to book again or refer someone? (1–10)">
              <Select
                value={form.nps_score?.toString() ?? ""}
                onValueChange={(v) =>
                  update("nps_score", v ? parseInt(v, 10) : undefined)
                }
              >
                <SelectTrigger className="rounded-xl border-slate-200 h-11 w-full md:w-48">
                  <SelectValue placeholder="Select 1–10" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
            <FieldGroup label="Anything else future clients should know?">
              <Textarea
                value={form.additional_notes ?? ""}
                onChange={(e) => update("additional_notes", e.target.value)}
                rows={3}
                className={`${ds.inputField} min-h-[88px]`}
              />
            </FieldGroup>
          </SectionCard>

          <SectionCard
            title="Permissions"
            description="You stay in control. We only publish what you approve."
          >
            <FieldGroup label="How may we show your name on the site?">
              <RadioGroup
                value={form.name_display_permission}
                onValueChange={(v) =>
                  update("name_display_permission", v as NameDisplayPermission)
                }
                className="gap-4"
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <RadioGroupItem value="full_name" className="mt-1" />
                  <span className="text-sm text-slate-700">
                    First and last name (e.g. Sarah Martinez)
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <RadioGroupItem value="first_only" className="mt-1" />
                  <span className="text-sm text-slate-700">
                    First name and last initial (e.g. Sarah M.)
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <RadioGroupItem value="initials_only" className="mt-1" />
                  <span className="text-sm text-slate-700">Initials only (e.g. S.M.)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <RadioGroupItem value="anonymous" className="mt-1" />
                  <span className="text-sm text-slate-700">Anonymous — no name on site</span>
                </label>
              </RadioGroup>
            </FieldGroup>

            <FieldGroup label="May we contact you about a photo?">
              <RadioGroup
                value={form.photo_permission}
                onValueChange={(v) => update("photo_permission", v as PhotoPermission)}
                className="gap-4"
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <RadioGroupItem value="yes_before_after" className="mt-1" />
                  <span className="text-sm text-slate-700">
                    Yes — I can share before/after photos
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <RadioGroupItem value="smile_only" className="mt-1" />
                  <span className="text-sm text-slate-700">Smile photo only (no before)</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <RadioGroupItem value="no" className="mt-1" />
                  <span className="text-sm text-slate-700">No photo</span>
                </label>
              </RadioGroup>
            </FieldGroup>

            <div className="flex items-start gap-3 rounded-[var(--radius-lg)] bg-neutral-50 border border-border-default p-4">
              <Checkbox
                id="consent"
                checked={form.consent_to_publish}
                onCheckedChange={(checked) =>
                  update("consent_to_publish", checked === true)
                }
                className="mt-0.5 border-neutral-400 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
              />
              <label htmlFor="consent" className={`${ds.textBodySm} leading-relaxed cursor-pointer`}>
                I agree that Let Em Shine may review my responses and contact me for approval
                before publishing any testimonial on the website or marketing. Honest feedback
                is welcome.
              </label>
            </div>
          </SectionCard>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-14 text-lg ${ds.btnPrimaryLg}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sending…
              </>
            ) : (
              "Submit my story"
            )}
          </Button>

          <p className={`text-center ${ds.textBodySm} pb-8`}>
            Questions?{" "}
            <a href="mailto:contact@letemshine.com" className="text-text-secondary hover:underline">
              contact@letemshine.com
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
