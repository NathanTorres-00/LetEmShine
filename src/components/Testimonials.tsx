import React from "react";
import { Star } from "lucide-react";
import { ds } from "../design-system/classes";

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

          <h3 className="text-3xl md:text-4xl font-sans text-text-primary leading-normal mb-8 mt-4">
            Lucy and her team are fantastic! <br />
            <span className="text-text-secondary bg-neutral-50 px-2">
              My smile has never looked better.
            </span>
          </h3>

          <div className="flex items-center justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 text-neutral-900 fill-neutral-900" />
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-neutral-50 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
                alt="Dr. Jason Gleam"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-sans font-medium text-text-primary text-lg">Dr. Jason Gleam</p>
              <p className={ds.textBodySm}>Dentist at Glowing Dental</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
