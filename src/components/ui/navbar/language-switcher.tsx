"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { languages } from "@/app/i18n/settings";

// Language labels for display
const languageLabels: Record<string, string> = {
    en: "English",
    fr: "Français",
    es: "Español",
    de: "Deutsch",
    ru: "Русский",
};

interface LanguageSwitcherProps {
    lng: string;
}

export function LanguageSwitcher({ lng }: LanguageSwitcherProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative hidden md:block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{lng}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close dropdown */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
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
                                        setIsOpen(false);
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
    );
}
