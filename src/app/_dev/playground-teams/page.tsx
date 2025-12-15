"use client";

import BasicTeamPage from "@/components/marketing/teams/basic-team-page/BasicTeamPage";

export default function TeamsPlayground() {
    return (
        <div className="min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-8">Teams Playground</h1>
            <div className="border border-dashed border-default-300 rounded-lg p-4">
                <BasicTeamPage />
            </div>
        </div>
    );
}
