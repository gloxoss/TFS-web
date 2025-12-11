import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActionPanelProps {
  title: string;
  description: string;
  action: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export default function ActionPanel({ title, description, action, className }: ActionPanelProps) {
  return (
    <div className={cn("bg-white shadow sm:rounded-lg dark:bg-gray-900 dark:border dark:border-gray-800", className)}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">{title}</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          <p>{description}</p>
        </div>
        <div className="mt-5">
           {action.href ? (
             <Link
                href={action.href}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
             >
                {action.label}
             </Link>
           ) : (
            <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
                {action.label}
            </button>
           )}
        </div>
      </div>
    </div>
  )
}
