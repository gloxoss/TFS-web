"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, Search, ArrowRight, Camera, Lightbulb, Film, Mic2, TrendingUp, Globe, Check } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "@/app/i18n/client";
import { ClientWrapper } from "./client-wrapper";
import { cn } from "@/lib/utils";
import { useCartStore, useUIStore } from "@/stores";
import { motion, AnimatePresence } from "framer-motion";
import { languages } from "@/app/i18n/settings";

// Language labels for display
const languageLabels: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  ru: "Русский",
};

// Search suggestions now imported from site-content.ts
import { searchConfig } from "@/data/site-content";

// Map icon components to search categories
const categoryIcons = {
  camera: Camera,
  lens: Film,
  lighting: Lightbulb,
  audio: Mic2,
};

export function Navbar({ lng }: { lng: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(lng, 'common');

  // Cart state
  const cartItems = useCartStore((state) => state.items);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation links focused on rental business
  const navLinks = [
    { href: "/equipment", label: t("nav.equipment") || "Equipment" },
    { href: "/about", label: t("nav.about") || "About" },
    { href: "/contact", label: t("nav.contact") || "Contact" },
  ];

  // Focus search input when dialog opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Handle search submission
  const handleSearch = useCallback((query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      router.push(`/${lng}/equipment?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, [lng, router, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Filter suggestions based on query
  const filteredPopular = searchQuery
    ? searchConfig.popular.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : searchConfig.popular;

  return (
    <ClientWrapper>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1440px] px-6 md:px-12 flex items-center justify-between">

        {/* Logo */}
        <Link href={`/${lng}`} className="flex items-center gap-1 group">
          <span className="text-2xl font-display font-bold tracking-tighter text-white mix-blend-difference">
            TFS<span className="text-red-600">.</span>
          </span>
        </Link>

        {/* Center Pill Nav - The "Island" */}
        <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5 shadow-2xl">
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
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{lng}</span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 min-w-[140px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 shadow-2xl"
                  >
                    {languages.map((language) => (
                      <button
                        key={language}
                        onClick={() => {
                          const currentPath = window.location.pathname;
                          const newPath = currentPath === '/' || currentPath === `/${lng}` || currentPath === `/${lng}/`
                            ? `/${language}`
                            : currentPath.replace(`/${lng}/`, `/${language}/`);
                          router.push(newPath);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          lng === language
                            ? "bg-white/10 text-white"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <span>{languageLabels[language] || language.toUpperCase()}</span>
                        {lng === language && <Check className="w-4 h-4 text-green-400" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-white bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-4 w-72 bg-zinc-900/95 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 backdrop-blur-xl md:hidden shadow-2xl">
            {/* Mobile Search */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-zinc-400 hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search equipment...</span>
            </button>

            {/* Nav Links */}
            {navLinks.map(link => {
              const isActive = pathname === `/${lng}${link.href}` || pathname.startsWith(`/${lng}${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={`/${lng}${link.href}`}
                  className={cn(
                    "p-3 rounded-xl font-medium transition-colors",
                    isActive
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/10"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="h-px bg-white/10 my-2" />

            {/* Language Selector - Mobile */}
            <div className="flex items-center gap-2 p-2">
              <Globe className="w-4 h-4 text-zinc-400" />
              <div className="flex flex-wrap gap-1.5">
                {languages.map((language) => (
                  <button
                    key={language}
                    onClick={() => {
                      const currentPath = window.location.pathname;
                      const newPath = currentPath === '/' || currentPath === `/${lng}` || currentPath === `/${lng}/`
                        ? `/${language}`
                        : currentPath.replace(`/${lng}/`, `/${language}/`);
                      router.push(newPath);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors uppercase",
                      lng === language
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    )}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/10 my-2" />

            {/* Request Quote - Mobile CTA */}
            <Link
              href={`/${lng}/quote`}
              className={cn(
                "p-3 rounded-xl font-semibold text-center transition-colors",
                cartItemCount > 0
                  ? "bg-white text-black"
                  : "bg-red-600 text-white hover:bg-red-700"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {cartItemCount > 0 ? `Get Quote (${cartItemCount})` : "Request Quote"}
            </Link>
          </div>
        )}
      </nav>

      {/* Full-screen Search Dialog */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
            />

            {/* Search Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[10%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl px-4"
            >
              <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex items-center gap-4 p-6 border-b border-white/5">
                    <Search className="w-6 h-6 text-zinc-400 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cameras, lenses, lighting, audio..."
                      className="flex-1 bg-transparent text-white text-xl placeholder:text-zinc-500 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Suggestions Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {/* Category Quick Links */}
                  <div className="mb-8">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                      Browse Categories
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {searchConfig.categories.map((cat) => {
                        const IconComponent = categoryIcons[cat.key as keyof typeof categoryIcons];
                        return (
                          <button
                            key={cat.query}
                            onClick={() => handleSearch(cat.query)}
                            className="group flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                          >
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-white">{cat.label.en}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Popular / Filtered Searches */}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {searchQuery ? "Suggestions" : "Popular Searches"}
                    </h3>
                    {filteredPopular.length > 0 ? (
                      <div className="space-y-1">
                        {filteredPopular.map((item) => (
                          <button
                            key={item}
                            onClick={() => handleSearch(item)}
                            className="w-full flex items-center justify-between p-3 text-left text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <Search className="w-4 h-4 text-zinc-500" />
                              <span>{item}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-sm py-4 text-center">
                        No suggestions found. Press Enter to search.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-black/20">
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400 font-mono">↵</kbd>
                      to search
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-2 py-1 bg-zinc-800 rounded text-zinc-400 font-mono">esc</kbd>
                      to close
                    </span>
                  </div>
                  <button
                    onClick={() => handleSearch()}
                    disabled={!searchQuery.trim()}
                    className="px-5 py-2 bg-white text-black rounded-full text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ClientWrapper>
  );
}
