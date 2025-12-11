import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  position?: 'center' | 'left';
  className?: string;
}

export default function Divider({ label, position = 'center', className }: DividerProps) {
  return (
    <div className={cn("relative py-4", className)}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
      </div>
      {label && (
        <div className={cn(
            "relative flex",
            position === 'center' ? "justify-center" : "justify-start"
        )}>
            <span className={cn(
                "bg-white px-2 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400",
                position === 'left' ? "pr-2" : "px-2"
            )}>
                {label}
            </span>
        </div>
      )}
    </div>
  )
}
