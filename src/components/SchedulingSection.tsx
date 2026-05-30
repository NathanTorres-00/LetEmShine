import React from "react";
import { CalendarClock, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { ds } from "../design-system/classes";
import { site } from "../config/site";

/**
 * Placeholder for the public booking flow.
 *
 * Per LET_EM_SHINE_PRD.md, booking + payments live entirely in Calendly +
 * Stripe (Calendly-native payments). Until the owner's Calendly account is
 * connected, this section shows a "coming soon" card so the landing page
 * doesn't attempt a half-finished custom booking flow.
 *
 * To switch this section to the live Calendly embed:
 *   1. Set `site.booking.calendlyUrl` in src/config/site.ts
 *   2. Replace the <ComingSoonCard /> block below with the embed (e.g.
 *      Calendly's <InlineWidget /> or their script-based widget).
 */
export function SchedulingSection() {
  const { calendlyUrl } = site.booking;
  const contactEmail = site.contact.email;

  return (
    <section className="py-24 bg-bg-muted" id="contact">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl ${ds.headingSection} mb-4`}>
              Book Your {site.pricing.serviceName}
            </h2>
            <p className={ds.textBody}>
              Online booking is launching soon. Reserve your teeth whitening session — we&rsquo;ll
              get you on the calendar.
            </p>
          </div>

          {calendlyUrl ? (
            <CalendlyPlaceholder url={calendlyUrl} />
          ) : (
            <ComingSoonCard contactEmail={contactEmail} />
          )}
        </div>
      </div>
    </section>
  );
}

function ComingSoonCard({ contactEmail }: { contactEmail: string | null }) {
  return (
    <div
      className={`${ds.cardElevated} p-10 md:p-14 text-center`}
      style={{ borderRadius: "var(--radius-xl)" }}
    >
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-50">
        <CalendarClock className="h-6 w-6 text-neutral-900" />
      </div>

      <h3 className="text-xl md:text-2xl font-sans text-text-primary mb-3">
        Booking opens soon
      </h3>

      <p className={`${ds.textBody} max-w-md mx-auto mb-8`}>
        We&rsquo;re finalizing online scheduling so you can pick a time and
        secure your spot with a small reservation fee. Until then,
        appointments are by request.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {contactEmail ? (
          <Button asChild className={ds.btnPrimary}>
            <a href={`mailto:${contactEmail}?subject=Booking%20request`}>
              <Mail className="h-4 w-4 mr-2" />
              Email to book
            </a>
          </Button>
        ) : (
          <p className={`${ds.textBodySm} italic`}>
            Contact details coming soon.
          </p>
        )}
      </div>

      <p className={`${ds.textBodySm} mt-8 text-text-muted`}>
        ${site.pricing.servicePrice} · {site.pricing.serviceName}
        {" · "}${site.pricing.depositAmount} reservation fee at booking
      </p>
    </div>
  );
}

/**
 * Renders once `site.booking.calendlyUrl` is set. Until we install Calendly's
 * official React widget (or paste their inline embed snippet), this is a
 * styled "Book now" CTA that opens Calendly in a new tab — a working
 * placeholder that already feels native.
 */
function CalendlyPlaceholder({ url }: { url: string }) {
  return (
    <div
      className={`${ds.cardElevated} p-10 md:p-14 text-center`}
      style={{ borderRadius: "var(--radius-xl)" }}
    >
      <h3 className="text-xl md:text-2xl font-sans text-text-primary mb-3">
        Pick a time that works for you
      </h3>
      <p className={`${ds.textBody} max-w-md mx-auto mb-8`}>
        Choose a time for your {site.pricing.serviceName.toLowerCase()} — you&rsquo;ll lock it in
        with a ${site.pricing.depositAmount} reservation fee.
      </p>
      <Button asChild className={ds.btnPrimaryLg}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open booking calendar
        </a>
      </Button>
    </div>
  );
}
