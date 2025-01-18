// app/(authed)/dashboard/page-client.tsx
"use client";

import { useUser } from "@/components/pocketbase-provider";
//import { Shield } from "lucide-react";

export function DashboardClient() {
  const user = useUser();

  return (
    <>
      <h2 className="card-title text-base-content">
        Client Information
        <span className="badge badge-secondary">Live</span>
      </h2>
      <div className="space-y-3">
        <p className="text-base-content/80">
          <span className="font-medium">ID:</span> {user?.id}
        </p>
        <p className="text-base-content/80">
          <span className="font-medium">Email:</span> {user?.email}
        </p>
      </div>
    </>
  );
}
