import Link from 'next/link'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface QuickActionCardProps {
    title: string
    description: string
    icon: LucideIcon
    href: string
}

export function QuickActionCard({
    title,
    description,
    icon: Icon,
    href
}: QuickActionCardProps) {
    return (
        <Link href={href} className="group block">
            <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-5 transition-all hover:bg-zinc-900/60 hover:border-red-900/30">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-red-900/20 text-red-500 group-hover:bg-red-900/30 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-red-400 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">{description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 group-hover:translate-x-1 transition-all mt-1" />
                </div>
            </div>
        </Link>
    )
}
