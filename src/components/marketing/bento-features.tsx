"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface BentoItem {
    title: string;
    description: string;
    icon?: LucideIcon;
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
        <div className="bg-white py-24 sm:py-32 dark:bg-black">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {(title || subtitle) && (
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        {title && <h2 className="text-base font-semibold leading-7 text-indigo-600 font-mono tracking-wide uppercase">{title}</h2>}
                        {subtitle && <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-display dark:text-white">{subtitle}</p>}
                        {description && <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">{description}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 transition-all hover:scale-[1.01]",
                                item.theme === 'dark' ? 'bg-gray-900 text-white' :
                                    item.theme === 'image' ? 'text-white' : 'bg-gray-50 text-gray-900 ring-1 ring-gray-900/5 dark:bg-gray-900 dark:text-white dark:ring-white/10',
                                item.className
                            )}
                        >
                            {/* Background Image handling */}
                            {item.theme === 'image' && item.image && (
                                <>
                                    <Image src={item.image} alt="" fill className="object-cover -z-10" />
                                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900/80 to-transparent" />
                                </>
                            )}

                            {/* Icon & Stat */}
                            <div className="flex items-center justify-between mb-4">
                                {item.icon && (
                                    <div className={cn(
                                        "rounded-lg p-2.5",
                                        item.theme === 'dark' || item.theme === 'image' ? 'bg-white/10 text-white' : 'bg-indigo-600 text-white'
                                    )}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                )}
                                {item.stat && (
                                    <div className="text-3xl font-bold font-display tracking-tight">{item.stat}</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold leading-8">{item.title}</h3>
                                <p className={cn("mt-2 text-sm leading-6",
                                    item.theme === 'dark' || item.theme === 'image' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                                )}>
                                    {item.description}
                                </p>

                                {item.href && (
                                    <div className="mt-6">
                                        <Link href={item.href} className={cn("text-sm font-semibold leading-6 flex items-center gap-1",
                                            item.theme === 'dark' || item.theme === 'image' ? 'text-white' : 'text-indigo-600 hover:text-indigo-500'
                                        )}>
                                            Learn more <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Decorative Image for standard cards */}
                            {item.image && item.theme !== 'image' && (
                                <div className="mt-8 relative h-48 w-full overflow-hidden rounded-xl bg-gray-900/5 shadow-lg">
                                    <Image src={item.image} alt="" fill className="object-cover" />
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
