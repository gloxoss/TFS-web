"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SLIDES = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070",
        alt: "Studio lights set",
        title: "Craft Your Light."
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1533560906634-887cd79560b3?q=80&w=2070&auto=format&fit=crop",
        alt: "Cinema camera dark",
        title: "Capture the Unseen."
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2910&auto=format&fit=crop",
        alt: "On set production",
        title: "Tell Your Story."
    }
];

const translations = {
    en: {
        rentals: 'Premium Rentals',
        catalog: 'View Catalog',
        showreel: 'Showreel',
        subtext: "Access the world's finest cinema equipment. From ARRI to Zeiss, delivered to your set.",
        scroll: 'Scroll'
    },
    fr: {
        rentals: 'Locations Premium',
        catalog: 'Voir le Catalogue',
        showreel: 'Démonstration',
        subtext: "Accédez aux meilleurs équipements de cinéma au monde. D'ARRI à Zeiss, livrés sur votre plateau.",
        scroll: 'Faire défiler'
    }
}

export default function HeroCinemaV2({ lng = 'en' }: { lng?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const t = translations[lng as keyof typeof translations] || translations.en;

    // Parallax & Fade on Scroll
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 800], [1, 0]);
    const yText = useTransform(scrollY, [0, 800], [0, 300]);

    // Auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-screen min-h-[800px] w-full overflow-hidden bg-[#050505] text-[#F5F5F4]"
        >
            {/* 1. Background Slideshow (Ken Burns Effect) */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={SLIDES[currentSlide].id}
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${SLIDES[currentSlide].url})` }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* 2. Overlays: Cinematic Vignette */}
            {/* Top gradient for nav visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
            {/* Bottom gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

            {/* 3. Content Group */}
            <motion.div
                style={{ opacity, y: yText }}
                className="relative z-20 h-full flex flex-col justify-end pb-32 px-6 md:px-12 max-w-[1440px] mx-auto"
            >
                {/* 3.1 Meta Data (Upper Left of Text Block) */}
                <div className="flex items-center space-x-4 mb-6 overflow-hidden">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex items-center gap-2"
                    >
                        <span className="h-[1px] w-8 bg-indigo-500/80"></span>
                        <span className="text-xs font-mono tracking-[0.2em] text-gray-400 uppercase">
                            {t.rentals}
                        </span>
                    </motion.div>
                </div>

                {/* 3.2 Headline: Staggered Reveal */}
                <div className="overflow-hidden mb-6">
                    <motion.h1
                        key={currentSlide} // Animate text entrance on slide change too? Or keep static? Let's animate entrance once.
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Apple-esque ease
                        className="font-display font-medium text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mix-blend-overlay text-white/90"
                    >
                        {SLIDES[currentSlide].title}
                    </motion.h1>
                </div>

                {/* 3.3 Subtext & Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-white/10 pt-8 mt-2">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="max-w-md text-lg md:text-xl font-light text-gray-300 leading-relaxed font-sans"
                    >
                        {t.subtext}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex gap-6"
                    >
                        <Link
                            href={`/${lng}/equipment`}
                            className="group relative inline-flex h-12 items-center justify-center overflow-hidden bg-white px-8 font-medium text-black transition-all hover:bg-gray-200"
                        >
                            <span className="font-sans text-sm tracking-widest uppercase">{t.catalog}</span>
                        </Link>

                        <button className="group flex items-center gap-3 text-sm tracking-widest uppercase text-white hover:text-indigo-400 transition-colors">
                            <span className="flex h-10 w-10 items-center justify-center border border-white/20 rounded-full group-hover:border-indigo-400 transition-colors">
                                <Play className="h-3 w-3 fill-current" />
                            </span>
                            {t.showreel}
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* 4. Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/30"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="text-[10px] uppercase tracking-[0.2em]">{t.scroll}</span>
                <ArrowDown className="h-4 w-4" />
            </motion.div>
        </section>
    );
}
