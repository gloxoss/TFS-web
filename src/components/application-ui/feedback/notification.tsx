"use client";

import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from "@/lib/utils";

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  show: boolean;
  setShow: (show: boolean) => void;
  title: string;
  message?: string;
  type?: NotificationType;
  autoClose?: boolean;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-blue-400"
}

export default function Notification({ 
    show, 
    setShow, 
    title, 
    message, 
    type = 'success', 
    autoClose = true,
    duration = 4000 
}: NotificationProps) {
  const Icon = icons[type];
  const iconColor = colors[type];

  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        setShow(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, setShow]);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white ring-1 shadow-lg ring-black/5 dark:bg-gray-800 dark:ring-gray-700">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className={cn("h-6 w-6", iconColor)} aria-hidden="true" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
                  {message && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
                  )}
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}
