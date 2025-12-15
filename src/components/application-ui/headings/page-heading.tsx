import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface MetaItem {
    text: string;
    icon?: React.ElementType;
}

interface ActionItem {
    label: string;
    onClick?: () => void;
    href?: string;
    primary?: boolean;
    icon?: React.ElementType;
}

interface PageHeadingProps {
  title: string;
  meta?: MetaItem[];
  actions?: ActionItem[];
  className?: string;
}

export default function PageHeading({ title, meta, actions, className }: PageHeadingProps) {
  return (
    <div className={cn("lg:flex lg:items-center lg:justify-between mb-8", className)}>
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white pb-1">
          {title}
        </h2>
        {meta && (
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                {meta.map((item, idx) => (
                    <div key={idx} className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {item.icon && (
                            <item.icon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                        )}
                        {item.text}
                    </div>
                ))}
            </div>
        )}
      </div>
      
      {actions && (
        <div className="mt-5 flex lg:ml-4 lg:mt-0 gap-3">
             {actions.map((action, idx) => {
                 const baseClasses = "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
                 const primaryClasses = "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600";
                 const secondaryClasses = "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-700";

                 const classes = cn(baseClasses, action.primary ? primaryClasses : secondaryClasses);
                 
                 const content = (
                     <>
                        {action.icon && <action.icon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />}
                        {action.label}
                     </>
                 );

                 if (action.href) {
                     return (
                         <Link key={idx} href={action.href} className={classes}>
                             {content}
                         </Link>
                     )
                 }

                 return (
                     <button key={idx} type="button" onClick={action.onClick} className={classes}>
                         {content}
                     </button>
                 )
             })}
        </div>
      )}
    </div>
  )
}
