"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
}

interface DropdownProps {
  label?: string | React.ReactNode;
  items: DropdownItem[];
  className?: string; // wrapper class
}

export default function Dropdown({ label = "Options", items, className }: DropdownProps) {
  return (
    <Menu as="div" className={cn("relative inline-block text-left", className)}>
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700">
          {label}
          <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-800 dark:ring-gray-700"
      >
        <div className="py-1">
          {items.map((item, index) => (
             <MenuItem key={index}>
                {({ focus }) => {
                     const Element = item.href ? Link : 'button';
                     const elementProps = item.href ? { href: item.href } : { onClick: item.onClick, type: 'button' as const };
                     const content = (
                        <>
                             {item.icon && <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />}
                             {item.label}
                        </>
                     );

                     // Type assertion workaround for dynamic component props in TS
                     return (
                         // @ts-ignore
                         <Element
                            {...elementProps}
                             className={cn(
                                 focus ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300',
                                 'group flex w-full items-center px-4 py-2 text-sm'
                             )}
                         >
                             {content}
                         </Element>
                     )
                }}
             </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}
