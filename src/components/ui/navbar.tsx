"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Search, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { ClientWrapper } from "./client-wrapper";
import { cn } from "@/lib/utils";
import { useCartStore, useUIStore } from "@/stores";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

// Sub-components
import { SearchDialog } from "./navbar/search-dialog";
import { MobileMenu } from "./navbar/mobile-menu";
import { LanguageSwitcher } from "./navbar/language-switcher";
import { ServicesMegaMenu } from "./navbar/services-mega-menu";

export function Navbar({ lng }: { lng: string }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useTranslation(lng, 'common');
  const { company } = useSiteSettings();

  // Cart state
  const cartItems = useCartStore((state) => state.items);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation links (excluding Services which is a dropdown)
  const navLinks = [
    { href: "/about", label: t("nav.about") || "About" },
    { href: "/contact", label: t("nav.contact") || "Contact" },
  ];

  return (
    <ClientWrapper>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1440px] px-6 md:px-12 flex items-center justify-between">

        {/* Logo */}
        <Link href={`/${lng}`} className="flex items-center gap-1 group">
          <div className="relative h-10 w-32">
            <Image
              src="/images/tfs couleur-noir (1).png"
              alt={company.name}
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Center Pill Nav - The "Island" */}
        <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5 shadow-2xl">
          {/* Services Mega Menu */}
          <ServicesMegaMenu
            lng={lng}
            label={t("nav.services") || "Services"}
          />

          {/* Other nav links */}
          {navLinks.map((link) => {
            const isActive = pathname === `/${lng}${link.href}` || pathname.startsWith(`/${lng}${link.href}/`);
            return (
              <Link
                key={link.href}
                href={`/${lng}${link.href}`}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors font-sans",
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Search equipment"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher lng={lng} />

          {/* Cart Button */}
          <button
            onClick={openCartDrawer}
            className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label={`Cart with ${cartItemCount} items`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>

          {/* Request Quote CTA - Main action */}
          <Link
            href={`/${lng}/quote`}
            className={cn(
              "hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
              cartItemCount > 0
                ? "bg-white text-black hover:bg-gray-100"
                : "border border-white/20 text-white hover:bg-white hover:text-black"
            )}
          >
            {t("nav.requestQuote") || "Request Quote"}
          </Link>

          {/* IMDB Button */}
          <a
            href="https://www.imdb.com/company/co0891334"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold bg-[#F5C518] text-black hover:bg-[#E0B015] transition-all"
          >
            IMDB
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-white bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpenSearch={() => setIsSearchOpen(true)}
          lng={lng}
          navLinks={navLinks}
          cartItemCount={cartItemCount}
        />
      </nav>

      {/* Full-screen Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lng={lng}
      />
    </ClientWrapper>
  );
}
