"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

interface CategoryItem {
    id: string;
    title: string;
    image: string;
    href?: string; // Optional link
}

interface CategorySectionProps {
    title: string;
    subtitle: string;
    items: CategoryItem[];
}

export default function CategorySection({ title, subtitle, items }: CategorySectionProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="py-24 bg-black relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-display uppercase tracking-tight text-white mb-4">{title}</h2>
                <p className="text-xl text-zinc-400 font-light">{subtitle}</p>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row gap-4 w-full h-[800px] md:h-[500px]">
                {items.map((item, index) => {
                    const CardContent = (
                        <>
                            {/* Background Image */}
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className={cn(
                                    "object-cover absolute inset-0 z-0 transition-transform duration-700",
                                    hoveredIndex === index ? "scale-110 blur-[1px]" : "grayscale scale-100"
                                )}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className={cn("absolute inset-0 bg-black/40 z-10 transition-opacity duration-500", hoveredIndex === index ? "opacity-60" : "opacity-30")} />

                            {/* Evervault Effect Overlay (Only on hover, disabled on mobile) */}
                            {/* Performance Optimization: Conditional rendering prevents 7500+ char generation on load */}
                            <div className={cn(
                                "absolute inset-0 z-20 pointer-events-none mix-blend-screen hidden md:block", // Hidden on mobile
                                "transition-opacity duration-300",
                                hoveredIndex === index ? "opacity-100" : "opacity-0"
                            )}>
                                {hoveredIndex === index && <EvervaultCard className="w-full h-full" />}
                            </div>

                            {/* Corner Icons (Decorative) */}
                            <Icon className="absolute h-6 w-6 top-3 left-3 text-white/50 z-30" />
                            <Icon className="absolute h-6 w-6 bottom-3 left-3 text-white/50 z-30" />
                            <Icon className="absolute h-6 w-6 top-3 right-3 text-white/50 z-30" />
                            <Icon className="absolute h-6 w-6 bottom-3 right-3 text-white/50 z-30" />


                            {/* Content */}
                            <div className="relative z-30">
                                <motion.h3
                                    layout
                                    className="text-2xl md:text-3xl font-bold font-display uppercase tracking-wider text-white drop-shadow-lg"
                                >
                                    {item.title}
                                </motion.h3>
                            </div>
                        </>
                    );

                    // Wrap in Link if href is provided
                    if (item.href) {
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="contents"
                            >
                                <motion.div
                                    onHoverStart={() => setHoveredIndex(index)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    className={cn(
                                        "relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 group transition-all duration-700 ease-out",
                                        "flex flex-col justify-end p-6",
                                    )}
                                    initial={{ flex: 1 }}
                                    animate={{
                                        flex: hoveredIndex === index ? 3 : 1,
                                    }}
                                >
                                    {CardContent}
                                </motion.div>
                            </Link>
                        );
                    }

                    return (
                        <motion.div
                            key={item.id}
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                            className={cn(
                                "relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 group transition-all duration-700 ease-out",
                                "flex flex-col justify-end p-6",
                            )}
                            initial={{ flex: 1 }}
                            animate={{
                                flex: hoveredIndex === index ? 3 : 1,
                            }}
                        >
                            {CardContent}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
