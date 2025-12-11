"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

interface HeroImmersiveProps {
    title: string;
    subtitle: string;
    imageSrc: string;
    primaryAction: { label: string; href: string };
    secondaryAction?: { label: string; href: string; icon?: React.ElementType };
    className?: string;
}

export default function HeroImmersive({ title, subtitle, imageSrc, primaryAction, secondaryAction, className }: HeroImmersiveProps) {
    return (
        <div className={cn("relative isolate overflow-hidden bg-gray-900 min-h-[85vh] flex items-center", className)}>
            {/* Background Image */}
            <img
                src={imageSrc}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
            />

            {/* Gradient Overlay */}
            <div
                className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent"
                aria-hidden="true"
            />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full pt-20">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <div className="mb-8 inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                        New Collections Available
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
                        {title}
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-gray-300 max-w-xl font-light">
                        {subtitle}
                    </p>

                    <div className="mt-10 flex items-center gap-x-6">
                        <Link
                            href={primaryAction.href}
                            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105"
                        >
                            {primaryAction.label}
                        </Link>

                        {secondaryAction && (
                            <Link
                                href={secondaryAction.href}
                                className="group text-sm font-semibold leading-6 text-white flex items-center gap-2 hover:text-indigo-400 transition-colors"
                            >
                                {secondaryAction.icon ? <secondaryAction.icon className="h-10 w-10 flex-shrink-0 rounded-full bg-white/10 p-2.5 ring-1 ring-white/20 group-hover:bg-indigo-500 group-hover:ring-indigo-500 transition-all" /> : null}
                                {secondaryAction.label} <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Abstract Shapes */}
            <div
                className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
                aria-hidden="true"
            >
                <div
                    className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
                    style={{
                        clipPath:
                            'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                    }}
                />
            </div>
        </div>
    )
}
