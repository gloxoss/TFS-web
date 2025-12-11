"use client";

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../pocketbase-provider";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClientWrapper } from "./client-wrapper";
import { cn } from "@/lib/utils";
import { useCartStore, useUIStore } from "@/stores";

export function Navbar({ lng }: { lng: string }) {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Cart state
  const cartItems = useCartStore((state) => state.items);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/about", label: "nav.about" },
    { href: "/equipment", label: "Equipment" },
    { href: "/dashboard", label: "Dashboard" }
  ];

  const handleLogout = async () => {
    const result = await logout();
    if (result?.redirect) router.push(`/${lng}${result.redirect}`);
  };

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
            const isActive = pathname === `/${lng}${link.href}`;
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
                {link.label === "nav.about" ? t(link.label) : link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={openCartDrawer}
            className="relative p-2 text-white/80 hover:text-white transition-colors"
            aria-label={`Cart with ${cartItemCount} items`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm font-medium text-white">{user.name}</span>
              <button onClick={handleLogout} className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href={`/${lng}/login`}
                className="hidden md:block text-sm font-medium text-white hover:text-gray-300 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={`/${lng}/register`}
                className="hidden md:block px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium text-white hover:bg-white hover:text-black transition-all"
              >
                Sign Up Free
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white bg-black/50 rounded-full backdrop-blur-md"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-4 w-64 bg-black/95 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 backdrop-blur-xl md:hidden">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={`/${lng}${link.href}`}
                className="text-white p-3 hover:bg-white/10 rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label === "nav.about" ? t(link.label) : link.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-1" />
            <Link href={`/${lng}/login`} className="text-white p-3 hover:bg-white/10 rounded-xl">Sign In</Link>
          </div>
        )}
      </nav>
    </ClientWrapper>
  );
}
