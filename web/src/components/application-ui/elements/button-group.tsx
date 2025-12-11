import { cn } from "@/lib/utils";

interface ButtonGroupItem {
  id: string | number;
  label: string;
}

interface ButtonGroupProps {
  items: ButtonGroupItem[];
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
}

export default function ButtonGroup({ items, value, onChange, className }: ButtonGroupProps) {
  return (
    <span className={cn("isolate inline-flex rounded-md shadow-sm", className)}>
      {items.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "relative inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset focus:z-10",
            // Borders based on position
            idx === 0 ? "rounded-l-md" : "-ml-px",
            idx === items.length - 1 ? "rounded-r-md" : "",
            // Active state
            item.id === value
              ? "bg-indigo-600 text-white ring-indigo-600 hover:bg-indigo-500"
              : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700"
          )}
        >
          {item.label}
        </button>
      ))}
    </span>
  )
}
