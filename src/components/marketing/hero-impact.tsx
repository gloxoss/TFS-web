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
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }
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
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityBlur = useTransform(smoothVelocity, [0, 1000], [0, 10]);
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
        /* 
          ══════════════════════════════════════════════════════════════════
          RESPONSIVE HEIGHT SETTINGS:
          - Mobile:  h-[80vh] min-h-[600px] (shorter on small screens)
          - Tablet:  sm:min-h-[700px] 
          - Desktop: lg:min-h-[1100px] lg:h-screen
          
          To adjust: Change the values in square brackets. Smaller number = shorter height.
          ══════════════════════════════════════════════════════════════════
        */
        <div ref={containerRef} className="relative h-[80vh] min-h-[600px] sm:min-h-[700px] lg:h-screen lg:min-h-[1100px] w-full isolation-isolate overflow-hidden font-sans selection:bg-red-600 selection:text-white">

            {/* 1. Background Slideshow + Scroll Zoom */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div style={{ scale }} className="absolute inset-0">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentSlide}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${HERO_IMAGES[currentSlide]})` }}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                        />
                    </AnimatePresence>
                </motion.div>
            </div >

            {/* 2. Gradient Overlays */}
            {/* INSPIRATION: Cinematic Multi-Layer Gradients (Purple/Blue/Black) */}
            {/* Note: Keeping opacity low to allow mix-blend-difference on text to work (needs bright background) */}

            {/* Layer 1: Strong Bottom Fade (70% height) - Main darkened area */}
            <div className="absolute bottom-0 left-0 w-full h-[70%] z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Layer 2: Deep Base (50% height) - Adds density */}
            <div className="absolute bottom-0 left-0 w-full h-[50%] z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Layer 3: Grounding (Bottom 30%) */}
            <div className="absolute bottom-0 left-0 w-full h-[30%] z-10 bg-gradient-to-t from-black via-black/0 to-transparent pointer-events-none" />

            {/* Top Gradient: Protects the 'Building Visuals' text from bright backgrounds */}
            <div className="absolute top-0 right-0 w-[50%] h-full z-10 bg-gradient-to-l from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

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
            {/* z-50 to ensure it sits above gradients. mix-blend-difference applied to CONTAINER. */}
            {/*
              ══════════════════════════════════════════════════════════════════
              MEGA TEXT SIZE SETTINGS:
              - Mobile:  text-[22vw] (bigger text for small screens)
              - Desktop: md:text-[15vw] (normal size for larger screens)
              
              To adjust: Change the vw values. Larger number = bigger text.
              Examples: text-[20vw], text-[25vw], text-[18vw]
              ══════════════════════════════════════════════════════════════════
            */}
            <div className="absolute -bottom-0 left-0 w-full z-50 flex flex-col items-center justify-end pointer-events-none select-none mix-blend-difference text-white">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-display font-bold text-[15vw] leading-[0.85] text-center tracking-tight uppercase"
                    style={{ x: xLeft, filter: blurPx }}
                >
                    TV - FILM
                </motion.h1>

                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-display font-bold text-[15vw] leading-[0.75] text-center tracking-tight uppercase mt-[1vw]"
                    style={{ x: xRight, filter: blurPx }}
                >
                    SOLUTIONS
                </motion.h1>
            </div>

        </div >
    )
}
