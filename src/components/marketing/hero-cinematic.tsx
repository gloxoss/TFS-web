"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Play, ArrowUpRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface HeroCinematicProps {
    title: string;
    subtitle: string;
    images: string[];
    badge?: string;
    primaryAction: { label: string; href: string };
    secondaryAction?: { label: string; href: string; icon?: React.ElementType };
    mission?: { title: string; text: string; href: string };
    megaText?: string;
    className?: string;
    slideInterval?: number; // ms
}

export default function HeroCinematic({
    title,
    subtitle,
    images = [],
    badge,
    primaryAction,
    secondaryAction,
    mission,
    megaText = "CINEMA",
    className,
    slideInterval = 5000
}: HeroCinematicProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll Effect for Zoom
    const { scrollY } = useScroll();
    const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);
    const opacity = useTransform(scrollY, [0, 800], [1, 0.5]);

    // Slideshow Logic
    useEffect(() => {
        if (images.length <= 1) return;
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, slideInterval);

        return () => clearInterval(interval);
    }, [images.length, isHovered, slideInterval]);

    return (
        <div
            ref={containerRef}
            className={cn("relative h-screen min-h-[800px] w-full overflow-hidden bg-black", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {/* 1. Background Layer (Slideshow + Zoom) */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentImageIndex}
                    className="absolute inset-0 h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    <motion.img
                        style={{ scale: scale, opacity: opacity }}
                        src={images[currentImageIndex]}
                        alt={`Hero Background ${currentImageIndex + 1}`}
                        className="h-full w-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradients for depth and readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent bg-opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            {/* 2. Mega Text Layer (TES Style) */}
            {/* User Logic: Gradient from bottom black to transparent on top BEHIND the text */}
            <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />

            <div
                className="absolute bottom-[-2vh] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden z-0"
                aria-hidden="true"
            >
                <span className="text-[23vw] font-black leading-none tracking-tighter text-white/20 mix-blend-difference whitespace-nowrap blur-sm">
                    {megaText}
                </span>
            </div>

            {/* 3. Main Content Layer */}
            {/* User Logic: "up a little bit" -> padding-bottom or justify-start with top margin */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center pb-32">

                <div className="max-w-2xl">
                    {badge && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/30 backdrop-blur-md mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                            {badge}
                        </motion.div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6 font-display"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-lg"
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-wrap items-center gap-6"
                    >
                        <Link
                            href={primaryAction.href}
                            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-gray-200 hover:scale-105 active:scale-95"
                        >
                            <span className="mr-2">{primaryAction.label}</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        {secondaryAction && (
                            <Link
                                href={secondaryAction.href}
                                className="group flex items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-indigo-400"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all group-hover:bg-indigo-500 group-hover:ring-indigo-500">
                                    {secondaryAction.icon ? <secondaryAction.icon className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                                </div>
                                {secondaryAction.label}
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* 4. Glassmorphic Mission Card (Farmora Style) - Bottom Right */}
            {mission && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-32 right-6 lg:right-12 max-w-xs md:max-w-sm rounded-2xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-2xl transition-transform hover:scale-[1.02]"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider opacity-80">{mission.title}</h3>
                        <ArrowUpRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                        {mission.text}
                    </p>
                    <Link href={mission.href} className="text-xs font-medium text-white hover:text-indigo-400 transition-colors flex items-center gap-1">
                        Learn more <ArrowRight className="h-3 w-3" />
                    </Link>

                    {/* Pagination Dots */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={cn("h-1 rounded-full transition-all duration-300",
                                    idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Decorative Gradients/Orbs */}
            <div
                className="absolute top-1/4 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]"
                aria-hidden="true"
            />
        </div>
    )
}
