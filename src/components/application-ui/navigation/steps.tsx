import { cn } from "@/lib/utils";
import Link from "next/link";
import { Check } from "lucide-react";

export interface Step {
  id: string | number;
  name: string;
  href?: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepsProps {
  steps: Step[];
  className?: string;
  onStepClick?: (step: Step) => void;
}

export default function Steps({ steps, className, onStepClick }: StepsProps) {
  return (
    <nav aria-label="Progress" className={cn(className)}>
      <ol role="list" className="overflow-hidden rounded-md bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 lg:flex lg:rounded-none lg:border-0 lg:border-r lg:border-l lg:border-gray-200 lg:dark:border-gray-700">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative overflow-hidden lg:flex-1">
            <div className={cn(
                "border border-gray-200 overflow-hidden lg:border-0",
                stepIdx === 0 ? "rounded-t-md border-b-0 lg:rounded-none" : "",
                stepIdx === steps.length - 1 ? "rounded-b-md border-t-0 lg:rounded-none" : ""
            )}>
              {/* Button or Link wrapper */}
              <button
                onClick={(e) => {
                    if (onStepClick) {
                        e.preventDefault();
                        onStepClick(step);
                    }
                    if (!step.href) e.preventDefault();
                }}
                className={cn(
                    "group flex w-full items-center",
                    step.href || onStepClick ? "cursor-pointer" : "cursor-default"
                )}
              >
                  <span
                    className={cn(
                      "absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                      step.status === 'current' ? "bg-indigo-600 dark:bg-indigo-500" : "",
                      step.status === 'complete' ? "bg-indigo-600 dark:bg-indigo-500" : "bg-transparent"
                    )}
                    aria-hidden="true"
                  />
                  <span className={cn(
                      "flex items-start px-6 py-5 text-sm font-medium lg:pl-9",
                      stepIdx !== 0 ? "lg:pl-9" : ""
                  )}>
                    <span className="flex-shrink-0">
                      {step.status === 'complete' ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                          <Check className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      ) : step.status === 'current' ? (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                          <span className="text-indigo-600 dark:text-indigo-400">{String(step.id).padStart(2, '0')}</span>
                        </span>
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600">
                          <span className="text-gray-500 dark:text-gray-400">{String(step.id).padStart(2, '0')}</span>
                        </span>
                      )}
                    </span>
                    <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span className={cn("text-xs font-semibold uppercase tracking-wide", step.status === 'current' ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400")}>
                         {step.status === 'complete' ? 'Completed' : step.status === 'current' ? 'Current' : 'Upcoming'}
                       </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{step.name}</span>
                    </span>
                  </span>
                </button>
              
                {stepIdx !== 0 ? (
                  <>
                    {/* Separator for LG screens */}
                    <div className="hidden lg:block absolute inset-0 left-0 top-0 hidden w-3 lg:block" aria-hidden="true">
                      <svg
                        className="h-full w-full text-gray-300 dark:text-gray-600"
                        viewBox="0 0 12 82"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        <path d="M0.5 0V31L10.5 41L0.5 51V82" vectorEffect="non-scaling-stroke" stroke="currentcolor" />
                      </svg>
                    </div>
                  </>
                ) : null}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
