"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogBackdrop,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { Search, FolderPlus, FilePlus, Hash, Tag, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface CommandItem {
    id: string | number;
    name: string;
    url?: string;
    shortcut?: string;
    icon?: React.ElementType;
    onClick?: () => void;
    group?: string;
}

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  navigation: CommandItem[];
  placeholder?: string;
}

export default function CommandPalette({ open, setOpen, navigation, placeholder = "Search..." }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Reset query when closed
  useEffect(() => {
    if (!open) {
        setQuery('');
    }
  }, [open]);

  const filteredItems =
    query === ''
      ? []
      : navigation.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase())
        });
  
  // Group logic could be added here if navigation has 'group' property

  return (
    <Transition show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/25 transition-opacity dark:bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all dark:bg-gray-900 dark:divide-gray-800 dark:ring-gray-700">
              <Combobox
                onChange={(item: CommandItem) => {
                  if (item?.url) {
                    window.location.href = item.url; // Or Next.js router push
                  } else if (item?.onClick) {
                    item.onClick();
                  }
                  setOpen(false);
                }}
              >
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                    aria-hidden="true"
                  />
                  <ComboboxInput
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm dark:text-white dark:placeholder:text-gray-500"
                    placeholder={placeholder}
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(item: CommandItem) => item?.name}
                  />
                </div>

                {(query === '' || filteredItems.length > 0) && (
                  <ComboboxOptions static className="max-h-80 scroll-py-2 divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
                    <li className="p-2">
                        {query === '' && (
                            <h2 className="mb-2 mt-4 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                Suggested
                            </h2>
                        )}
                         {/* Show filtered if searching, or recent/all if not (simplified logic for now) */}
                         <ul className="text-sm text-gray-700 dark:text-gray-200">
                             {(query === '' ? navigation.slice(0, 5) : filteredItems).map((item) => (
                                <ComboboxOption
                                    key={item.id}
                                    value={item}
                                    className={({ focus }) =>
                                    cn(
                                        "group flex cursor-default select-none items-center rounded-md px-3 py-2",
                                        focus ? "bg-indigo-600 text-white" : "text-gray-900 dark:text-gray-200"
                                    )
                                    }
                                >
                                    {({ focus }) => (
                                    <>
                                        {item.icon ? (
                                            <item.icon
                                                className={cn(
                                                    "h-6 w-6 flex-none",
                                                    focus ? "text-white" : "text-gray-400 dark:text-gray-500"
                                                )}
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <FolderPlus className={cn("h-6 w-6 flex-none", focus ? "text-white" : "text-gray-400")} />
                                        )}
                                        <span className="ml-3 flex-auto truncate">{item.name}</span>
                                        {item.shortcut && (
                                            <span className={cn(
                                                "ml-3 flex-none text-xs font-semibold",
                                                focus ? "text-indigo-100" : "text-gray-400"
                                            )}>
                                                <kbd className="font-sans">⌘</kbd>
                                                <kbd className="font-sans">{item.shortcut}</kbd>
                                            </span>
                                        )}
                                    </>
                                    )}
                                </ComboboxOption>
                             ))}
                         </ul>
                    </li>
                  </ComboboxOptions>
                )}

                {query !== '' && filteredItems.length === 0 && (
                  <div className="px-6 py-14 text-center sm:px-14">
                    <AlertCircle className="mx-auto h-6 w-6 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                    <p className="mt-4 text-sm text-gray-900 dark:text-gray-200">
                      We couldn't find any items showing "{query}".
                    </p>
                  </div>
                )}
              </Combobox>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
