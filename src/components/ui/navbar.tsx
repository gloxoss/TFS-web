"use client";

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../pocketbase-provider";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ClientWrapper } from "./client-wrapper";
import { cn } from "@/lib/utils";

export function Navbar({ lng }: { lng: string }) {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  // Check if we are on the Home V1R page or Root page (if migrated)
  const isImmersivePage = pathname === `/${lng}/home-v1r` || pathname === `/${lng}`;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result?.redirect) {
      router.push(`/${lng}${result.redirect}`);
    }
  };

  const isActive = (path: string) => {
    return pathname === `/${lng}${path}`;
  };

  // Styles based on state
  const navBackground = isImmersivePage
    ? (scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent")
    : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800";

  const textColor = isImmersivePage && !scrolled
    ? "text-white hover:text-white/80"
    : "text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400";

  const logoColor = isImmersivePage && !scrolled
    ? "text-white"
    : "text-indigo-600 dark:text-indigo-400";

  return (
    <ClientWrapper>
      <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", navBackground)}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href={`/${lng}`}
                className={cn("text-2xl font-bold font-display tracking-tight transition-colors", logoColor)}
              >
                Horizon
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href={`/${lng}/about`} className={cn("text-sm font-medium transition-colors", textColor)}>
                  {t("nav.about")}
                </Link>
                <Link href={`/${lng}/catalog`} className={cn("text-sm font-medium transition-colors", textColor)}>
                  Catalog
                </Link>
                <Link href={`/${lng}/dashboard`} className={cn("text-sm font-medium transition-colors", textColor)}>
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher lng={lng} />
              <ThemeToggle />

              {user ? (
                <div className="flex items-center gap-3 ml-4">
                  <Link href={`/${lng}/dashboard`} className={cn("text-sm font-medium", textColor)}>
                    {user.name || "User"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t("nav.logout")}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-4">
                  <Link href={`/${lng}/login`} className={cn("text-sm font-medium", textColor)}>
                    {t("nav.login")}
                  </Link>
                  <Link
                    href={`/${lng}/register`}
                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                className={cn("inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus:outline-none", textColor)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn("md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800", isMenuOpen ? "block" : "hidden")}>
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link href={`/${lng}/about`} className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
              {t("nav.about")}
            </Link>
            <Link href={`/${lng}/catalog`} className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
              Catalog
            </Link>
            {user ? (
              <>
                <Link href={`/${lng}/dashboard`} className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${lng}/login`} className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                  {t("nav.login")}
                </Link>
                <Link href={`/${lng}/register`} className="block rounded-md px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </ClientWrapper>
  );
}
