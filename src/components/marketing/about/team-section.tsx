"use client";

import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface TeamMember {
    name: string;
    roleKey: string;
    image: string;
    link: string;
}

const members: TeamMember[] = [
    {
        name: "Karim Benjelloun",
        roleKey: "md",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
        link: "#",
    },
    {
        name: "Sarah Idrissi",
        roleKey: "tech_lead",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        link: "#",
    },
    {
        name: "Omar Tazi",
        roleKey: "booking",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
        link: "#",
    },
    {
        name: "Nadia El Fassi",
        roleKey: "logistics",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
        link: "#",
    },
    {
        name: "Youssef Alaoui",
        roleKey: "maintenance",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
        link: "#",
    },
    {
        name: "Leila Chraibi",
        roleKey: "support",
        image: "https://images.unsplash.com/photo-1598550832205-d593763eb56b?q=80&w=800&auto=format&fit=crop",
        link: "#",
    },
];

export default function TeamSection({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "about");

    return (
        <section className="bg-black py-16 md:py-32 border-t border-white/5 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D00000]/5 rounded-full blur-[120px]" />
            </div>

            <div className="mx-auto max-w-7xl px-6">
                <span className="text-[#D00000] text-sm tracking-widest uppercase mb-4 block font-medium">
                    {t("team.label")}
                </span>
                <div className="mt-8 gap-12 sm:grid sm:grid-cols-2 lg:gap-16">
                    <div className="sm:w-3/4">
                        <h2 className="text-3xl font-light text-white sm:text-5xl leading-tight font-display">
                            {t("team.title")}
                        </h2>
                    </div>
                    <div className="mt-6 sm:mt-0 flex items-end">
                        <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
                            {t("team.description")}
                        </p>
                    </div>
                </div>

                <div className="mt-16 md:mt-24">
                    <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((member, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 aspect-[4/5]">
                                <Image
                                    className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
                                    src={member.image}
                                    alt={member.name}
                                    width={800}
                                    height={1000}
                                />

                                {/* Overlay Gradient - Always visible but darker at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                                {/* Content Overlay - Positioned Absolute Inside */}
                                <div className="absolute inset-x-0 bottom-0 p-6 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex justify-between items-end border-b border-white/20 pb-4 mb-4">
                                        <h3 className="text-xl font-medium text-white transition-all duration-300 group-hover:text-[#D00000] font-display uppercase tracking-wide">
                                            {member.name}
                                        </h3>
                                        <span className="text-xs text-zinc-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">0{index + 1}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300 text-sm font-medium">
                                            {t(`team.roles.${member.roleKey}`)}
                                        </span>
                                        <Link
                                            href={member.link}
                                            className="text-white hover:text-[#D00000] transition-colors duration-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 ease-out"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
