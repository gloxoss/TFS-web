/**
 * Public Quote View Page (Magic Link)
 *
 * Shows quote status and details via secure token-based URLs.
 * Content changes based on quote status:
 * - pending/reviewing: "Processing" message
 * - quoted: Price + PDF download available  
 * - confirmed: "Quote accepted" message
 * - rejected: "Quote declined" message
 *
 * Design Archetype: Dark Cinema Utility
 */

import { createServerClient } from '@/lib/pocketbase/server'
import { getQuoteService } from '@/services'
import Link from 'next/link'
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Calendar,
  Mail,
  Phone,
  Building,
} from 'lucide-react'
import type { Quote, QuoteStatus } from '@/services/quotes/interface'
import { QuoteActions } from '@/components/quote/quote-actions'

interface PageProps {
  params: Promise<{
    lng: string
    id: string
  }>
  searchParams: Promise<{
    token?: string
  }>
}

// Extended quote type for this page
interface QuoteViewData extends Omit<Quote, 'pdfGenerated'> {
  quotePdfUrl?: string
}

async function getQuoteByIdAndToken(quoteId: string, token: string): Promise<QuoteViewData | null> {
  try {
    // Use service to fetch quote securely
    // We pass a dummy client because getQuoteByToken handles its own admin auth
    // But getQuoteService expects a client. We can pass a basic one.
    const pb = await createServerClient()
    const quoteService = getQuoteService(pb)
    const record = await quoteService.getQuoteByToken(quoteId, token)

    if (!record) return null

    // Map to domain type (QuoteService already returns Quote domain type)
    // We just need to handle the PDF URL which might be different in the view
    return {
      ...record,
      quotePdfUrl: record.pdfFileUrl
    }
  } catch (error) {
    console.error('Error fetching quote:', error)
    return null
  }
}

// Status badge component
function StatusBadge({ status }: { status: QuoteStatus }) {
  const config: Record<QuoteStatus, { label: string; className: string; icon: typeof Clock }> = {
    pending: {
      label: 'Pending Review',
      className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: Clock,
    },
    reviewing: {
      label: 'Under Review',
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: Clock,
    },
    quoted: {
      label: 'Quote Ready',
      className: 'bg-green-500/10 text-green-400 border-green-500/20',
      icon: CheckCircle,
    },
    confirmed: {
      label: 'Confirmed',
      className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: CheckCircle,
    },
    rejected: {
      label: 'Declined',
      className: 'bg-red-500/10 text-red-400 border-red-500/20',
      icon: XCircle,
    },
  }

  const { label, className, icon: Icon } = config[status] || config.pending

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${className}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export default async function QuoteViewPage({ params, searchParams }: PageProps) {
  const { lng, id } = await params
  const { token } = await searchParams

  // Require token parameter
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">401 Unauthorized</h1>
          <p className="text-zinc-400">Invalid or missing access token.</p>
        </div>
      </div>
    )
  }

  // Fetch quote with token verification
  const quote = await getQuoteByIdAndToken(id, token)

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Quote Not Found</h1>
          <p className="text-zinc-400">Invalid access token or quote not found.</p>
        </div>
      </div>
    )
  }

  // Parse items
  let items: Array<{
    name: string
    quantity: number
    slug?: string
    imageUrl?: string
  }> = []
  try {
    items = JSON.parse(quote.itemsJson)
  } catch (error) {
    console.error('Error parsing quote items:', error)
  }

  const isPending = quote.status === 'pending' || quote.status === 'reviewing'
  const isQuoted = quote.status === 'quoted' || quote.status === 'confirmed'
  const isRejected = quote.status === 'rejected'

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Quote Request</p>
              <h1 className="text-2xl md:text-3xl font-bold">
                #{quote.confirmationNumber}
              </h1>
            </div>
            <StatusBadge status={quote.status} />
          </div>
          <p className="text-zinc-500 text-sm">
            Submitted {new Date(quote.created).toLocaleDateString()}
          </p>
        </div>

        {/* Status-Based Content */}
        {isPending && (
          <div className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-amber-300 mb-2">
                  Your Quote is Being Processed
                </h2>
                <p className="text-zinc-300 mb-4">
                  Our team is reviewing your equipment request and will prepare a personalized quote for you.
                  You&apos;ll receive an email notification when your quote is ready.
                </p>
                <p className="text-zinc-500 text-sm">
                  Typical response time: 24-48 hours
                </p>
              </div>
            </div>
          </div>
        )}

        {isQuoted && (
          <div className="bg-green-900/10 border border-green-800/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-green-300 mb-3">
                  Your Quote is Ready!
                </h2>
                <p className="text-zinc-400 text-sm mb-4">
                  Please review the official quote document and let us know your decision.
                </p>

                {/* PDF Download - Primary Action */}
                {quote.quotePdfUrl && (
                  <a
                    href={quote.quotePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors mb-4"
                  >
                    <Download className="w-5 h-5" />
                    View Quote (PDF)
                  </a>
                )}

                {/* Decision Buttons */}
                <div className="pt-4 border-t border-green-800/30">
                  <p className="text-zinc-500 text-xs mb-3">Make your decision:</p>
                  <QuoteActions
                    quoteId={quote.id}
                    accessToken={token}
                    confirmationNumber={quote.confirmationNumber || ''}
                    status={quote.status}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-300 mb-2">
                  Quote Request Declined
                </h2>
                <p className="text-zinc-300 mb-4">
                  Unfortunately, we&apos;re unable to fulfill this request at this time.
                  Please contact us for alternative options.
                </p>
                <a
                  href={`mailto:contact@tvfilm-solutions.com`}
                  className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Quote Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Client Information */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-zinc-400" />
              Client Information
            </h3>
            <div className="space-y-3">
              <p className="font-medium text-white">{quote.clientName}</p>
              <p className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {quote.clientEmail}
              </p>
              <p className="text-sm text-zinc-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {quote.clientPhone}
              </p>
              {quote.clientCompany && (
                <p className="text-sm text-zinc-400">{quote.clientCompany}</p>
              )}
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-400" />
              Rental Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Start Date</p>
                <p className="font-medium">{new Date(quote.rentalStartDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">End Date</p>
                <p className="font-medium">{new Date(quote.rentalEndDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-400" />
            Equipment ({items.length} items)
          </h3>
          <div className="divide-y divide-zinc-800">
            {items.map((item, index) => (
              <div key={index} className="py-3 flex justify-between items-center">
                <span className="text-zinc-200">{item.name}</span>
                <span className="text-zinc-500">×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Details */}
        {(quote.projectDescription || quote.specialRequests) && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            {quote.projectDescription && (
              <div className="mb-4">
                <p className="text-sm text-zinc-400 mb-1">Description</p>
                <p className="text-zinc-200">{quote.projectDescription}</p>
              </div>
            )}
            {quote.specialRequests && (
              <div>
                <p className="text-sm text-zinc-400 mb-1">Special Requests</p>
                <p className="text-zinc-200 whitespace-pre-line">{quote.specialRequests}</p>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href={`/${lng}`}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            ← Back to TV Film Solutions
          </Link>
        </div>
      </div>
    </div>
  )
}