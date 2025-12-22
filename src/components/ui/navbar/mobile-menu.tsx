"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { languages } from "@/app/i18n/settings";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenSearch: () => void;
    lng: string;
    navLinks: Array<{ href: string; label: string }>;
    cartItemCount: number;
}

export function MobileMenu({
    isOpen,
    onClose,
    onOpenSearch,
    lng,
    navLinks,
    cartItemCount,
}: MobileMenuProps) {
    const router = useRouter();
    const pathname = usePathname();

    if (!isOpen) return null;

    return (
        <div className="absolute top-full right-0 mt-4 w-72 bg-zinc-900/95 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 backdrop-blur-xl md:hidden shadow-2xl">
            {/* Mobile Search */}
            <button
                onClick={() => {
                    onClose();
                    onOpenSearch();
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
                        onClick={() => onClose()}
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
                                onClose();
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
                onClick={() => onClose()}
            >
                {cartItemCount > 0 ? `Get Quote (${cartItemCount})` : "Request Quote"}
            </Link>
        </div>
    );
}
