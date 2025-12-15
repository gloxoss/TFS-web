import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This function ensures that if we pass "bg-red-500" and then "bg-blue-500", 
// the blue one wins without conflicts. Essential for reusable components.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
