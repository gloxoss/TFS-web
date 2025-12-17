import { getSettings } from '@/lib/actions/settings'
import SettingsClient from './settings-client'

export default async function AdminSettingsPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = await params
    const { settings } = await getSettings()

    if (!settings) {
        return (
            <div className="p-6 text-red-500">
                Failed to load settings. Please try refreshing.
            </div>
        )
    }

    return <SettingsClient initialSettings={settings} lng={lng} />
}
