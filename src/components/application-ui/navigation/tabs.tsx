import Link from "next/link";
import { cn } from "@/lib/utils";

interface Tab {
  name: string;
  href: string;
  current: boolean;
}

interface TabsProps {
  tabs: Tab[];
  className?: string; // For container style
}

export default function Tabs({ tabs, className }: TabsProps) {
  return (
    <div className={cn(className)}>
      {/* Mobile Selector */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          defaultValue={tabs.find((tab) => tab.current)?.name}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      
      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                aria-current={tab.current ? 'page' : undefined}
                className={cn(
                  tab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap'
                )}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
