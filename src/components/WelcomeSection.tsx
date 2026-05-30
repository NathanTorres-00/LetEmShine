import React from "react";
import { Clock, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { ds } from "../design-system/classes";
import { site } from "../config/site";

export function WelcomeSection() {
  const { hours, address } = site.contact;
  const { serviceName, serviceCategory, serviceDescription, servicePrice } = site.pricing;
  const hasInfoRow = Boolean(hours || address);

  return (
    <section id="services" className={`${ds.sectionInverse} py-24 relative overflow-hidden`}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className={`${ds.labelCaps} text-neutral-400 mb-4`}>✦ {serviceCategory}</p>
          <h2
            className={`${ds.displaySerif} text-4xl md:text-5xl text-text-inverse leading-tight mb-4`}
          >
            One session. Lasting brilliance.
          </h2>
          <p className="font-sans text-lg text-neutral-400">
            By appointment only — one signature {serviceName.toLowerCase()}, personalized to you.
          </p>
        </div>

        <div
          className="max-w-md mx-auto bg-bg-default overflow-hidden shadow-[var(--shadow-elevated)]"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <div className="aspect-[4/3] bg-neutral-100 border-b border-border-default" aria-hidden="true" />

          <div className="p-6 md:p-8">
            <p className={`${ds.labelCaps} text-text-muted mb-2`}>{serviceCategory}</p>
            <h3 className={`${ds.displaySerif} text-2xl text-text-primary mb-3`}>{serviceName}</h3>
            <p className={`${ds.textBody} mb-6`}>{serviceDescription}</p>

            <div className="flex items-center justify-between gap-4">
              <p className="font-sans text-sm text-text-primary">from ${servicePrice}</p>
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
        </div>

        {hasInfoRow && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mt-16">
            {hours && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                <span className="font-sans text-base text-neutral-300">{hours}</span>
              </div>
            )}
            {hours && address && <div className="w-px h-8 bg-neutral-600 hidden md:block" />}
            {address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                <span className="font-sans text-base text-neutral-300">{address}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute top-1/2 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
    </section>
  );
}
