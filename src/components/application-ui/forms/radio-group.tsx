"use client";

import { RadioGroup as HeadlessRadioGroup, Radio, Label, Field, Description } from '@headlessui/react'
import { cn } from "@/lib/utils";

interface RadioOption {
  id: string | number;
  title: string;
  description?: string;
}

interface RadioGroupProps<T extends RadioOption> {
  label?: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function RadioGroup<T extends RadioOption>({ label, options, value, onChange, className }: RadioGroupProps<T>) {
  return (
    <div className={className}>
      {label && <div className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 mb-2">{label}</div>}
      <HeadlessRadioGroup value={value} onChange={onChange} className="space-y-4">
        {options.map((option) => (
          <Field key={option.id} className="flex items-center">
            <Radio
              value={option}
              className={({ checked }) => {
                 return cn(
                    checked ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
                    'relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                  )
              }}
            >
               {({ checked }) => (
                  <span className={cn(checked ? 'bg-white' : '', 'h-1.5 w-1.5 rounded-full')} />
               )}
            </Radio>
            <div className="ml-3 block">
               <Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 cursor-pointer">
                 {option.title}
               </Label>
               {option.description && (
                   <Description className="text-sm text-gray-500 dark:text-gray-400">
                     {option.description}
                   </Description>
               )}
            </div>
          </Field>
        ))}
      </HeadlessRadioGroup>
    </div>
  )
}
