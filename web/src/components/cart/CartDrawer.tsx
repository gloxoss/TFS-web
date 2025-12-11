/**
 * CartDrawer Component
 * 
 * Slide-over drawer showing cart items with editing and checkout CTA.
 * Uses Headless UI Dialog for accessibility.
 * 
 * Design Archetype: Dark Cinema
 */
'use client'

import { Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCartStore, useUIStore } from '@/stores'
import { CartItemComponent } from './CartItem'
import { CartSummary } from './CartSummary'
import { cn } from '@/lib/utils'

interface CartDrawerProps {
  lng: string
}

export function CartDrawer({ lng }: CartDrawerProps) {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  
  const isOpen = useUIStore((state) => state.cartDrawerOpen)
  const closeDrawer = useUIStore((state) => state.closeCartDrawer)

  const isEmpty = items.length === 0

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={closeDrawer} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        {/* Drawer Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="w-screen max-w-md">
                  <div className="flex h-full flex-col bg-zinc-950 border-l border-zinc-800 shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
                      <DialogTitle className="text-lg font-semibold text-white flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-zinc-400" />
                        Quote Request
                        {!isEmpty && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-zinc-800 text-zinc-300 rounded-full">
                            {items.length}
                          </span>
                        )}
                      </DialogTitle>
                      <button
                        onClick={closeDrawer}
                        className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {isEmpty ? (
                        <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                          <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-zinc-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-zinc-300 mb-1">
                            Your cart is empty
                          </h3>
                          <p className="text-zinc-500 text-sm mb-6">
                            Browse our equipment catalog and add items to your quote request.
                          </p>
                          <Link
                            href={`/${lng}/equipment`}
                            onClick={closeDrawer}
                            className="px-4 py-2 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                          >
                            Browse Equipment
                          </Link>
                        </div>
                      ) : (
                        <div className="px-4 divide-y divide-zinc-800">
                          {items.map((item) => (
                            <CartItemComponent
                              key={item.id}
                              item={item}
                              lng={lng}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {!isEmpty && (
                      <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
                        <CartSummary />

                        <div className="space-y-2">
                          <Link
                            href={`/${lng}/quote`}
                            onClick={closeDrawer}
                            className={cn(
                              'w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg font-semibold',
                              'bg-white text-zinc-900 hover:bg-zinc-200 transition-colors'
                            )}
                          >
                            Continue to Quote
                            <ArrowRight className="w-4 h-4" />
                          </Link>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/${lng}/cart`}
                              onClick={closeDrawer}
                              className="flex-1 py-2 px-3 text-sm text-center text-zinc-400 hover:text-white transition-colors"
                            >
                              View Full Cart
                            </Link>
                            <button
                              onClick={() => {
                                clearCart()
                                closeDrawer()
                              }}
                              className="py-2 px-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
