import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { ds } from "../design-system/classes";
import { Button } from "./ui/button";
import { supabase, isSupabaseConfigured } from "../utils/supabase/client";
import {
  formatDisplayName,
  type PublishedTestimonial,
} from "../types/testimonial";

export function Testimonials() {
  const [items, setItems] = useState<PublishedTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("published_testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        if (cancelled) return;
        if (error) throw error;
        setItems((data as PublishedTestimonial[]) ?? []);
      } catch (err) {
        console.error("[testimonials]", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-bg-default">
        <div className="container mx-auto px-6 max-w-4xl flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" aria-label="Loading testimonials" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
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

  return (
    <section id="testimonials" className="py-24 bg-bg-default">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-14">
          <p className={`${ds.labelCaps} mb-3`}>Client stories</p>
          <h2 className={ds.headingSection}>What people are saying</h2>
        </div>

        <ul className="grid gap-8 md:grid-cols-2">
          {items.map((t) => {
            const displayName = formatDisplayName(
              t.full_name,
              t.name_display_permission,
            );
            return (
              <li
                key={t.id}
                className={`${ds.cardElevated} p-8 md:p-10 relative`}
                style={{ borderRadius: "var(--radius-xl)" }}
              >
                <div
                  className="absolute -top-5 left-8 bg-neutral-900 text-text-inverse w-10 h-10 rounded-full flex items-center justify-center text-2xl font-[family-name:var(--font-display-serif)] shadow-[var(--shadow-elevated)]"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>

                <blockquote className="mt-2">
                  <p className="font-[family-name:var(--font-display-serif)] text-xl md:text-2xl text-text-primary leading-snug italic">
                    &ldquo;{t.headline_quote}&rdquo;
                  </p>
                  {t.experience_highlights && (
                    <p className={`${ds.textBody} mt-4`}>{t.experience_highlights}</p>
                  )}
                </blockquote>

                <footer className="mt-6 pt-6 border-t border-border-default flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-sans text-sm font-medium text-text-primary">
                      {displayName}
                    </p>
                    {t.city && (
                      <p className={`${ds.textBodySm} mt-0.5`}>{t.city}</p>
                    )}
                  </div>
                  {t.nps_score != null && (
                    <p className={`${ds.textLabel} text-text-muted`}>
                      Recommends {t.nps_score}/10
                    </p>
                  )}
                </footer>
              </li>
            );
          })}
        </ul>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className={`${ds.btnSecondaryLg} h-11 px-6 text-sm`}>
            <Link to="/share-your-story">Share your story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
