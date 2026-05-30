import React from "react";
import { ds } from "../design-system/classes";
import { site } from "../config/site";

export function Mission() {
  return (
    <section className="py-24 bg-bg-default">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <p className={`font-sans text-2xl md:text-[28px] leading-9 text-text-primary italic mb-12`}>
          &ldquo;Our mission is to bring out the best in your smile with safe, effective teeth
          whitening.&rdquo;
        </p>

        <div className="flex flex-col items-center">
          <div className="h-px w-24 bg-border-default mb-6" />
          <h3 className={ds.headingSection}>{site.founder.name}</h3>
          <p className={`${ds.labelCaps} mt-3 text-text-muted`}>{site.founder.title}</p>
        </div>
      </div>
    </section>
  );
}
