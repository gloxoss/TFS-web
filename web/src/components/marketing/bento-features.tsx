"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { CometCard } from "@/components/ui/comet-card";

export interface BentoItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
    className?: string; // For adding specific col-spans (e.g., md:col-span-2)
    theme?: 'dark' | 'light' | 'image';
    href?: string;
    stat?: string;
}

interface BentoFeaturesProps {
    title?: string;
    subtitle?: string;
    description?: string;
    items: BentoItem[];
}

export default function BentoFeatures({ title, subtitle, description, items }: BentoFeaturesProps) {
    return (
        <div className="bg-black py-24 sm:py-32 relative overflow-hidden">
            {/* Background Atmosphere - Red Gradient Style */}
            {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[500px] bg-[#D00000]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Secondary Accent Glow (Bottom Right) */}
            <div className="absolute bottom-0 right-[-20%] w-[600px] h-[600px] bg-[#D00000]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay"></div>


            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                {(title || subtitle) && (
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        {title && <h2 className="text-sm font-bold tracking-widest text-[#D00000] font-mono uppercase mb-3">{title}</h2>}
                        {subtitle && <p className="text-4xl font-bold tracking-tighter text-white sm:text-6xl font-display uppercase leading-[0.9]">{subtitle}</p>}
                        {description && <p className="mt-6 text-xl leading-relaxed text-zinc-400 font-light max-w-lg mx-auto">{description}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {items.map((item, idx) => (
                        <CometCard key={idx} className={cn("h-full", item.className)}>
                            <div
                                className={cn(
                                    "group relative flex flex-col justify-between h-full overflow-hidden border border-white/10 bg-zinc-950/50 backdrop-blur-sm p-8 transition-colors duration-500 hover:bg-zinc-900 rounded-2xl",
                                )}
                            >
                                {/* Background Image handling for Image Cards */}
                                {item.theme === 'image' && item.image && (
                                    <>
                                        <Image
                                            src={item.image}
                                            alt=""
                                            fill
                                            className="object-cover -z-10 transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    </>
                                )}

                                {/* Icon & Stat */}
                                <div className="flex items-center justify-between mb-8">
                                    {item.icon && (
                                        <div className={cn(
                                            "p-0 transition-colors duration-300",
                                            "text-white group-hover:text-[#D00000] [&>svg]:h-8 [&>svg]:w-8 [&>svg]:stroke-[1.5]"
                                        )}>
                                            {item.icon}
                                        </div>
                                    )}
                                    {item.stat && (
                                        <div className="text-4xl font-bold font-display tracking-tighter text-white">{item.stat}</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-2xl font-bold leading-tight font-display uppercase tracking-tight text-white mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-base leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                        {item.description}
                                    </p>

                                    {item.href && (
                                        <div className="mt-8">
                                            <Link href={item.href} className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-white/50 hover:text-[#D00000] transition-colors">
                                                Learn more <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </CometCard>
                    ))}
                </div>
            </div>
        </div>
    )
}
