import { getRequestDetails } from '@/lib/actions/admin-requests';
import RequestDetailView from '@/components/admin/request-detail-view';
import { notFound } from 'next/navigation';

export default async function RequestDetailsPage({
    params
}: {
    params: Promise<{ lng: string; id: string }>
}) {
    const { lng, id } = await params;

    const request = await getRequestDetails(id);

    if (!request) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Request #{request.id.slice(0, 8).toUpperCase()}
                </h1>
            </div>

            <RequestDetailView request={request} lng={lng} />
        </div>
    );
}
