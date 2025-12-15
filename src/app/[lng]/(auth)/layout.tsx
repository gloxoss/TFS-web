import { PocketBaseProvider } from "@/components/pocketbase-provider";
import { createServerClient } from "@/lib/pocketbase/server";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default async function AuthLayout({
    children,
}: AuthLayoutProps) {
    const pb = await createServerClient();
    const user = pb.authStore.model;

    return (
        <PocketBaseProvider initialUser={user} initialToken="">
            <main className="grow">
                {children}
            </main>
        </PocketBaseProvider>
    );
}
