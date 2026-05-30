import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { ds } from "../design-system/classes";

const HEADER_HEIGHT = 72;
const HERO_SCROLL_THRESHOLD = 640;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 16);
      setOnHero(y < HERO_SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "The Session", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const heroNav = onHero && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        heroNav
          ? ds.glassNavDark
          : isScrolled
            ? "bg-bg-default/90 backdrop-blur-md border-b border-border-default shadow-sm"
            : "bg-transparent"
      }`}
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="container mx-auto h-full max-w-6xl px-6 flex items-center justify-between gap-6">
        <a
          href="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="flex shrink-0 items-center py-1 -ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm"
          aria-label="Shine by Lucy — Home"
        >
          {heroNav ? (
            <span
              className={`${ds.displayScript} text-[1.75rem] leading-none text-white`}
            >
              Shine
            </span>
          ) : (
            <Logo className="h-[30px] md:h-8" />
          )}
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-sans transition-colors ${
                heroNav
                  ? "text-white/75 hover:text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {link.name}
            </a>
          ))}
          <Button
            className={
              heroNav
                ? "h-9 px-5 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-sans text-sm shadow-none"
                : `${ds.btnPrimary} px-6 h-9 shrink-0`
            }
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Book Now
          </Button>
        </nav>

        <button
          type="button"
          className={`md:hidden p-2 -mr-2 ${heroNav ? "text-white" : "text-text-primary"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className={`md:hidden absolute top-full left-6 right-6 mt-3 ${ds.cardElevated} p-6 flex flex-col gap-4`}
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-base font-sans text-text-secondary py-1"
            >
              {link.name}
            </a>
          ))}
          <Button
            className={`w-full ${ds.btnPrimary} mt-2`}
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Book Now
          </Button>
        </div>
      )}
    </header>
  );
}

export const siteHeaderHeight = HEADER_HEIGHT;
