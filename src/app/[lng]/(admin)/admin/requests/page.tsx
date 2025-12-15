import { getAdminRentalRequests } from '@/lib/actions/admin-requests';
import RequestsTable from '@/components/admin/requests-table';
import { Suspense } from 'react';

export default async function AdminRequestsPage({
    params
}: {
    params: Promise<{ lng: string }>
}) {
    const { lng } = await params;

    // Fetch data directly in Server Component
    // In a real app, handle searchParams for pagination
    const { items: requests } = await getAdminRentalRequests(1, 100);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white tracking-tight">Rental Requests</h1>
                <div className="flex gap-2">
                    {/* Placeholder for future filters */}
                    <span className="text-xs text-zinc-500 self-end">Showing recent requests</span>
                </div>
            </div>

            <RequestsTable requests={requests} lng={lng} />
        </div>
    );
}
