import { AlertTriangle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AlertProps {
  title: string;
  description?: string;
  variant?: 'warning' | 'error' | 'success' | 'info';
  className?: string;
}

const variantStyles = {
    warning: {
        bg: "bg-yellow-50",
        icon: "text-yellow-400",
        title: "text-yellow-800",
        text: "text-yellow-700"
    },
    error: {
        bg: "bg-red-50",
        icon: "text-red-400",
        title: "text-red-800",
        text: "text-red-700"
    },
    success: {
        bg: "bg-green-50",
        icon: "text-green-400",
        title: "text-green-800",
        text: "text-green-700"
    },
    info: {
        bg: "bg-blue-50",
        icon: "text-blue-400",
        title: "text-blue-800",
        text: "text-blue-700"
    }
}

export default function Alert({ title, description, variant = 'warning', className }: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn("rounded-md p-4", styles.bg, className)}>
      <div className="flex">
        <div className="shrink-0">
          <AlertTriangle aria-hidden="true" className={cn("size-5", styles.icon)} />
        </div>
        <div className="ml-3">
          <h3 className={cn("text-sm font-medium", styles.title)}>{title}</h3>
          {description && (
             <div className={cn("mt-2 text-sm", styles.text)}>
                <p>{description}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
