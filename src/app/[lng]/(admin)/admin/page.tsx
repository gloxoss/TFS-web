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
    Send
} from 'lucide-react'
import { StatsCard } from '@/components/admin/dashboard/stats-card'
import { QuickActionCard } from '@/components/admin/dashboard/quick-action-card'
import { QuoteRow } from '@/components/admin/dashboard/quote-row'

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

const translations = {
    en: {
        dashboard: 'Dashboard',
        welcome: "Welcome back. Here's what's happening.",
        totalEquipment: 'Total Equipment',
        pending: 'Pending',
        quoted: 'Quoted',
        confirmed: 'Confirmed',
        usersCount: 'Users',
        recentQuotes: 'Recent Quotes',
        viewAll: 'View all →',
        noQuotes: 'No quotes yet',
        quickActions: 'Quick Actions',
        addEquipment: 'Add Equipment',
        createListing: 'Create a new equipment listing',
        manageRequests: 'Manage Requests',
        processRequests: 'View and process quote requests',
        createPost: 'Create Blog Post',
        writeArticle: 'Write a new article',
        settings: 'Settings',
        configure: 'Configure platform settings'
    },
    fr: {
        dashboard: 'Tableau de bord',
        welcome: "Bon retour. Voici ce qui se passe.",
        totalEquipment: 'Total Équipement',
        pending: 'En attente',
        quoted: 'Devis envoyé',
        confirmed: 'Confirmé',
        usersCount: 'Utilisateurs',
        recentQuotes: 'Devis récents',
        viewAll: 'Tout voir →',
        noQuotes: 'Aucun devis',
        quickActions: 'Actions rapides',
        addEquipment: 'Ajouter du matériel',
        createListing: 'Créer une nouvelle fiche',
        manageRequests: 'Gérer les demandes',
        processRequests: 'Voir et traiter les demandes',
        createPost: 'Créer un article',
        writeArticle: 'Rédiger un nouvel article',
        settings: 'Paramètres',
        configure: 'Configurer la plateforme'
    }
}

// Main Dashboard Content
async function DashboardContent({ lng }: { lng: string }) {
    const [statsResult, quotesResult] = await Promise.all([
        getAdminDashboardStats(),
        getRecentQuotes(5)
    ])

    const stats = statsResult.stats
    const t = translations[lng as keyof typeof translations] || translations.en

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{t.dashboard}</h1>
                <p className="text-zinc-500 mt-1">{t.welcome}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                    title={t.totalEquipment}
                    value={stats?.totalEquipment ?? 0}
                    icon={Package}
                    color="blue"
                    href={`/${lng}/admin/inventory`}
                />
                <StatsCard
                    title={t.pending}
                    value={stats?.pendingQuotes ?? 0}
                    icon={Clock}
                    color="yellow"
                    href={`/${lng}/admin/requests`}
                />
                <StatsCard
                    title={t.quoted}
                    value={stats?.quotedQuotes ?? 0}
                    icon={Send}
                    color="purple"
                    href={`/${lng}/admin/requests`}
                />
                <StatsCard
                    title={t.confirmed}
                    value={stats?.confirmedQuotes ?? 0}
                    icon={CheckCircle}
                    color="green"
                    href={`/${lng}/admin/requests`}
                />
                <StatsCard
                    title={t.usersCount}
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
                            {t.recentQuotes}
                        </h2>
                        <Link
                            href={`/${lng}/admin/requests`}
                            className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
                        >
                            {t.viewAll}
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
                                <p>{t.noQuotes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                    <h2 className="font-semibold text-white px-1">{t.quickActions}</h2>
                    <QuickActionCard
                        title={t.addEquipment}
                        description={t.createListing}
                        icon={PlusCircle}
                        href={`/${lng}/admin/inventory/new`}
                    />
                    <QuickActionCard
                        title={t.manageRequests}
                        description={t.processRequests}
                        icon={Inbox}
                        href={`/${lng}/admin/requests`}
                    />
                    <QuickActionCard
                        title={t.createPost}
                        description={t.writeArticle}
                        icon={FileText}
                        href={`/${lng}/admin/blog/new`}
                    />
                    <QuickActionCard
                        title={t.settings}
                        description={t.configure}
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
