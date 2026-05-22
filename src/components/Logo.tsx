import React from "react";
import { cn } from "./ui/utils";

type LogoProps = {
  className?: string;
};

/** Shine by Lucy wordmark — black SVG (`public/logo-shine-by-lucy.svg`). */
export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/logo-shine-by-lucy.svg"
      alt="Shine by Lucy"
      className={cn(
        "h-8 w-auto max-w-[168px] shrink-0 object-contain object-left",
        className,
      )}
      decoding="async"
    />
  );
}
