import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    color?: 'zinc' | 'red' | 'green' | 'yellow' | 'blue' | 'purple'
    href?: string
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    color = 'zinc',
    href
}: StatsCardProps) {
    const colorClasses = {
        zinc: 'border-zinc-700 text-zinc-400',
        red: 'border-red-900/50 text-red-500',
        green: 'border-green-900/50 text-green-500',
        yellow: 'border-yellow-900/50 text-yellow-500',
        blue: 'border-blue-900/50 text-blue-500',
        purple: 'border-purple-900/50 text-purple-500'
    }

    const content = (
        <div className={`bg-zinc-900/50 rounded-xl border ${colorClasses[color]} p-6 transition-all hover:bg-zinc-900 hover:border-opacity-100`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-zinc-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-zinc-800/50`}>
                    <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[1]}`} />
                </div>
            </div>
        </div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }

    return content
}
