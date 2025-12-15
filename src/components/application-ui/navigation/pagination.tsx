import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string; // wrapper style
}

export default function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  // Simple range generation
  // In a real app, you'd want complex logic for "..." truncation
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={cn("flex items-center justify-between border-t border-gray-200 px-4 sm:px-0", className)}>
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:hover:border-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeft className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pages.map((page) => (
          <button
             key={page}
             onClick={() => onPageChange?.(page)}
             aria-current={page === currentPage ? 'page' : undefined}
             className={cn(
                "inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium",
                page === currentPage
                  ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
             )}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:hover:border-transparent disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Next
          <ChevronRight className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
