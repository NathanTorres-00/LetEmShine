import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ds } from "../design-system/classes";
import { Button } from "./ui/button";

/**
 * Public testimonials section.
 *
 * Today this shows an empty-state CTA pointing to the testimonial capture
 * form at /share-your-story. Once approved submissions land in the
 * testimonial_submissions table (status = 'published'), wire this to fetch
 * from a public read-only view (e.g. `published_testimonials`) that exposes
 * only safe columns (headline_quote, display name per permission, city).
 *
 * See LET_EM_SHINE_PRD.md and src/admin/Testimonials.tsx for the approval flow.
 */
export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-bg-default">
      <div className="container mx-auto px-6 max-w-4xl">
        <div
          className={`${ds.cardElevated} p-12 md:p-16 text-center relative`}
          style={{ borderRadius: "var(--radius-xl)" }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-text-inverse w-16 h-16 rounded-full flex items-center justify-center text-4xl font-[family-name:var(--font-display-serif)] shadow-[var(--shadow-elevated)]">
            &ldquo;
          </div>

          <div className="mt-4 flex flex-col items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50">
              <Sparkles className="h-5 w-5 text-neutral-900" />
            </div>

            <h3 className="text-2xl md:text-3xl font-sans text-text-primary leading-snug max-w-2xl">
              Real reviews from real smiles &mdash; coming soon.
            </h3>

            <p className={`${ds.textBody} max-w-md`}>
              We&rsquo;re collecting stories from recent clients. If you&rsquo;ve had a teeth
              whitening session with Lucy, we&rsquo;d love to hear how it went.
            </p>

            <Button asChild className={`${ds.btnPrimary} mt-2 px-6 h-11`}>
              <Link to="/share-your-story">Share your story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
