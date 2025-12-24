"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useState, useEffect } from "react";

interface BackgroundCirclesProps {
    title?: string;
    description?: string;
    className?: string;
    variant?: keyof typeof COLOR_VARIANTS;
}

const COLOR_VARIANTS = {
    primary: { // Dark Red (Brand)
        border: [
            "border-red-900/60",
            "border-red-800/50",
            "border-slate-800/30",
        ],
        gradient: "from-red-900/30",
        glow: "#450A0A", // Red-950
        glowSecondary: "#7F1D1D", // Red-900
    },
    secondary: { // Dark Blue
        border: [
            "border-blue-900/60",
            "border-sky-900/50",
            "border-slate-900/30",
        ],
        gradient: "from-blue-900/30",
        glow: "#1E3A8A", // Blue-900
        glowSecondary: "#172554", // Blue-950
    },
    tertiary: { // Dark Green
        border: [
            "border-emerald-900/60",
            "border-emerald-800/50",
            "border-slate-900/30",
        ],
        gradient: "from-emerald-900/30",
        glow: "#064E3B", // Emerald-900
        glowSecondary: "#065F46", // Emerald-800
    },
} as const;

const AnimatedGrid = () => (
    <motion.div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
        animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
        }}
    >
        <div className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-20" />
    </motion.div>
);

export function BackgroundCircles({
    title = "Background Circles",
    description = "Optional Description",
    className,
    variant = "primary",
}: BackgroundCirclesProps & { cycleColors?: boolean }) {
    // Cycle Order: Red -> Blue -> Green
    const CYCLE_VARIANTS: (keyof typeof COLOR_VARIANTS)[] = ["primary", "secondary", "tertiary"];
    const [currentVariant, setCurrentVariant] = useState<keyof typeof COLOR_VARIANTS>(variant);

    const { cycleColors = true } = { cycleColors: true }; // Default true

    // Effect to cycle colors

    useEffect(() => {
        if (!cycleColors) return;

        const interval = setInterval(() => {
            setCurrentVariant((prev) => {
                const currentIndex = CYCLE_VARIANTS.indexOf(prev);
                // If current variant isn't in our cycle list (e.g. customized initial), start from 0
                const nextIndex = (currentIndex === -1 ? 0 : currentIndex + 1) % CYCLE_VARIANTS.length;
                return CYCLE_VARIANTS[nextIndex];
            });
        }, 4000); // 4 seconds

        return () => clearInterval(interval);
    }, [cycleColors]);


    const variantStyles = COLOR_VARIANTS[currentVariant as keyof typeof COLOR_VARIANTS];

    return (
        <div
            className={clsx(
                "relative flex h-screen w-full items-center justify-center overflow-hidden",
                "bg-white dark:bg-black/5",
                className
            )}
        >
            <AnimatedGrid />
            <motion.div className="absolute h-[480px] w-[480px]">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={clsx(
                            "absolute inset-0 rounded-full",
                            "border-2 bg-gradient-to-br to-transparent transition-colors duration-1000", // Added transition
                            variantStyles.border[i],
                            variantStyles.gradient
                        )}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.05 + i * 0.05, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    >
                        <div
                            className={clsx(
                                "absolute inset-0 rounded-full mix-blend-screen transition-colors duration-1000",
                                `bg-[radial-gradient(ellipse_at_center,${variantStyles.gradient.replace(
                                    "from-",
                                    ""
                                )}/10%,transparent_70%)]`
                            )}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1
                    className={clsx(
                        "text-5xl font-bold tracking-tight md:text-7xl",
                        "bg-gradient-to-b from-slate-950 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent",
                        "drop-shadow-[0_0_32px_rgba(94,234,212,0.4)]"
                    )}
                >
                    {title}
                </h1>

                <motion.p
                    className="mt-6 text-lg md:text-xl dark:text-white text-slate-950"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {description}
                </motion.p>
            </motion.div>

            <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
                <motion.div
                    animate={{ backgroundColor: variantStyles.glow }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] blur-[120px] opacity-30"
                />
                <motion.div
                    animate={{ backgroundColor: variantStyles.glowSecondary }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent)] blur-[80px] opacity-15"
                />
            </div>
        </div>
    );
}
