import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { ds } from "../design-system/classes";

const HEADER_HEIGHT = 72;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-bg-default/90 backdrop-blur-md border-b border-border-default shadow-sm"
          : "bg-transparent"
      }`}
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="container mx-auto h-full max-w-6xl px-6 flex items-center justify-between gap-6">
        <a
          href="#"
          onClick={(e) => handleNavClick(e, "#")}
          className="flex shrink-0 items-center py-1 -ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm"
          aria-label="Shine by Lucy — Home"
        >
          <Logo className="h-[30px] md:h-8" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-sans text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button
            className={`${ds.btnPrimary} px-6 h-9 shrink-0`}
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Book Now
          </Button>
        </nav>

        <button
          type="button"
          className="md:hidden text-text-primary p-2 -mr-2"
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
