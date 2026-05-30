import React, { useEffect, useState } from "react";
import { Loader2, MessageSquareQuote, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { supabase } from "../utils/supabase/client";
import type { TestimonialStatus, TestimonialSubmission } from "../types/testimonial";
import { ds } from "../design-system/classes";

const STATUS_LABELS: Record<TestimonialStatus, string> = {
  pending: "Pending review",
  approved: "Approved (not on site yet)",
  published: "Published (live on site)",
  declined: "Declined",
};

const NAME_LABELS: Record<string, string> = {
  full_name: "Full name",
  first_only: "First + initial",
  initials_only: "Initials only",
  anonymous: "Anonymous",
};

export function Testimonials() {
  const [items, setItems] = useState<TestimonialSubmission[]>([]);
  const [filter, setFilter] = useState<TestimonialStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonial_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data as TestimonialSubmission[]) || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    const channel = supabase
      .channel("testimonial_submissions_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonial_submissions" },
        () => fetchTestimonials(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusChange = async (id: string, status: TestimonialStatus) => {
    try {
      const { error } = await supabase
        .from("testimonial_submissions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Marked as ${STATUS_LABELS[status]}`);
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t)),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const filtered =
    filter === "all" ? items : items.filter((t) => t.status === filter);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share-your-story`
      : "/share-your-story";

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl ${ds.headingSection}`}>Testimonials</h2>
          <p className="text-slate-500 mt-1">
            Client story submissions from your share link
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={fetchTestimonials}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border-default bg-neutral-50 p-6">
        <p className="text-sm font-medium text-slate-800 mb-1">Share with clients</p>
        <p className="text-sm text-slate-600 break-all">
          <a href={shareUrl} className="text-text-secondary hover:underline" target="_blank" rel="noreferrer">
            {shareUrl}
          </a>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "published", "declined"] as const).map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            className={filter === s ? `${ds.btnPrimary}` : ""}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]}
            {s !== "all" && (
              <span className="ml-1 opacity-70">
                ({items.filter((t) => t.status === s).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <MessageSquareQuote className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          No submissions yet. Share the link above after clients visit.
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((t) => (
            <li
              key={t.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                className="w-full text-left p-6 hover:bg-slate-50/80 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === t.id ? null : t.id)
                }
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xl text-slate-900 italic leading-snug">
                      &ldquo;{t.headline_quote}&rdquo;
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      {t.full_name}
                      {t.city ? ` · ${t.city}` : ""}
                      {" · "}
                      {new Date(t.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        t.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : t.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "declined"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {STATUS_LABELS[t.status]}
                    </span>
                    {t.nps_score != null && (
                      <span className="text-xs text-slate-500">NPS {t.nps_score}/10</span>
                    )}
                  </div>
                </div>
              </button>

              {expandedId === t.id && (
                <div className="px-6 pb-6 pt-0 border-t border-slate-100 space-y-4 text-sm">
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <Detail label="Email" value={t.email} />
                    <Detail
                      label="Name on site"
                      value={NAME_LABELS[t.name_display_permission]}
                    />
                    <Detail label="Photo" value={t.photo_permission.replace(/_/g, " ")} />
                  </div>
                  <DetailBlock label="What made you book" value={t.what_made_you_book} />
                  <DetailBlock label="Smile before" value={t.smile_before} />
                  <DetailBlock label="Smile after" value={t.smile_after} />
                  <DetailBlock label="Experience highlights" value={t.experience_highlights} />
                  <DetailBlock label="Would recommend" value={t.would_recommend} />
                  <DetailBlock label="Additional notes" value={t.additional_notes} />

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-slate-600 font-medium">Status</span>
                    <Select
                      value={t.status}
                      onValueChange={(v) =>
                        handleStatusChange(t.id, v as TestimonialStatus)
                      }
                    >
                      <SelectTrigger className="w-48 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_LABELS) as TestimonialStatus[]).map(
                          (s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-slate-500 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-slate-700 whitespace-pre-wrap">{value}</p>
    </div>
  );
}
