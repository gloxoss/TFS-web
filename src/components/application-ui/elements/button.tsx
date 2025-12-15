import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'soft' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors";
  
  const variantStyles = {
    primary: "bg-indigo-600 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-indigo-600",
    secondary: "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    soft: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    outline: "bg-transparent text-indigo-600 ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
  };

  const sizeStyles = {
    xs: "rounded px-2 py-1 text-xs",
    sm: "rounded-sm px-2 py-1 text-sm", // Matching the source specifically
    md: "rounded-md px-2.5 py-1.5 text-sm",
    lg: "rounded-md px-3 py-2 text-sm",
    xl: "rounded-md px-3.5 py-2.5 text-sm",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    />
  );
});

Button.displayName = "Button";

export default Button;
