"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Option {
  id: string | number;
  name: string;
}

interface SelectProps<T extends Option> {
  label?: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function Select<T extends Option>({ 
  label, 
  options, 
  value, 
  onChange, 
  className 
}: SelectProps<T>) {
  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            {label && (
              <Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                {label}
              </Label>
            )}
            <div className={cn("relative", label && "mt-2")}>
              <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500">
                <span className="block truncate">{value.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>

              <ListboxOptions
                transition
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm dark:bg-gray-800 dark:ring-gray-700"
              >
                {options.map((option) => (
                  <ListboxOption
                    key={option.id}
                    value={option}
                    className={({ focus, selected }) =>
                      cn(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        focus ? "bg-indigo-600 text-white" : "text-gray-900 dark:text-gray-200",
                        !focus && selected && "font-semibold"
                      )
                    }
                  >
                    {({ selected, focus }) => (
                      <>
                        <span className={cn("block truncate", selected ? "font-semibold" : "font-normal")}>
                          {option.name}
                        </span>

                        {selected ? (
                          <span
                            className={cn(
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                              focus ? "text-white" : "text-indigo-600"
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
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
