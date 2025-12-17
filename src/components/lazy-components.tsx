'use client';

import dynamic from 'next/dynamic';

const ChatWidget = dynamic(
    () => import('@/components/chat').then((mod) => mod.ChatWidget),
    { ssr: false }
);

const CartDrawerWrapper = dynamic(
    () => import('@/components/cart/CartDrawerWrapper').then((mod) => mod.CartDrawerWrapper),
    { ssr: false }
);

export function LazyComponents({ lng }: { lng: string }) {
    return (
        <>
            <CartDrawerWrapper lng={lng} />
            <ChatWidget />
        </>
    );
}
