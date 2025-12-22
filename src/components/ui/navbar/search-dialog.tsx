"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, TrendingUp, Camera, Film, Lightbulb, Mic2 } from "lucide-react";
import { searchConfig } from "@/data/site-content";

// Map icon components to search categories
const categoryIcons = {
    camera: Camera,
    lens: Film,
    lighting: Lightbulb,
    audio: Mic2,
};

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    lng: string;
}

export function SearchDialog({ isOpen, onClose, lng }: SearchDialogProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus search input when dialog opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close search on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
                setSearchQuery("");
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Handle search submission
    const handleSearch = useCallback((query?: string) => {
        const searchTerm = query || searchQuery;
        if (searchTerm.trim()) {
            router.push(`/${lng}/equipment?search=${encodeURIComponent(searchTerm.trim())}`);
            onClose();
            setSearchQuery("");
        }
    }, [lng, router, searchQuery, onClose]);

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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            onClose();
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
    );
}
