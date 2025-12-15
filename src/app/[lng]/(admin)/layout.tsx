import AdminSidebar from "@/components/admin/admin-sidebar";
import { verifyAdminAccess } from "@/services/auth/access-control";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lng: string;
    }>;
}

export default async function AdminLayout({
    children,
    params,
}: AdminLayoutProps) {
    const { lng } = await params;

    // Double check auth here (Server-Side Gate)
    const canAccess = await verifyAdminAccess();
    if (!canAccess) {
        redirect(`/${lng}/login`);
    }

    return (
        <AdminSidebar lng={lng}>
            {children}
        </AdminSidebar>
    );
}
