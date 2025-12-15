// app/[lng]/(auth)/dashboard/page.tsx
/**
 * User Dashboard Page
 * 
 * Server component that renders the dashboard layout.
 * Actual content is handled by DashboardPageClient with client-side data fetching.
 * 
 * Design Archetype: Dark Cinema / Professional Rental
 */

import { DashboardPageClient } from './page-client-new'

export const metadata = {
  title: 'Dashboard | Cinema Equipment Rental',
  description: 'Manage your rental requests and account',
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lng: string }>
}) {
  const { lng } = await params

  return (
    <main className="min-h-screen bg-zinc-950">
      <DashboardPageClient lng={lng} />
    </main>
  )
}