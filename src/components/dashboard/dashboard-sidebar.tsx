"use client";

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import {
    X,
    Home,
    FileText,
    ClipboardList,
    User,
    Settings,
    LogOut,
    Menu,
    LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { ROLES } from '@/types/auth';

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface DashboardSidebarProps {
    children: React.ReactNode;
    lng: string;
}

export default function DashboardSidebar({
    children,
    lng
}: DashboardSidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);

    const logout = () => {
        // Create a form to submit the logout action
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout'; // We'll need a route handler for this
        document.body.appendChild(form);
        form.submit();
    };

    const navigation: NavigationItem[] = [
        { name: 'Dashboard', href: `/${lng}/dashboard`, icon: Home },
        // Placeholder links until User Views are built
        // { name: 'Quotes', href: `/${lng}/dashboard/quotes`, icon: FileText },
        // { name: 'Requests', href: `/${lng}/dashboard/requests`, icon: ClipboardList },
        { name: 'Profile', href: `/${lng}/dashboard/profile`, icon: User },
        { name: 'Settings', href: `/${lng}/dashboard/settings`, icon: Settings },
    ];

    // Conditionally add Admin Link
    // We check if the custom 'role' field is set to 'admin'
    // This assumes the user record has this field populated correctly.
    if (user && (user as any).role === ROLES.ADMIN) {
        navigation.push({ name: 'Admin Operations', href: `/${lng}/admin/requests`, icon: ClipboardList });
    }

    const isCurrent = (href: string) => {
        if (href === `/${lng}/dashboard` && pathname === href) return true;
        if (href !== `/${lng}/dashboard` && pathname?.startsWith(href)) return true;
        return false;
    };

    return (
        <div>
            {/* Mobile Sidebar Dialog */}
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                    <span className="sr-only">Close sidebar</span>
                                    <X aria-hidden="true" className="size-6 text-white" />
                                </button>
                            </div>
                        </TransitionChild>

                        {/* Mobile Sidebar Content */}
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                            <div className="flex h-16 shrink-0 items-center">
                                <span className="text-xl font-bold text-white tracking-widest">ZOUSKYM</span>
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul role="list" className="-mx-2 space-y-1">
                                            {navigation.map((item) => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            isCurrent(item.href)
                                                                ? 'bg-gray-800 text-white'
                                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                        )}
                                                    >
                                                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>

                                    <li className="-mx-6 mt-auto">
                                        <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                                            {/* Avatar Placeholder */}
                                            <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="sr-only">Your profile</span>
                                            <div className="flex flex-col">
                                                <span aria-hidden="true">{user?.email || 'User'}</span>
                                                <button onClick={logout} className="text-xs text-gray-400 text-left hover:text-white">Sign out</button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                    <div className="flex h-16 shrink-0 items-center">
                        <span className="text-xl font-bold text-white tracking-widest">ZOUSKYM</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    isCurrent(item.href)
                                                        ? 'bg-gray-800 text-white'
                                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                )}
                                            >
                                                <item.icon aria-hidden="true" className="size-6 shrink-0" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="-mx-6 mt-auto">
                                <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                                    <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="sr-only">Your profile</span>
                                    <div className="flex flex-col overflow-hidden">
                                        <span aria-hidden="true" className="truncate w-full">{user?.email || 'User'}</span>
                                        <button onClick={logout} className="text-xs text-gray-400 text-left hover:text-white flex items-center gap-1">
                                            <LogOut className="size-3" /> Sign out
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Top bar mobile */}
            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
                <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-400 lg:hidden">
                    <span className="sr-only">Open sidebar</span>
                    <Menu aria-hidden="true" className="size-6" />
                </button>
                <div className="flex-1 text-sm/6 font-semibold text-white">Dashboard</div>
                <Link href={`/${lng}/dashboard/profile`}>
                    <span className="sr-only">Your profile</span>
                    <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </Link>
            </div>

            {/* Main Content Area */}
            <main className="py-10 lg:pl-72">
                <div className="px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
