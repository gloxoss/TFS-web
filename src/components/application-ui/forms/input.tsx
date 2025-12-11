import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  className, 
  label, 
  error, 
  helpText,
  id,
  type = "text",
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
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-indigo-500",
            error && "ring-red-300 focus:ring-red-500 text-red-900 placeholder:text-red-300",
            className
          )}
          {...props}
        />
        {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-red-500 font-bold">!</span>
            </div>
        )}
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

Input.displayName = "Input";

export default Input;
