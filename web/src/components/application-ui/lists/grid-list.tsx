import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GridItem {
    id: string | number;
    title: string;
    subtitle?: string;
    initials: string;
    color?: string; // e.g. 'bg-pink-600'
    href?: string;
}

interface GridListProps {
    items: GridItem[];
    className?: string;
}

export default function GridList({ items, className }: GridListProps) {
    return (
        <ul role="list" className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4", className)}>
            {items.map((item) => (
                <li key={item.id} className="col-span-1 flex rounded-md shadow-sm">
                    <div
                        className={cn(
                            item.color || 'bg-indigo-600',
                            'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                        )}
                    >
                        {item.initials}
                    </div>
                    <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                            <Link href={item.href || '#'} className="font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">
                                {item.title}
                            </Link>
                            {item.subtitle && <p className="text-gray-500 dark:text-gray-400">{item.subtitle}</p>}
                        </div>
                        <div className="flex-shrink-0 pr-2">
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:hover:text-gray-300"
                            >
                                <MoreVertical className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}
