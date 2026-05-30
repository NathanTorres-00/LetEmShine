import React from "react";
import { Clock, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { ds } from "../design-system/classes";
import { site } from "../config/site";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1606811841687-534e45f96825?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800";

export function WelcomeSection() {
  const { hours, address } = site.contact;
  const { serviceName, serviceCategory, serviceDescription, servicePrice } = site.pricing;
  const hasInfoRow = Boolean(hours || address);

  return (
    <section id="services" className="py-24 md:py-28 bg-bg-muted relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-14 md:mb-16 max-w-2xl">
          <p className={`${ds.labelCaps} text-text-muted mb-3`}>The Session</p>
          <h2
            className={`${ds.displaySerif} text-[clamp(2rem,4.5vw,2.75rem)] leading-tight tracking-[-0.02em] text-text-primary`}
          >
            One session. Lasting brilliance.
          </h2>
        </div>

        <div className="flex justify-center">
          <article
            className="w-full max-w-[360px] bg-bg-default overflow-hidden shadow-[var(--shadow-elevated)]"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div className="relative aspect-[360/220] overflow-hidden bg-neutral-100">
              <ImageWithFallback
                src={SERVICE_IMAGE}
                alt="Teeth whitening session"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/25 to-transparent pointer-events-none" />
            </div>

            <div className="p-6">
              <p className={`${ds.labelCaps} text-text-muted mb-2`}>{serviceCategory}</p>
              <h3 className={`${ds.displaySerif} text-[22px] leading-7 text-text-primary mb-3`}>
                {serviceName}
              </h3>
              <p className={`${ds.textBody} mb-6`}>{serviceDescription}</p>

              <div className="flex items-center justify-between gap-4 pt-1">
                <p className="font-sans text-[15px] text-text-primary">from ${servicePrice}</p>
                <button
                  type="button"
                  className="font-sans text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                  onClick={() =>
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Book →
                </button>
              </div>
            </div>
          </article>
        </div>

        {hasInfoRow && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mt-16">
            {hours && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-text-muted" aria-hidden="true" />
                <span className="font-sans text-base text-text-secondary">{hours}</span>
              </div>
            )}
            {hours && address && (
              <div className="w-px h-8 bg-border-default hidden md:block" />
            )}
            {address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-text-muted" aria-hidden="true" />
                <span className="font-sans text-base text-text-secondary">{address}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex justify-center md:hidden">
          <Button
            className={ds.btnPrimary}
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Book Now
          </Button>
        </div>
      </div>
    </section>
  );
}
