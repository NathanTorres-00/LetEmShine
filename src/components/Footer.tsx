import React from "react";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { ds } from "../design-system/classes";
import { Logo } from "./Logo";
import { site } from "../config/site";

type SocialLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [];
  if (site.social.instagram) {
    links.push({ label: "Instagram", href: site.social.instagram, icon: Instagram });
  }
  if (site.social.tiktok) {
    links.push({ label: "TikTok", href: site.social.tiktok, icon: Music2 });
  }
  if (site.social.facebook) {
    links.push({ label: "Facebook", href: site.social.facebook, icon: Facebook });
  }
  return links;
}

export function Footer() {
  const socials = getSocialLinks();
  const { email, address } = site.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg-default border-t border-border-default pt-24 pb-10">
      <div className="container mx-auto px-6">
        {socials.length > 0 && (
          <div className="flex flex-col items-center gap-6 mb-16">
            <p className={ds.textBodySm}>Follow along for the latest looks</p>
            <div className="flex items-center gap-4">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit Shine by Lucy on ${s.label}`}
                    className="p-3 bg-neutral-50 rounded-full text-text-secondary hover:bg-neutral-900 hover:text-text-inverse transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className={`border-t border-border-default ${socials.length > 0 ? "pt-10" : ""} flex flex-col md:flex-row items-center justify-between gap-6`}>
          <Logo className="h-7" />

          <div className="text-center md:text-right space-y-1">
            {address && <p className={ds.textBodySm}>{address}</p>}
            {email && (
              <p className={ds.textBodySm}>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-text-primary transition-colors"
                >
                  {email}
                </a>
              </p>
            )}
            <p className={`${ds.textBodySm} mt-4`}>
              &copy; {year} {site.legalName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
