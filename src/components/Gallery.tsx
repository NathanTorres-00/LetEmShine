import React from "react";
import { motion } from "motion/react";
import { Camera, Smile, Sparkles } from "lucide-react";
import { ds } from "../design-system/classes";
import { site } from "../config/site";

/**
 * Gallery section.
 *
 * Today this shows a "results coming soon" placeholder grid. Once Lucy
 * supplies real before/after photos, swap the `tiles` array below for real
 * imagery (or wire to a Supabase storage bucket / CMS collection). All
 * imagery should be owner-approved and properly consented (see
 * `photo_permission` flag on testimonial_submissions).
 */
const tiles = [
  {
    icon: Sparkles,
    label: "Brighter shades",
    caption: "Custom-shade results, on the way.",
  },
  {
    icon: Smile,
    label: "Real smiles",
    caption: "Client photos as soon as they\u2019re approved.",
  },
  {
    icon: Camera,
    label: "Before & after",
    caption: "Side-by-side stories coming soon.",
  },
];

export function Gallery() {
  const instagram = site.social.instagram;

  return (
    <section id="gallery" className="py-24 bg-bg-default">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl ${ds.headingSection} mb-4`}>
            Our Shining Results
          </h2>
          <p className={`${ds.textBody} max-w-2xl mx-auto`}>
            We&rsquo;re gathering real client before-and-afters &mdash; with
            permission and care. Until then, here&rsquo;s a peek at what to
            expect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-neutral-50 border border-border-default flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-default mb-5 shadow-sm">
                  <Icon className="h-6 w-6 text-neutral-900" aria-hidden="true" />
                </div>
                <p className="font-sans font-medium text-text-primary mb-1">
                  {tile.label}
                </p>
                <p className={ds.textBodySm}>{tile.caption}</p>
              </motion.div>
            );
          })}
        </div>

        {instagram && (
          <p className="text-center mt-10">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4"
            >
              Follow along on Instagram for the latest looks &rarr;
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
