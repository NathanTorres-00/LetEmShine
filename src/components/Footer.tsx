import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ds } from "../design-system/classes";
import { Logo } from "./Logo";

export function Footer() {
  const handleSubscribe = () => {
    toast.success("Subscribed!", {
      description: "Thank you for joining our newsletter.",
    });
  };

  return (
    <footer className="bg-bg-default border-t border-border-default pt-24 pb-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          
          {/* Socials */}
          <div className="flex items-center gap-6">
            <a href="#" className="p-3 bg-neutral-50 rounded-full hover:bg-neutral-900 hover:text-text-inverse transition-colors text-text-secondary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="p-3 bg-slate-50 rounded-full hover:bg-pink-50 hover:text-pink-500 transition-colors text-slate-500">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="p-3 bg-slate-50 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors text-slate-500">
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-right">
            <p className={`${ds.textBodySm} mb-4`}>Follow us on social media for the latest updates and special offers!</p>
            <div className="flex gap-2 max-w-sm mx-auto md:ml-auto">
              <Input placeholder="Your Email" className={ds.inputField} />
              <Button className={ds.btnPrimary} onClick={handleSubscribe}>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border-default pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo className="h-7" />

          <div className="text-center md:text-right space-y-1">
            <p>123 Smile St, Bright City</p>
            <p>contact@letemshine.com</p>
            <p className="mt-4">© 2024 Let 'Em Shine. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
