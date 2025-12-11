import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FeedItem {
    id: string | number;
    content: React.ReactNode;
    date: string;
    datetime?: string;
    icon: LucideIcon;
    iconColor?: string; // e.g. 'bg-gray-400'
}

interface FeedProps {
    items: FeedItem[];
    className?: string;
}

export default function Feed({ items, className }: FeedProps) {
    return (
        <div className={cn("flow-root", className)}>
            <ul role="list" className="-mb-8">
                {items.map((item, itemIdx) => (
                    <li key={item.id}>
                        <div className="relative pb-8">
                            {itemIdx !== items.length - 1 ? (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span
                                        className={cn(
                                            item.iconColor || 'bg-gray-400',
                                            'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900'
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.content}
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                        <time dateTime={item.datetime}>{item.date}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
