/**
 * Design Playground Page (Server Component)
 */

import { productService } from '@/services'
import { DesignPlaygroundClient } from './design-client'

interface DesignPlaygroundPageProps {
    params: Promise<{ lng: string }>
}

export default async function DesignPlaygroundPage({ params }: DesignPlaygroundPageProps) {
    const { lng } = await params

    // Fetch data
    const [productsResult, categories] = await Promise.all([
        productService().getProducts({}, 1, 100), // Fetch more products for demo
        productService().getCategories(),
    ])

    return (
        <DesignPlaygroundClient
            lng={lng}
            products={productsResult.items}
            categories={categories}
        />
    )
}
