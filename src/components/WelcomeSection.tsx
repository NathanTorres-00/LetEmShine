import React from "react";
import { Clock, MapPin } from "lucide-react";
import { ds } from "../design-system/classes";

export function WelcomeSection() {
  return (
    <section id="services" className={`${ds.sectionInverse} py-24 relative overflow-hidden`}>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className={`${ds.headingSection} text-text-inverse mb-8`}>
          Welcome to Shine by Lucy
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-neutral-400">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-text-inverse" />
            <span className="font-sans text-lg text-text-inverse">Mon - Fri: 9am - 5pm</span>
          </div>
          <div className="w-px h-8 bg-neutral-600 hidden md:block" />
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-text-inverse" />
            <span className="font-sans text-lg text-text-inverse">123 Smile St, Bright City</span>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
    </section>
  );
}
