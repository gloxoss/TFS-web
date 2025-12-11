import { cn } from "@/lib/utils";
import { FolderPlus } from "lucide-react"; 

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ElementType; // allows overriding the icon
  className?: string; 
}

export default function EmptyState({ 
    title, 
    description, 
    action, 
    icon: Icon = FolderPlus,
    className 
}: EmptyStateProps) {
  return (
    <div className={cn(
        "relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-700 dark:hover:border-gray-600",
        className
    )}>
      <Icon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      
      {action && (
          <div className="mt-6">
            <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                {action.label}
            </button>
          </div>
      )}
    </div>
  )
}
