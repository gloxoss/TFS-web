/**
 * Equipment Catalog Page (Server Component)
 * 
 * Server-side data fetching for initial products and categories.
 * Passes data to client component for interactive filtering.
 */

import { productService } from '@/services'
import { EquipmentCatalogClient } from './equipment-client'

interface EquipmentPageProps {
  params: Promise<{ lng: string }>
  searchParams: Promise<{ 
    category?: string
    search?: string
    page?: string 
  }>
}

export default async function EquipmentPage({ params, searchParams }: EquipmentPageProps) {
  const { lng } = await params
  const { category, search, page } = await searchParams

  // Fetch initial data server-side
  const [productsResult, categories] = await Promise.all([
    productService().getProducts(
      { 
        categorySlug: category || undefined,
        search: search || undefined,
      },
      parseInt(page || '1', 10),
      12
    ),
    productService().getCategories(),
  ])

  return (
    <EquipmentCatalogClient
      lng={lng}
      initialProducts={productsResult.items}
      initialPagination={{
        page: productsResult.page,
        totalPages: productsResult.totalPages,
        totalItems: productsResult.totalItems,
      }}
      categories={categories}
      initialCategory={category || null}
      initialSearch={search || ''}
    />
  )
}

export async function generateMetadata({ params }: EquipmentPageProps) {
  const { lng } = await params
  
  const titles: Record<string, string> = {
    en: 'Equipment Catalog | TFS Cinema Rental',
    fr: 'Catalogue d\'équipement | TFS Location Cinéma',
  }
  
  const descriptions: Record<string, string> = {
    en: 'Browse our professional cinema equipment catalog. Cameras, lenses, lighting, and more available for rent.',
    fr: 'Parcourez notre catalogue d\'équipement cinéma professionnel. Caméras, objectifs, éclairage et plus disponibles à la location.',
  }

  return {
    title: titles[lng] || titles.en,
    description: descriptions[lng] || descriptions.en,
  }
}
