import React from "react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { ds } from "../design-system/classes";
import { siteHeaderHeight } from "./Header";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { site } from "../config/site";

// TODO replace with owner-supplied photography (Lucy) once available.
// Recommended dimensions: 1200x1500 (4:5) or square; serve as WebP from /public.
const HERO_IMAGE_SRC =
  "https://images.unsplash.com/photo-1758600587815-b654d1405e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjB3aGl0ZSUyMHNtaWxlJTIwd29tYW4lMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc2MzY2OTU0N3ww&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-bg-muted pb-12"
      style={{ paddingTop: siteHeaderHeight + 24 }}
    >
      <div className={ds.decorMutedPanel} />

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className={`${ds.labelCaps} mb-6`}>✦ Teeth whitening</p>

          <h1 className={`${ds.headingDisplay} mb-2`}>Let Your Smile</h1>
          <p
            className={`${ds.displayScript} text-[64px] md:text-[80px] text-neutral-900 -mt-2 mb-1`}
          >
            Shine
          </p>
          <p className={`${ds.displaySerif} text-[32px] md:text-[40px] text-text-secondary mb-8`}>
            by Lucy
          </p>

          <p className={`${ds.textBodyLg} mb-8 max-w-md`}>{site.tagline}</p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className={ds.btnPrimaryLg}
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book Your Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={ds.btnSecondaryLg}
              onClick={() =>
                document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Results
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div
            className="relative aspect-[4/5] md:aspect-square overflow-hidden shadow-[var(--shadow-elevated)]"
            style={{ borderRadius: "var(--radius-xl)" }}
          >
            <ImageWithFallback
              src={HERO_IMAGE_SRC}
              alt="Bright, healthy smile"
              className="w-full h-full object-cover"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
