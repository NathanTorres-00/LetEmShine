/**
 * Site configuration — single source of truth for owner-supplied content.
 *
 * Anything marked TODO needs to be confirmed with Lucy / the business owner
 * before launch. Components import from here so post-meeting updates are a
 * one-file change.
 */

export const site = {
  // Brand
  name: "Shine by Lucy",
  legalName: "Shine by Lucy", // TODO confirm: also seen as "Let 'Em Shine" in older copy
  tagline:
    "Professional teeth whitening in the heart of the city. Safe, effective, and tailored just for you.",

  // Founder
  founder: {
    name: "Lucy", // TODO confirm full name with owner
    title: "Founder", // TODO confirm exact title
  },

  // Pricing (must match Calendly event configuration once connected)
  pricing: {
    serviceName: "Teeth Whitening Session",
    serviceCategory: "TEETH WHITENING",
    serviceDescription:
      "Professional teeth whitening tailored to you. Safe, effective, and designed for a naturally brighter smile.",
    servicePrice: 60, // USD
    depositAmount: 20, // USD reservation fee, charged via Calendly + Stripe
  },

  // Contact — TODO collect from owner
  contact: {
    email: null as string | null, // TODO e.g. "hello@shinebylucy.com"
    phone: null as string | null, // TODO optional
    address: null as string | null, // TODO e.g. "By appointment only" if no public address
    hours: null as string | null, // TODO e.g. "Fri – Sat by appointment" — sync with Calendly availability
  },

  // Social media — TODO collect real URLs; null entries are hidden
  social: {
    instagram: null as string | null, // TODO e.g. "https://instagram.com/shinebylucy"
    tiktok: null as string | null, // TODO optional
    facebook: null as string | null, // TODO optional
  },

  // External booking — populated after Calendly account is connected
  booking: {
    // TODO replace with the real Calendly event URL once provisioned
    // e.g. "https://calendly.com/shinebylucy/teeth-whitening"
    calendlyUrl: null as string | null,
  },
} as const;

export type SiteConfig = typeof site;
