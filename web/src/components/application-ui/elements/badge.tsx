import { cn } from "@/lib/utils";

type BadgeColor = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  className?: string; // For adding dots or other styles if needed manually
}

const colorStyles: Record<BadgeColor, string> = {
  gray: "bg-gray-400/10 text-gray-400 ring-gray-400/20",
  red: "bg-red-400/10 text-red-400 ring-red-400/20",
  yellow: "bg-yellow-400/10 text-yellow-500 ring-yellow-400/20",
  green: "bg-green-500/10 text-green-400 ring-green-500/20",
  blue: "bg-blue-400/10 text-blue-400 ring-blue-400/30",
  indigo: "bg-indigo-400/10 text-indigo-400 ring-indigo-400/30",
  purple: "bg-purple-400/10 text-purple-400 ring-purple-400/30",
  pink: "bg-pink-400/10 text-pink-400 ring-pink-400/20",
};

export default function Badge({ label, color = 'gray', className }: BadgeProps) {
  return (
    <span className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        colorStyles[color],
        className
    )}>
      {label}
    </span>
  )
}
