"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        quote: string; // Used as Title for News
        name: string;  // Used as Date/Category
        title: string; // Used as Link Text
        href?: string;
        image?: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards",
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse",
                );
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
                className,
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-4",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]",
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="w-[350px] max-w-full relative rounded-2xl border border-white/10 bg-zinc-950/50 flex-shrink-0 px-8 py-6 md:w-[450px] transition-colors hover:border-red-600/30 hover:bg-zinc-900 group"
                        key={idx}
                    >
                        {/* Content */}
                        <div className="relative z-20 flex flex-col h-full justify-between">
                            <div>
                                {item.image && (
                                    <div className="relative h-48 w-full mb-6 overflow-hidden rounded-lg">
                                        <Image
                                            src={item.image}
                                            alt={item.quote}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Overlay for better text readability if we were putting text over it, but here it's separate. 
                                Let's add a subtle border inner.
                             */}
                                        <div className="absolute inset-0 border-inset border border-white/5 rounded-lg pointer-events-none" />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-mono uppercase text-[#D00000] tracking-widest">{item.name}</span>
                                </div>

                                <h3 className="text-xl font-display font-bold text-white uppercase leading-tight mb-4 min-h-[3rem]">
                                    {item.quote}
                                </h3>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                                <span className="text-sm text-zinc-500 font-light flex items-center gap-2 group-hover:text-white transition-colors">
                                    Read Article <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
