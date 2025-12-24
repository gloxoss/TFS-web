import Link from 'next/link'

interface QuoteRowProps {
    quote: {
        id: string
        clientName: string
        clientEmail: string
        status: string
        itemCount: number
        created: string
    }
    lng: string
}

export function QuoteRow({
    quote,
    lng
}: QuoteRowProps) {
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
