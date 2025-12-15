'use client'

/**
 * Dashboard Client Component
 * 
 * Cinema-grade user dashboard displaying:
 * - Quick stats overview
 * - Quote requests with status badges
 * - Profile information
 * 
 * Design Archetype: Dark Cinema / Professional Rental
 * Palette: Zinc/Neutral with white accents, status colors for badges
 */

import { useUser } from '@/components/pocketbase-provider'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Clock,
  CheckCircle2,
  Camera,
  User,
  Mail,
  Calendar,
  ArrowRight,
  Settings,
  LogOut,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getUserDashboardQuotes, getDashboardStats, type DashboardQuote } from '@/lib/actions/dashboard'
import { UserQuotesList } from '@/components/dashboard/user-quotes-list'
import { logout } from '@/lib/actions/session'

// ============================================================================
// Stats Card Component
// ============================================================================

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  delay: number
}

function StatCard({ title, value, icon, description, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative bg-zinc-900/50 rounded-xl border border-white/5 p-6 overflow-hidden group hover:border-white/10 transition-colors"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/5 rounded-lg">
            {icon}
          </div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <p className="text-xs text-zinc-600 mt-1">{description}</p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Profile Card Component
// ============================================================================

interface ProfileCardProps {
  user: {
    id: string
    name?: string
    email?: string
    created?: string
  }
  onLogout: () => void
  lng: string
}

function ProfileCard({ user, onLogout, lng }: ProfileCardProps) {
  const memberSince = user.created
    ? new Date(user.created).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A'

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden"
    >
      {/* Header with avatar */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {user.name || 'User'}
            </h3>
            <p className="text-sm text-zinc-500">Cinema Equipment Client</p>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Mail className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-300 truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-300">Member since {memberSince}</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
          <User className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500 font-mono text-xs">{user.id.slice(0, 15)}...</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <a
          href={`/${lng}/equipment`}
          className="flex items-center justify-between w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
        >
          <span className="text-sm font-medium text-white flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Browse Equipment
          </span>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </a>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full p-3 text-sm text-zinc-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Main Dashboard Component
// ============================================================================

interface DashboardPageClientProps {
  lng: string
}

export function DashboardPageClient({ lng }: DashboardPageClientProps) {
  const user = useUser()
  const router = useRouter()
  const [quotes, setQuotes] = useState<DashboardQuote[]>([])
  const [stats, setStats] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    confirmedQuotes: 0,
    activeRentals: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [quotesResult, statsResult] = await Promise.all([
          getUserDashboardQuotes(),
          getDashboardStats()
        ])

        if (quotesResult.success) {
          setQuotes(quotesResult.quotes)
        }
        setStats(statsResult)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push(`/${lng}`)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-500 mt-1">
            Welcome back, {user.name || 'there'}
          </p>
        </div>
        <button className="p-2 text-zinc-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Main Grid: Stats + Profile Sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
        {/* Left Column: Stats + Quotes */}
        <div className="space-y-8">
          {/* Stats Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Requests"
              value={stats.totalQuotes}
              icon={<FileText className="w-5 h-5 text-white" />}
              description="All time submissions"
              delay={0.1}
            />
            <StatCard
              title="Pending"
              value={stats.pendingQuotes}
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              description="Awaiting response"
              delay={0.15}
            />
            <StatCard
              title="Confirmed"
              value={stats.confirmedQuotes}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              description="Ready for pickup"
              delay={0.2}
            />
            <StatCard
              title="Active Rentals"
              value={stats.activeRentals}
              icon={<Camera className="w-5 h-5 text-blue-400" />}
              description="Currently in use"
              delay={0.25}
            />
          </div>

          {/* Quotes List */}
          <UserQuotesList quotes={quotes} isLoading={isLoading} />
        </div>

        {/* Right Column: Profile Sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProfileCard
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              created: user.created
            }}
            onLogout={handleLogout}
            lng={lng}
          />
        </div>
      </div>
    </div>
  )
}
