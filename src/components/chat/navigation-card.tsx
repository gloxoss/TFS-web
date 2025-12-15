/**
 * Navigation Card Component
 * 
 * A high-visibility navigation button rendered by the AI when users
 * want to navigate to a specific page in the site.
 */

'use client'

import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/react'
import { ArrowRight, ShoppingCart, Camera, FileText, User, LogIn } from 'lucide-react'

export interface NavigationCardData {
    path: string
    label: string
    type?: string
}

interface NavigationCardProps {
    data: NavigationCardData
    onNavigate?: () => void // Optional callback when navigation happens
}

// Map paths to icons
function getIconForPath(path: string) {
    if (path.includes('cart')) return ShoppingCart
    if (path.includes('equipment')) return Camera
    if (path.includes('quote')) return FileText
    if (path.includes('login')) return LogIn
    if (path.includes('dashboard') || path.includes('account')) return User
    return ArrowRight
}

export function NavigationCard({ data, onNavigate }: NavigationCardProps) {
    const router = useRouter()
    const params = useParams()
    const lng = (params?.lng as string) || 'en'

    const handleClick = () => {
        // Prepend language to path if not already present
        let targetPath = data.path
        if (!targetPath.startsWith(`/${lng}`)) {
            targetPath = `/${lng}${targetPath.startsWith('/') ? '' : '/'}${targetPath}`
        }

        // Navigate to the page
        router.push(targetPath)

        // Optional callback (e.g., to close the chat)
        onNavigate?.()
    }

    const Icon = getIconForPath(data.path)

    return (
        <div className="my-3">
            <Button
                className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                radius="lg"
                size="lg"
                onPress={handleClick}
                endContent={<Icon className="w-5 h-5" />}
            >
                {data.label}
            </Button>
        </div>
    )
}
