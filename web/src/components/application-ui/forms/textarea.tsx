import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
  className, 
  label, 
  error, 
  helpText,
  id,
  rows = 4,
  ...props 
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className={cn("relative", label && "mt-2")}>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500",
            error && "ring-red-300 focus:ring-red-500 text-red-900 placeholder:text-red-300"
          )}
          {...props}
        />
      </div>
      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400" id={`${inputId}-description`}>
          {helpText}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
