"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface PlusCardProps {
    className?: string
    title: string | React.ReactNode
    description?: string | React.ReactNode
    icon?: React.ReactNode
    href?: string
}

export const PlusCard: React.FC<PlusCardProps> = ({
    className = "",
    title,
    description,
    icon,
    href
}) => {
    const content = (
        <>
            <CornerPlusIcons />
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="space-y-4">
                    {icon && (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center text-[#D00000]">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                        {title}
                    </h3>
                    <div className="text-zinc-400 leading-relaxed text-sm">
                        {description}
                    </div>
                </div>
            </div>
        </>
    )

    const containerClasses = cn(
        "relative border border-dashed border-zinc-800 rounded-lg p-6 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors duration-300 min-h-[200px] group",
        className
    )

    if (href) {
        return (
            <Link href={href} className={containerClasses}>
                {content}
            </Link>
        )
    }

    return (
        <div className={containerClasses}>
            {content}
        </div>
    )
}

const CornerPlusIcons = () => (
    <>
        <PlusIcon className="absolute -top-3 -left-3" />
        <PlusIcon className="absolute -top-3 -right-3" />
        <PlusIcon className="absolute -bottom-3 -left-3" />
        <PlusIcon className="absolute -bottom-3 -right-3" />
    </>
)

const PlusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        className={cn("text-zinc-700 w-6 h-6", className)}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
)
