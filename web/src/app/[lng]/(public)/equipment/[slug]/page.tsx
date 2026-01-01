/**
 * Product Detail Page (Server Component)
 * 
 * Server-side data fetching for product details.
 * Passes data to client component for add-to-cart functionality.
 * 
 * Includes retry logic to handle cold-start / connection issues.
 */

import { notFound } from 'next/navigation'
import { productService } from '@/services'
import { ProductDetailClient } from './product-detail-client'

interface ProductDetailPageProps {
  params: Promise<{
    lng: string
    slug: string
  }>
}

// Disable caching for dynamic product pages to ensure fresh data
// Enable ISR with 60-second revalidation
// This allows the page to be cached but updated frequently enough for content changes
export const revalidate = 60
export const dynamicParams = true // Allow generating pages for unknown slugs on demand

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { lng, slug } = await params

  // Product service now has built-in retry logic
  const product = await productService().getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} lng={lng} />
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { lng, slug } = await params
  const product = await productService().getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | TFS Cinema Rental`,
    description: product.description || `Rent ${product.name} for your next production. Professional cinema equipment available at competitive daily rates.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  }
}
