'use client'

/**
 * User Quotes List Component
 * 
 * Displays user's quote requests with status badges, rental dates,
 * and equipment preview. Cinema-grade dark theme styling.
 */

import { motion } from 'framer-motion'
import {
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  ChevronRight,
  Camera,
  Eye,
  Download,
  FileCheck
} from 'lucide-react'
import type { DashboardQuote } from '@/lib/actions/dashboard'
import { format, parseISO, differenceInDays } from 'date-fns'

// ============================================================================
// Status Badge Component
// ============================================================================

type QuoteStatus = 'pending' | 'reviewing' | 'quoted' | 'confirmed' | 'rejected'

const statusConfig: Record<QuoteStatus, {
  label: string
  icon: React.ReactNode
  bgClass: string
  textClass: string
  dotClass: string
}> = {
  pending: {
    label: 'Pending',
    icon: <Clock className="w-3.5 h-3.5" />,
    bgClass: 'bg-amber-500/10 border-amber-500/20',
    textClass: 'text-amber-400',
    dotClass: 'bg-amber-500'
  },
  reviewing: {
    label: 'Under Review',
    icon: <Eye className="w-3.5 h-3.5" />,
    bgClass: 'bg-blue-500/10 border-blue-500/20',
    textClass: 'text-blue-400',
    dotClass: 'bg-blue-500'
  },
  quoted: {
    label: 'Quote Ready',
    icon: <FileCheck className="w-3.5 h-3.5" />,
    bgClass: 'bg-purple-500/10 border-purple-500/20',
    textClass: 'text-purple-400',
    dotClass: 'bg-purple-500'
  },
  confirmed: {
    label: 'Confirmed',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    textClass: 'text-emerald-400',
    dotClass: 'bg-emerald-500'
  },
  rejected: {
    label: 'Declined',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    bgClass: 'bg-red-500/10 border-red-500/20',
    textClass: 'text-red-400',
    dotClass: 'bg-red-500'
  }
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  const config = statusConfig[status]

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bgClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} animate-pulse`} />
      <span className={config.textClass}>{config.icon}</span>
      <span className={`text-xs font-medium ${config.textClass}`}>{config.label}</span>
    </div>
  )
}

// ============================================================================
// Quote Card Component
// ============================================================================

interface QuoteCardProps {
  quote: DashboardQuote
  index: number
}

function QuoteCard({ quote, index }: QuoteCardProps) {
  const startDate = parseISO(quote.rentalStartDate)
  const endDate = parseISO(quote.rentalEndDate)
  const rentalDays = differenceInDays(endDate, startDate) + 1
  const createdDate = parseISO(quote.created)

  // Get first 3 items for preview
  const previewItems = quote.items.slice(0, 3)
  const remainingItems = quote.items.length - 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
    >
      {/* Top accent line based on status */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${quote.status === 'confirmed' ? 'bg-emerald-500' :
          quote.status === 'pending' ? 'bg-amber-500' :
            quote.status === 'reviewing' ? 'bg-blue-500' :
              'bg-red-500'
          }`}
      />

      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-mono">
                {quote.confirmationNumber || `#${quote.id.slice(0, 8).toUpperCase()}`}
              </span>
            </div>
            <p className="text-xs text-zinc-600">
              Submitted {format(createdDate, 'MMM d, yyyy')}
            </p>
          </div>
          <StatusBadge status={quote.status} />
        </div>

        {/* Rental Period */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-800/50 rounded-lg">
          <div className="p-2 bg-white/5 rounded-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-zinc-400">Rental Period</p>
            <p className="text-white font-medium">
              {format(startDate, 'MMM d')} — {format(endDate, 'MMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{rentalDays}</p>
            <p className="text-xs text-zinc-500">{rentalDays === 1 ? 'day' : 'days'}</p>
          </div>
        </div>

        {/* Equipment Preview */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-400">
              {quote.itemCount} {quote.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {previewItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1 bg-zinc-800/50 rounded-md"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                ) : (
                  <Camera className="w-4 h-4 text-zinc-600" />
                )}
                <span className="text-xs text-zinc-300 truncate max-w-[120px]">
                  {item.name}
                </span>
                {item.quantity > 1 && (
                  <span className="text-xs text-zinc-500">×{item.quantity}</span>
                )}
              </div>
            ))}
            {remainingItems > 0 && (
              <div className="flex items-center px-2 py-1 bg-zinc-800/50 rounded-md">
                <span className="text-xs text-zinc-500">+{remainingItems} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Estimated Price (if available) */}
        {quote.estimatedPrice && (quote.status === 'confirmed' || quote.status === 'quoted') && (
          <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
            <span className="text-sm text-emerald-400">Estimated Total</span>
            <span className="text-lg font-bold text-emerald-400">
              {quote.estimatedPrice.toLocaleString()} MAD
            </span>
          </div>
        )}

        {/* Download Quote PDF Button */}
        {quote.quotePdfUrl && (
          <a
            href={quote.quotePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Official Quote
          </a>
        )}

        {/* View Details Link */}
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-zinc-400 hover:text-white transition-colors group/btn"
        >
          View Details
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 bg-zinc-900/30 rounded-xl border border-dashed border-white/10"
    >
      <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
        <Package className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No Quotes Yet</h3>
      <p className="text-sm text-zinc-500 text-center max-w-sm mb-6">
        You haven&apos;t submitted any rental requests yet. Browse our equipment and submit a quote to get started.
      </p>
      <a
        href="/en/equipment"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-100 transition-colors"
      >
        <Camera className="w-4 h-4" />
        Browse Equipment
      </a>
    </motion.div>
  )
}

// ============================================================================
// Loading State Component
// ============================================================================

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-4" />
      <p className="text-sm text-zinc-500">Loading your quotes...</p>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

interface UserQuotesListProps {
  quotes: DashboardQuote[]
  isLoading?: boolean
}

export function UserQuotesList({ quotes, isLoading = false }: UserQuotesListProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (quotes.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Your Rental Requests</h2>
        <span className="text-sm text-zinc-500">{quotes.length} total</span>
      </div>

      {/* Quotes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote, index) => (
          <QuoteCard key={quote.id} quote={quote} index={index} />
        ))}
      </div>
    </div>
  )
}
