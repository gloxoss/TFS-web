import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  name: string;
  href: string;
  current: boolean;
}

interface BreadcrumbsProps {
  pages: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ pages, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/" className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
              <Home className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              <Link
                href={page.href}
                aria-current={page.current ? 'page' : undefined}
                className={cn(
                  "ml-4 text-sm font-medium",
                  page.current 
                    ? "text-gray-700 font-semibold dark:text-gray-200" 
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
