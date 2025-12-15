
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lng: string;
    }>;
}

export default async function DashboardLayout({
    children,
    params,
}: DashboardLayoutProps) {
    const { lng } = await params;

    return (
        <DashboardSidebar lng={lng}>
            {children}
        </DashboardSidebar>
    );
}
