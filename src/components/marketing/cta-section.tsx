"use client";

import { motion } from "framer-motion";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";

interface CTASectionProps {
    title: string;
    subtitle: string;
    buttonText: string;
    href?: string;
}

export default function CTASection({ title, subtitle, buttonText, href = "/quote" }: CTASectionProps) {
    return (
        <div className="py-24 px-6 md:px-8 bg-black relative overflow-hidden">
            {/* Background Decoration: Blue Gradient (Outer Section Atmosphere) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>

            {/* Inner Box with Original Aurora Style */}
            <div className="max-w-7xl mx-auto rounded-[32px] overflow-hidden relative border border-white/10 group z-10">
                <AuroraBackground className="min-h-[500px] h-full py-0">
                    <motion.div
                        initial={{ opacity: 0.0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.3,
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                        className="relative flex flex-col gap-4 items-center justify-center px-4 max-w-4xl mx-auto text-center z-10"
                    >
                        <h2 className="text-4xl md:text-7xl font-bold font-display uppercase tracking-tight text-slate-950 dark:text-white text-center leading-[0.9] drop-shadow-xl">
                            {title}
                        </h2>
                        <p className="font-light text-lg md:text-xl text-slate-900 dark:text-neutral-200 py-4 max-w-xl">
                            {subtitle}
                        </p>
                        <Link
                            href={href}
                            className="bg-black dark:bg-[#D00000] hover:scale-105 transition-transform duration-300 rounded-full w-fit text-white px-8 py-4 font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-900/20"
                        >
                            {buttonText}
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </AuroraBackground>
            </div>
        </div>
    );
}
