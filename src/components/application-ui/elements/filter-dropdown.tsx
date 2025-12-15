"use client";

import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterOption {
    value: string;
    label: string;
    checked: boolean;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    onChange: (value: string, checked: boolean) => void;
    className?: string;
}

export default function FilterDropdown({ label, options, onChange, className }: FilterDropdownProps) {
    return (
        <Popover as="div" className={cn("relative inline-block text-left", className)}>
            <PopoverButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                {label}
                <ChevronDown
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500"
                    aria-hidden="true"
                />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <PopoverPanel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-white/10">
                    <form className="space-y-4">
                        {options.map((option, optionIdx) => (
                            <div key={option.value} className="flex items-center">
                                <input
                                    id={`filter-${option.value}-${optionIdx}`}
                                    name={`${option.value}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    onChange={(e) => onChange(option.value, e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-white/5 dark:border-white/10 dark:focus:ring-offset-gray-900"
                                />
                                <label
                                    htmlFor={`filter-${option.value}-${optionIdx}`}
                                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900 dark:text-gray-200"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </form>
                </PopoverPanel>
            </Transition>
        </Popover>
    )
}
