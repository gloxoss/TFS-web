"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { homePage, t } from "@/data/site-content";

// TFS Cinema Rental Hero Images - Local optimized images
const HERO_IMAGES = [
    "/images/hero/localize-uu-YGo9YVDw-unsplash-1-scaled.webp", // Already optimized webp
    "/images/hero/20221115_124804.jpg", // Cinema gear shot
    "/images/hero/xrabat-wall-sl.jpg.pagespeed.ic.16lhC1-Jv2.jpg", // Rabat wall shot
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

const fadeInBlur = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8 }
    }
};

interface HeroImpactProps {
    lng?: string;
}

export default function HeroImpact({ lng = 'en' }: HeroImpactProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { scrollY } = useScroll();

    const content = homePage.heroImpact;

    // Velocity-Based Blur (Disabled for performance/TBT)
    // const scrollVelocity = useVelocity(scrollY);
    // const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    // const blurPx = useTransform(smoothVelocity, (latest) => `blur(${Math.min(Math.abs(latest / 50), 8)}px)`);
    const blurPx = "blur(0px)";

    // Parallax Position
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
            {text}
        </span>
    );

    return (
        <div ref={containerRef} className="relative h-[80vh] min-h-[600px] sm:min-h-[700px] lg:h-screen lg:min-h-[1100px] w-full isolation-isolate overflow-hidden font-sans selection:bg-red-600 selection:text-white">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div style={{ scale }} className="absolute inset-0">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={currentSlide}
                            className="absolute inset-0"
                            initial={currentSlide === 0 ? { opacity: 1 } : { opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                        >
                            <Image
                                src={HERO_IMAGES[currentSlide]}
                                alt="Cinema production set"
                                fill
                                priority={currentSlide === 0}
                                loading="eager"
                                className="object-cover"
                                sizes="100vw"
                                quality={90}
                                {...(currentSlide === 0 ? { fetchPriority: "high" } : {})}
                            />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute bottom-0 left-0 w-full h-[70%] z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[50%] z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[30%] z-10 bg-gradient-to-t from-black via-black/0 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[50%] h-full z-10 bg-gradient-to-l from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-20 h-full w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-32 flex justify-end items-start">
                <div className="flex flex-col items-end text-right max-w-xl">
                    {/* Headline */}
                    <h2 className="text-6xl md:text-8xl font-display font-bold text-white uppercase leading-[0.85] tracking-tight mb-6">
                        <div className="block"><AnimatedText text={t(content.headline.line1, lng)} delayOffset={0.2} /></div>
                        <div className="block text-white/70"><AnimatedText text={t(content.headline.line2, lng)} delayOffset={0.5} /></div>
                    </h2>

                    {/* Description */}
                    <motion.p
                        initial="hidden" animate="visible" variants={fadeInBlur} transition={{ delay: 0.8 }}
                        className="text-gray-300 text-lg leading-relaxed mb-8 max-w-sm"
                    >
                        {t(content.description, lng)}
                    </motion.p>

                    {/* Button */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInBlur} transition={{ delay: 1.1 }}>
                        <Link
                            href={`/${lng}${content.cta.href}`}
                            className="group flex items-center gap-3 bg-[#D00000] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide transition-all hover:bg-[#A00000] hover:scale-105"
                        >
                            {t(content.cta.text, lng)}
                            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* MEGA TEXT (Bottom Split) */}
            <div className="absolute -bottom-0 left-0 w-full z-50 flex flex-col items-center justify-end pointer-events-none select-none mix-blend-difference text-white">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-display font-bold text-[15vw] leading-[0.85] text-center tracking-tight uppercase"
                    style={{ x: xLeft, filter: blurPx }}
                >
                    {t(content.megaText.line1, lng)}
                </motion.h1>

                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-display font-bold text-[15vw] leading-[0.75] text-center tracking-tight uppercase mt-[1vw]"
                    style={{ x: xRight, filter: blurPx }}
                >
                    {t(content.megaText.line2, lng)}
                </motion.h1>
            </div>

        </div>
    )
}
