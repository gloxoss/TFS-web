/**
 * CartDrawer Wrapper
 * 
 * Client component wrapper for CartDrawer to be used in server layouts.
 */
'use client'

import { CartDrawer } from '@/components/cart/CartDrawer'

interface CartDrawerWrapperProps {
  lng: string
}

export function CartDrawerWrapper({ lng }: CartDrawerWrapperProps) {
  return <CartDrawer lng={lng} />
}
