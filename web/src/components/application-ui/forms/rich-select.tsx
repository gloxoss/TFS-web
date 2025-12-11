"use client";

import { Fragment, useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { Check, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RichSelectOption {
    id: string | number;
    name: string;
    avatar?: string;
    secondaryText?: string;
}

interface RichSelectProps {
    label?: string;
    options: RichSelectOption[];
    value: RichSelectOption;
    onChange: (value: RichSelectOption) => void;
    className?: string;
}

export default function RichSelect({ label, options, value, onChange, className }: RichSelectProps) {
    return (
        <Listbox value={value} onChange={onChange}>
            {({ open }) => (
                <div className={cn("w-full", className)}>
                    {label && <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 mb-2">{label}</Listbox.Label>}
                    <div className="relative mt-2">
                        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-indigo-500">
                            <span className="flex items-center">
                                {value.avatar && <img src={value.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />}
                                <span className={cn(value.avatar ? 'ml-3' : '', "block truncate")}>{value.name}</span>
                                {value.secondaryText && <span className="ml-2 truncate text-gray-500 dark:text-gray-400">{value.secondaryText}</span>}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </ListboxButton>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-800 dark:ring-white/10">
                                {options.map((option) => (
                                    <ListboxOption
                                        key={option.id}
                                        className={({ active }) =>
                                            cn(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900 dark:text-white',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={option}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {option.avatar && <img src={option.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />}
                                                    <span className={cn(selected ? 'font-semibold' : 'font-normal', option.avatar ? 'ml-3' : '', 'block truncate')}>
                                                        {option.name}
                                                    </span>
                                                    {option.secondaryText && (
                                                        <span className={cn(active ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400', 'ml-2 truncate')}>
                                                            {option.secondaryText}
                                                        </span>
                                                    )}
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={cn(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                        <Check className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </div>
            )}
        </Listbox>
    )
}
