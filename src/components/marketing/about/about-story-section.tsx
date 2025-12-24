"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Video,
    Aperture,
    Zap, // Lighting
    Wrench, // Grip
    Users, // Crew
    Truck, // Logistics
    Award,
    Globe2,
    Calendar,
    ArrowRight,
    Play, // Secondary icon example
    Film,
    MonitorPlay,
    Box,
} from "lucide-react";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface AboutStorySectionProps {
    lng: string;
}

export default function AboutStorySection({ lng }: AboutStorySectionProps) {
    const { t } = useTranslation(lng, "about");
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
    const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });

    // Parallax effect for decorative elements
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
    const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    // Mapping 'expertise.items' from JSON to Icons
    const services = [
        {
            key: "cameras",
            icon: <Video className="w-6 h-6" />,
            secondaryIcon: <Film className="w-4 h-4 absolute -top-1 -right-1 text-red-500/50" />,
            position: "left",
        },
        {
            key: "lenses",
            icon: <Aperture className="w-6 h-6" />,
            secondaryIcon: <MonitorPlay className="w-4 h-4 absolute -top-1 -right-1 text-red-500/50" />,
            position: "left",
        },
        {
            key: "lighting",
            icon: <Zap className="w-6 h-6" />,
            secondaryIcon: <Play className="w-4 h-4 absolute -top-1 -right-1 text-red-500/50" />,
            position: "left",
        },
        {
            key: "grip",
            icon: <Wrench className="w-6 h-6" />,
            secondaryIcon: <Box className="w-4 h-4 absolute -top-1 -right-1 text-red-500/50" />,
            position: "right",
        },
        {
            key: "crew",
            icon: <Users className="w-6 h-6" />,
            secondaryIcon: <Award className="w-4 h-4 absolute -top-1 -right-1 text-red-500/50" />,
            position: "right",
        },
        {
            key: "logistics",
            icon: <Truck className="w-6 h-6" />,
            secondaryIcon: <Globe2 className="w-4 h-4 absolute -top-1 -right-1 text-red-500/50" />,
            position: "right",
        },
    ];

    const stats = [
        { icon: <Calendar />, value: 14, label: t("stats.years"), suffix: "+" }, // Started 2010 -> 2024 = 14+
        { icon: <Film />, value: 12000, label: t("stats.projects"), suffix: "+" },
        { icon: <Globe2 />, value: 200, label: t("stats.countries"), suffix: "+" }, // Using "Countries" label for Cities/Locations
        { icon: <Users />, value: 98, label: "Client Satisfaction", suffix: "%" }, // Static for now
    ];

    return (
        <section
            id="about-story-section"
            ref={sectionRef}
            className="w-full py-24 px-4 bg-black text-white overflow-hidden relative"
        >
            {/* Decorative background elements (Dark Mode) */}
            <motion.div
                className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#D00000]/10 blur-[100px]"
                style={{ y: y1, rotate: rotate1 }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-slate-800/20 blur-[100px]"
                style={{ y: y2, rotate: rotate2 }}
            />

            {/* Floating Particles */}
            <motion.div
                className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-[#D00000]/40"
                animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-slate-600/40"
                animate={{
                    y: [0, 20, 0],
                    opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            <motion.div
                className="container mx-auto max-w-6xl relative z-10"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {/* Header */}
                <motion.div className="flex flex-col items-center mb-16" variants={itemVariants}>
                    <motion.span
                        className="text-[#D00000] font-medium mb-3 flex items-center gap-2 text-sm tracking-widest uppercase"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Zap className="w-4 h-4" />
                        {t("expertise.label")}
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-light mb-6 text-center text-white">
                        {t("expertise.title")}
                    </h2>
                    <motion.div
                        className="w-24 h-1 bg-gradient-to-r from-[#D00000] to-red-900"
                        initial={{ width: 0 }}
                        animate={{ width: 96 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                </motion.div>

                {/* Main Content: 3 Columns */}
                <motion.p className="text-center max-w-2xl mx-auto mb-20 text-zinc-400 text-lg leading-relaxed" variants={itemVariants}>
                    {t("expertise.description")}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Left Column */}
                    <div className="space-y-16">
                        {services
                            .filter((service) => service.position === "left")
                            .map((service, index) => (
                                <ServiceItem
                                    key={`left-${index}`}
                                    icon={service.icon}
                                    secondaryIcon={service.secondaryIcon}
                                    title={t(`expertise.items.${service.key}.title`)}
                                    description={t(`expertise.items.${service.key}.description`)}
                                    variants={itemVariants}
                                    delay={index * 0.2}
                                    direction="left"
                                />
                            ))}
                    </div>

                    {/* Center Image */}
                    <div className="flex justify-center items-center order-first md:order-none mb-12 md:mb-0">
                        <motion.div className="relative w-full max-w-sm" variants={itemVariants}>
                            <motion.div
                                className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 relative z-10"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                            >
                                <div className="aspect-[3/4] relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=1000&auto=format&fit=crop"
                                        alt="TFS Production Set"
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                </div>

                                <motion.div
                                    className="absolute inset-0 flex items-end justify-center p-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.9 }}
                                >
                                    <Link href={`/${lng}/equipment`}>
                                        <motion.button
                                            className="bg-[#D00000] hover:bg-[#B00000] text-white px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium shadow-lg shadow-red-900/20 backdrop-blur-sm transition-all"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {t("expertise.portfolio_btn")} <ArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Decorative Frame Behind */}
                            <motion.div
                                className="absolute inset-0 border border-zinc-700/50 rounded-2xl -m-4 z-[0]"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            ></motion.div>

                            {/* Floating accent elements */}
                            <motion.div
                                className="absolute -top-8 -right-12 w-20 h-20 rounded-full bg-[#D00000]/10 blur-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.9 }}
                                style={{ y: y1 }}
                            ></motion.div>
                            <motion.div
                                className="absolute -bottom-8 -left-12 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 1.1 }}
                                style={{ y: y2 }}
                            ></motion.div>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-16">
                        {services
                            .filter((service) => service.position === "right")
                            .map((service, index) => (
                                <ServiceItem
                                    key={`right-${index}`}
                                    icon={service.icon}
                                    secondaryIcon={service.secondaryIcon}
                                    title={t(`expertise.items.${service.key}.title`)}
                                    description={t(`expertise.items.${service.key}.description`)}
                                    variants={itemVariants}
                                    delay={index * 0.2}
                                    direction="right"
                                />
                            ))}
                    </div>
                </div>

                {/* Stats Section */}
                <motion.div
                    ref={statsRef}
                    className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-16"
                    initial="hidden"
                    animate={isStatsInView ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    {stats.map((stat, index) => (
                        <StatCounter
                            key={index}
                            icon={stat.icon}
                            value={stat.value}
                            label={stat.label}
                            suffix={stat.suffix}
                            delay={index * 0.1}
                        />
                    ))}
                </motion.div>

                {/* CTA Box */}
                <motion.div
                    className="mt-24 relative overflow-hidden bg-zinc-900/50 border border-white/10 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[#D00000]/30 transition-colors duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D00000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex-1 relative z-10 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-light mb-3 text-white">
                            {t("cta.title")}
                        </h3>
                        <p className="text-zinc-400">
                            {t("cta.subtitle")}
                        </p>
                    </div>
                    <Link href={`/${lng}/contact`} className="relative z-10">
                        <motion.button
                            className="bg-zinc-100 hover:bg-white text-black px-8 py-4 rounded-lg flex items-center gap-3 font-semibold transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t("cta.button")} <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}

// Sub-components

interface ServiceItemProps {
    icon: React.ReactNode;
    secondaryIcon?: React.ReactNode;
    title: string;
    description: string;
    variants: any;
    delay: number;
    direction: "left" | "right";
}

function ServiceItem({ icon, secondaryIcon, title, description, variants, delay, direction }: ServiceItemProps) {
    return (
        <motion.div
            className="flex flex-col group"
            variants={variants}
            transition={{ delay }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <motion.div
                className={clsx(
                    "flex items-center gap-4 mb-4",
                    direction === "right" && "lg:flex-row-reverse lg:text-right"
                )}
                initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: delay + 0.2 }}
            >
                <motion.div
                    className="text-[#D00000] bg-[#D00000]/10 p-3 rounded-xl transition-colors duration-300 group-hover:bg-[#D00000]/20 relative shrink-0"
                    whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                >
                    {icon}
                    {secondaryIcon}
                </motion.div>
                <h3 className="text-xl font-medium text-zinc-100 group-hover:text-[#D00000] transition-colors duration-300">
                    {title}
                </h3>
            </motion.div>
            <motion.p
                className={clsx(
                    "text-sm text-zinc-400 leading-relaxed pl-16",
                    direction === "right" && "lg:pl-0 lg:pr-16 lg:text-right"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: delay + 0.4 }}
            >
                {description}
            </motion.p>
        </motion.div>
    );
}

interface StatCounterProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix: string;
    delay: number;
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
    const countRef = useRef(null);
    const isInView = useInView(countRef, { once: false });
    const [hasAnimated, setHasAnimated] = useState(false);

    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 10,
    });

    useEffect(() => {
        if (isInView && !hasAnimated) {
            springValue.set(value);
            setHasAnimated(true);
        } else if (!isInView && hasAnimated) {
            // Optional: Reset on exit? No, keep it.
            // springValue.set(0); 
        }
    }, [isInView, value, springValue, hasAnimated]);

    const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

    return (
        <motion.div
            className="bg-zinc-900/40 border border-white/5 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-zinc-900/60 hover:border-[#D00000]/20 transition-all duration-300"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay },
                },
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <motion.div
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#D00000] group-hover:bg-[#D00000]/10 transition-colors duration-300"
                whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
            >
                {icon}
            </motion.div>
            <motion.div ref={countRef} className="text-4xl font-bold text-white flex items-center font-display">
                <motion.span>{displayValue}</motion.span>
                <span className="text-[#D00000]">{suffix}</span>
            </motion.div>
            <p className="text-zinc-500 text-sm mt-2 uppercase tracking-wider">{label}</p>
        </motion.div>
    );
}
