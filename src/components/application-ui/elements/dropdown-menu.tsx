"use client";

import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link';

export interface DropdownMenuItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
    disabled?: boolean;
}

export interface DropdownSection {
    id: string | number;
    title?: string; // Optional section header
    items: DropdownMenuItem[];
}

interface DropdownMenuProps {
    label: React.ReactNode;
    sections: DropdownSection[];
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // To style the button trigger
    className?: string;
    menuClassName?: string;
}

export default function DropdownMenu({ label, sections, icon: Icon, variant = 'secondary', className, menuClassName }: DropdownMenuProps) {

    // Basic button styles reuse
    const buttonStyles = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm",
        secondary: "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 shadow-sm dark:bg-white/5 dark:text-white dark:ring-white/10 dark:hover:bg-white/10",
        outline: "bg-transparent text-indigo-600 ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50",
        ghost: "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
    };

    return (
        <Menu as="div" className={cn("relative inline-block text-left", className)}>
            <div>
                <MenuButton className={cn("inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold", buttonStyles[variant])}>
                    {Icon && <Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />}
                    {label}
                    <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </MenuButton>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className={cn("absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:divide-gray-700 dark:ring-white/10", menuClassName)}>

                    {sections.map((section) => (
                        <div key={section.id} className="py-1">
                            {section.title && <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">{section.title}</div>}
                            {section.items.map((item, idx) => (
                                <MenuItem key={`${section.id}-${idx}`} disabled={item.disabled}>
                                    {({ active, disabled }) => {
                                        const ItemIcon = item.icon;
                                        const content = (
                                            <>
                                                {ItemIcon && <ItemIcon className={cn("mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500", active ? "text-gray-500" : "")} aria-hidden="true" />}
                                                {item.label}
                                            </>
                                        );

                                        const classes = cn(
                                            active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300',
                                            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                                            'group flex items-center px-4 py-2 text-sm'
                                        );

                                        if (item.href) {
                                            return <Link href={item.href} className={classes}>{content}</Link>
                                        }
                                        return <div onClick={item.onClick} className={classes}>{content}</div>
                                    }}
                                </MenuItem>
                            ))}
                        </div>
                    ))}

                </MenuItems>
            </Transition>
        </Menu>
    )
}
