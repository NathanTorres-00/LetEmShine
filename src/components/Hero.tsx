import React from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ds } from "../design-system/classes";
import { site } from "../config/site";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  const { serviceCategory, serviceDescription } = site.pricing;

  return (
    <section
      id="hero"
      className={ds.editorialHero}
      aria-label="Shine by Lucy — Teeth Whitening Session"
    >
      <div className={ds.editorialRule} aria-hidden="true" />

      <p className={ds.editorialSideLabel} aria-hidden="true">
        Shine by Lucy
      </p>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.7, delay: 0.05 }}
        className={`absolute top-10 md:top-12 left-6 md:left-16 ${ds.labelCaps} text-[#66666e]`}
      >
        01 / {serviceCategory}
      </motion.p>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.9, delay: 0.1 }}
        className={`${ds.displaySerif} absolute left-[-0.5rem] md:left-[-1.5rem] top-[7.5rem] md:top-[6.875rem] text-[clamp(7rem,18vw,12.5rem)] leading-[0.9] tracking-[-0.03em] text-white pointer-events-none select-none`}
        aria-hidden="true"
      >
        Shine
      </motion.p>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.85, delay: 0.25 }}
        className={`${ds.displayScript} absolute left-[12rem] md:left-[21.25rem] top-[16rem] md:top-[20.625rem] text-[clamp(2.75rem,6vw,4.5rem)] leading-none text-white/80 pointer-events-none`}
        aria-hidden="true"
      >
        by Lucy
      </motion.p>

      <div className="absolute inset-x-0 top-[7rem] md:top-[11.25rem] lg:left-[600px] lg:right-auto lg:w-[340px] px-6 md:px-10 lg:px-0">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.35 }}
          className={`${ds.labelCaps} text-[#73737a] mb-3`}
        >
          Teeth Whitening
        </motion.p>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.75, delay: 0.42 }}
          className={`${ds.displaySerif} text-[clamp(2rem,4vw,3rem)] leading-[1.12] tracking-[-0.02em] text-white mb-6`}
        >
          Every moment
          <br />
          tells a story.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-sans text-[15px] leading-6 text-[#8c8c94] mb-10 max-w-[340px]"
        >
          {serviceDescription}
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.65, delay: 0.58 }}
        >
          <Button
            size="lg"
            className="h-12 px-7 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-sans text-[13px] tracking-wide shadow-none"
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Reserve Your Session
          </Button>
        </motion.div>
      </div>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="absolute bottom-8 md:bottom-12 left-6 md:left-16 font-sans text-[10px] tracking-wide text-[#595961]"
      >
        Est. 2020 · San Francisco · By appointment only
      </motion.p>

      <span className="sr-only">
        Shine by Lucy — {site.pricing.serviceName}. {site.tagline}
      </span>
    </section>
  );
}
