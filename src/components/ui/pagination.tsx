import { cn } from '@/lib/utils'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = generatePageNumbers(currentPage, totalPages)

    return (
        <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className={cn(
                    'px-3 py-2 text-sm rounded-lg transition-colors',
                    currentPage <= 1
                        ? 'text-zinc-600 cursor-not-allowed'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                )}
            >
                Previous
            </button>

            {pages.map((page, i) => (
                page === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-zinc-600">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={cn(
                            'px-3 py-2 text-sm rounded-lg transition-colors',
                            currentPage === page
                                ? 'bg-white text-zinc-900 font-medium'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        )}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className={cn(
                    'px-3 py-2 text-sm rounded-lg transition-colors',
                    currentPage >= totalPages
                        ? 'text-zinc-600 cursor-not-allowed'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                )}
            >
                Next
            </button>
        </nav>
    )
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current <= 3) {
        return [1, 2, 3, 4, 5, '...', total]
    }

    if (current >= total - 2) {
        return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    }

    return [1, '...', current - 1, current, current + 1, '...', total]
}
