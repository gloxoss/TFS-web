import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from "@/lib/utils";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  wrapperClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ 
  className, 
  label, 
  description, 
  id,
  wrapperClassName,
  ...props 
}, ref) => {
    const inputId = id || props.name;

  return (
    <div className={cn("relative flex items-start", wrapperClassName)}>
      <div className="flex h-6 items-center">
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900",
            className
          )}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm leading-6">
            {label && (
                <label htmlFor={inputId} className="font-medium text-gray-900 dark:text-gray-200">
                    {label}
                </label>
            )}
            {description && (
                <p className="text-gray-500 dark:text-gray-400">{description}</p>
            )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
