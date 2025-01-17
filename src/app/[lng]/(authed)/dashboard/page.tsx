// app/(authed)/dashboard/page.tsx
import { createServerClient } from "@/lib/pocketbase/server";
import { DashboardClient } from "./page-client";
import { User, Settings, Activity } from "lucide-react";

export default async function Dashboard() {
  const client = await createServerClient();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        <button className="btn btn-primary">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Server Info Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base-content">
              Server Information
              <span className="badge badge-primary">Active</span>
            </h2>
            <div className="space-y-3">
              <p className="text-base-content/80">
                <span className="font-medium">ID:</span>{" "}
                {client.authStore.record?.id}
              </p>
              <p className="text-base-content/80">
                <span className="font-medium">Email:</span>{" "}
                {client.authStore.record?.email}
              </p>

            </div>
          </div>
        </div>

        {/* Client Info Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <DashboardClient />
          </div>
        </div>

        {/* Activity Log */}
        <div className="card bg-base-100 shadow-md md:col-span-2">
          <div className="card-body">
            <h2 className="card-title text-base-content mb-4">
              Recent Activity
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Login</td>
                    <td>Successful login attempt</td>
                    <td>2 minutes ago</td>
                    <td>
                      <span className="badge badge-success">Success</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Update</td>
                    <td>Profile information updated</td>
                    <td>2 hours ago</td>
                    <td>
                      <span className="badge badge-info">Updated</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Security</td>
                    <td>Password changed</td>
                    <td>3 days ago</td>
                    <td>
                      <span className="badge badge-warning">Changed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-primary">
            <User className="w-8 h-8" />
          </div>
          <div className="stat-title">Profile</div>
          <div className="stat-value text-primary text-2xl">Active</div>
          <div className="stat-desc">Last updated 2h ago</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-secondary">
            <Activity className="w-8 h-8" />
          </div>
          <div className="stat-title">Sessions</div>
          <div className="stat-value text-secondary text-2xl">5</div>
          <div className="stat-desc">↗︎ 2 more than last week</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Activity</div>
          <div className="stat-value text-accent text-2xl">89%</div>
          <div className="stat-desc">↗︎ 14% more than last month</div>
        </div>
      </div>
    </div>
  );
}
