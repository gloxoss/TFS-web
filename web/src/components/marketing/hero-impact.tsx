"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useVelocity, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=2070", // Crowd/Stage
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2910&auto=format&fit=crop", // Nature Production
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2070", // Studio Light
];

// Word Stagger Animation Variants for Headline
const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

// ... for Description/Button
const fadeInBlur = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8 }
    }
};

export default function HeroImpact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { scrollY } = useScroll();

    // 1. Velocity-Based Blur (Motion Blur)
    // Blur depends on how fast user scrolls, not where they are.
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityBlur = useTransform(smoothVelocity, [0, 1000], [0, 10]);
    // We map 0->1000 velocity to 0->10px blur. 
    // We need to take absolute value because scrolling up (negative velocity) should also blur.
    const blurPx = useTransform(smoothVelocity, (latest) => `blur(${Math.min(Math.abs(latest / 50), 8)}px)`);

    // 2. Parallax Position
    const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);
    const xLeft = useTransform(scrollY, [0, 800], [0, -250]);
    const xRight = useTransform(scrollY, [0, 800], [0, 250]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Helper to split text into word components
    const AnimatedText = ({ text, className, delayOffset = 0 }: { text: string, className?: string, delayOffset?: number }) => (
        <span className={className}>
            {text.split(" ").map((word, i) => (
                <motion.span
                    key={i}
                    variants={wordVariants}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: delayOffset + i * 0.1 }}
                    className="inline-block mr-[0.2em]"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );

    return (
        <div ref={containerRef} className="relative h-screen min-h-[900px] w-full bg-black overflow-hidden font-sans selection:bg-red-600 selection:text-white">

            {/* 1. Background Slideshow + Scroll Zoom */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div style={{ scale }} className="absolute inset-0">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentSlide}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${HERO_IMAGES[currentSlide]})` }}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.6, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                        />
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* 2. Gradient Overlays */}
            {/* Bottom Gradient: Strong but clipped height to allow blend mode on upper text */}
            <div className="absolute bottom-0 left-0 w-full h-[40%] z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* Top Gradient: Re-added for Text Visibility (Top-Right) */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] z-10 bg-gradient-to-bl from-black/80 via-transparent to-transparent pointer-events-none" />


            {/* 4. Main Content - Top Right Alignment */}
            <div className="relative z-20 h-full w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-32 flex justify-end items-start">

                <div className="flex flex-col items-end text-right max-w-xl">
                    {/* Headline */}
                    <h2 className="text-6xl md:text-8xl font-display font-bold text-white uppercase leading-[0.85] tracking-tight mb-6">
                        <div className="block"><AnimatedText text="Building" delayOffset={0.2} /></div>
                        <div className="block text-white/70"><AnimatedText text="Visuals" delayOffset={0.5} /></div>
                    </h2>

                    {/* Description */}
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeInBlur} transition={{ delay: 0.8 }}
                        className="text-gray-300 text-lg leading-relaxed mb-8 max-w-sm"
                    >
                        Launch custom headless e-commerce storefronts with the most advanced gear.
                    </motion.p>

                    {/* Button */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInBlur} transition={{ delay: 1.1 }}>
                        <Link
                            href="/contact"
                            className="group flex items-center gap-3 bg-[#D00000] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide transition-all hover:bg-[#A00000] hover:scale-105"
                        >
                            Let's Talk
                            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                        </Link>
                    </motion.div>
                </div>

            </div>

            {/* 5. MEGA TEXT (Bottom Split) */}
            {/* z-30 ensures it' above the gradient (z-10) for blend mode to work where not black */}
            <div className="absolute -bottom-4 left-0 w-full z-30 flex flex-col items-center justify-end pointer-events-none select-none">
                <motion.h1
                    initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="font-display font-bold text-[15vw] leading-[0.85] text-center text-white mix-blend-difference tracking-tight uppercase"
                    style={{ x: xLeft, filter: blurPx }}
                >
                    TV - FILM
                </motion.h1>

                <motion.h1
                    initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                    className="font-display font-bold text-[15vw] leading-[0.75] text-center text-white mix-blend-difference tracking-tight uppercase mt-[1vw]"
                    style={{ x: xRight, filter: blurPx }}
                >
                    SOLUTIONS
                </motion.h1>
            </div>

        </div>
    )
}
