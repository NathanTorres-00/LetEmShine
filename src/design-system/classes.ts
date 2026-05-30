/**
 * Tailwind class recipes — Shine Foundations (Figma 214:2)
 */
export const ds = {
  page: "min-h-screen bg-bg-muted font-sans text-text-primary selection:bg-neutral-50 selection:text-text-primary",

  labelCaps:
    "font-sans text-[11px] leading-4 tracking-[0.12em] uppercase text-text-secondary",

  displayScript:
    "font-[family-name:var(--font-display-script)] font-normal leading-none",

  displaySerif:
    "font-[family-name:var(--font-display-serif)] font-normal leading-tight",

  headingDisplay:
    "font-sans text-[40px] leading-[48px] font-normal text-text-primary",
  headingSection:
    "font-sans text-[28px] leading-9 font-normal text-text-primary",
  headingCard:
    "font-sans text-[22px] leading-7 font-normal text-text-primary",

  textBodyLg: "font-sans text-lg leading-[29px] text-text-secondary",
  textBody: "font-sans text-[15px] leading-6 text-text-secondary",
  textBodySm: "font-sans text-[13px] leading-5 text-text-muted",
  textLabel:
    "font-sans text-[11px] font-normal uppercase tracking-[0.55px] text-text-muted",

  logoWordmark: "inline-flex items-baseline gap-2",
  logoShine:
    "font-[family-name:var(--font-display-script)] text-3xl md:text-4xl text-text-primary leading-none",
  logoByLucy:
    "font-[family-name:var(--font-display-serif)] text-lg md:text-xl text-text-secondary leading-none",

  cardElevated:
    "bg-bg-default rounded-[var(--radius-lg)] border border-border-default shadow-[var(--shadow-elevated)]",

  btnPrimary:
    "bg-neutral-900 hover:bg-neutral-950 text-text-inverse rounded-[var(--radius-full)] font-sans text-sm font-normal transition-colors",
  btnPrimaryLg:
    "bg-neutral-900 hover:bg-neutral-950 text-text-inverse rounded-[var(--radius-full)] px-8 h-14 text-base font-sans transition-colors",
  btnSecondaryLg:
    "border border-neutral-50 bg-bg-default text-text-primary hover:bg-neutral-50 rounded-[var(--radius-full)] px-8 h-14 text-base font-sans transition-colors",
  btnOnDark:
    "bg-text-inverse text-neutral-900 hover:bg-neutral-50 rounded-[var(--radius-full)] font-sans text-sm transition-colors",

  inputField:
    "rounded-[var(--radius-md)] border-border-default bg-input-background focus-visible:ring-neutral-400",

  headerBar:
    "fixed top-0 left-0 right-0 z-50 h-[72px] bg-bg-default/90 backdrop-blur-md border-b border-border-default",
  headerInner:
    "container mx-auto h-full max-w-6xl px-6 flex items-center justify-between gap-6",

  btnTimeSlot:
    "h-[42px] rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 border",
  btnTimeSlotActive:
    "bg-neutral-900 border-neutral-900 text-text-inverse scale-[1.02]",
  btnTimeSlotIdle:
    "bg-bg-default border-border-default text-text-secondary hover:bg-neutral-50 hover:border-neutral-400",

  sectionInverse: "bg-bg-inverse text-text-inverse",
  decorMutedPanel:
    "absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neutral-50/80 to-transparent rounded-bl-[100px] pointer-events-none",

  /** Glass nav over dark editorial hero (Figma 07 Glass / Patterns) */
  glassNavDark:
    "bg-[rgb(255_255_255/0.08)] backdrop-blur-md border-b border-[rgb(255_255_255/0.14)]",
  editorialHero: "relative min-h-[720px] lg:min-h-[820px] bg-[#1b1b1d] text-text-inverse overflow-hidden",
  editorialRule: "absolute top-0 bottom-0 left-[520px] w-px bg-white/12 hidden lg:block",
  editorialSideLabel:
    "absolute left-7 top-1/2 -translate-y-1/2 -rotate-90 origin-center font-sans text-[9px] uppercase tracking-[0.18em] text-neutral-600 whitespace-nowrap hidden lg:block",
} as const;
