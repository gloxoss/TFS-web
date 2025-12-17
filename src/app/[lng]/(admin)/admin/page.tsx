/**
 * Admin Dashboard Page
 * 
 * Overview page with stats cards and quick actions.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { getAdminDashboardStats, getRecentQuotes } from '@/lib/actions/admin-dashboard'
import {
    Package,
    Users,
    Inbox,
    CheckCircle,
    Clock,
    FileText,
    Settings,
    PlusCircle,
    ArrowRight,
    Send
} from 'lucide-react'

// Stats Card Component
function StatsCard({
    title,
    value,
    icon: Icon,
    color = 'zinc',
    href
}: {
    title: string
    value: number | string
    icon: React.ElementType
    color?: 'zinc' | 'red' | 'green' | 'yellow' | 'blue' | 'purple'
    href?: string
}) {
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

// Quick Action Card
function QuickActionCard({
    title,
    description,
    icon: Icon,
    href
}: {
    title: string
    description: string
    icon: React.ElementType
    href: string
}) {
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

// Recent Quote Row
function QuoteRow({
    quote,
    lng
}: {
    quote: {
        id: string
        clientName: string
        clientEmail: string
        status: string
        itemCount: number
        created: string
    }
    lng: string
}) {
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-900/20 text-yellow-500',
        reviewing: 'bg-blue-900/20 text-blue-500',
        quoted: 'bg-purple-900/20 text-purple-500',
        confirmed: 'bg-green-900/20 text-green-500',
        rejected: 'bg-red-900/20 text-red-500'
    }

    return (
        <Link href={`/${lng}/admin/requests/${quote.id}`} className="block group">
            <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                        {quote.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">
                            {quote.clientName}
                        </p>
                        <p className="text-xs text-zinc-500">{quote.itemCount} items</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[quote.status] || 'bg-zinc-800 text-zinc-400'}`}>
                        {quote.status}
                    </span>
                    <span className="text-xs text-zinc-600">
                        {new Date(quote.created).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </Link>
    )
}

// Loading skeleton for stats
function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 animate-pulse">
                    <div className="h-4 bg-zinc-800 rounded w-24 mb-3" />
                    <div className="h-8 bg-zinc-800 rounded w-16" />
                </div>
            ))}
        </div>
    )
}

// Main Dashboard Content
async function DashboardContent({ lng }: { lng: string }) {
    const [statsResult, quotesResult] = await Promise.all([
        getAdminDashboardStats(),
        getRecentQuotes(5)
    ])

    const stats = statsResult.stats

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-zinc-500 mt-1">Welcome back. Here's what's happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Equipment"
                    value={stats?.totalEquipment ?? 0}
                    icon={Package}
                    color="blue"
                    href={`/${lng}/admin/inventory`}
                />
                <StatsCard
                    title="Pending"
                    value={stats?.pendingQuotes ?? 0}
                    icon={Clock}
                    color="yellow"
                    href={`/${lng}/admin/requests`}
                />
                <StatsCard
                    title="Quoted"
                    value={stats?.quotedQuotes ?? 0}
                    icon={Send}
                    color="purple"
                    href={`/${lng}/admin/requests`}
                />
                <StatsCard
                    title="Confirmed"
                    value={stats?.confirmedQuotes ?? 0}
                    icon={CheckCircle}
                    color="green"
                    href={`/${lng}/admin/requests`}
                />
                <StatsCard
                    title="Users"
                    value={stats?.totalUsers ?? 0}
                    icon={Users}
                    color="zinc"
                    href={`/${lng}/admin/users`}
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Quotes */}
                <div className="lg:col-span-2 bg-zinc-900/30 rounded-xl border border-zinc-800">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <Inbox className="w-4 h-4 text-zinc-400" />
                            Recent Quotes
                        </h2>
                        <Link
                            href={`/${lng}/admin/requests`}
                            className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-zinc-800/50">
                        {quotesResult.quotes.length > 0 ? (
                            quotesResult.quotes.map((quote) => (
                                <QuoteRow key={quote.id} quote={quote} lng={lng} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-zinc-500">
                                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No quotes yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                    <h2 className="font-semibold text-white px-1">Quick Actions</h2>
                    <QuickActionCard
                        title="Add Equipment"
                        description="Create a new equipment listing"
                        icon={PlusCircle}
                        href={`/${lng}/admin/inventory/new`}
                    />
                    <QuickActionCard
                        title="Manage Requests"
                        description="View and process quote requests"
                        icon={Inbox}
                        href={`/${lng}/admin/requests`}
                    />
                    <QuickActionCard
                        title="Create Blog Post"
                        description="Write a new article"
                        icon={FileText}
                        href={`/${lng}/admin/blog/new`}
                    />
                    <QuickActionCard
                        title="Settings"
                        description="Configure platform settings"
                        icon={Settings}
                        href={`/${lng}/admin/settings`}
                    />
                </div>
            </div>
        </div>
    )
}

// Main Page Export
export default async function AdminDashboardPage({
    params
}: {
    params: Promise<{ lng: string }>
}) {
    const { lng } = await params

    return (
        <Suspense fallback={<StatsSkeleton />}>
            <DashboardContent lng={lng} />
        </Suspense>
    )
}
