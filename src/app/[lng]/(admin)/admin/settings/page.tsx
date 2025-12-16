/**
 * Admin Settings Page
 * 
 * Platform configuration settings.
 */

'use client'

import { use, useState } from 'react'
import {
    Settings,
    Building2,
    Globe,
    Bell,
    Lock,
    Palette,
    Mail,
    Save,
    Check
} from 'lucide-react'

// Settings Section Component
function SettingsSection({
    title,
    description,
    icon: Icon,
    children
}: {
    title: string
    description: string
    icon: React.ElementType
    children: React.ReactNode
}) {
    return (
        <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/50">
                    <Icon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h2 className="font-semibold text-white">{title}</h2>
                    <p className="text-sm text-zinc-500">{description}</p>
                </div>
            </div>
            <div className="p-6 space-y-4">
                {children}
            </div>
        </div>
    )
}

// Toggle Switch
function Toggle({
    label,
    description,
    checked,
    onChange
}: {
    label: string
    description?: string
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <span className="text-zinc-300">{label}</span>
                {description && (
                    <p className="text-sm text-zinc-500">{description}</p>
                )}
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-red-600' : 'bg-zinc-700'
                    }`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'left-6' : 'left-1'
                        }`}
                />
            </button>
        </div>
    )
}

export default function AdminSettingsPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = use(params)

    // Company settings state
    const [companyName, setCompanyName] = useState('TFS Equipment Rental')
    const [companyEmail, setCompanyEmail] = useState('contact@tfs-rental.com')
    const [companyPhone, setCompanyPhone] = useState('+212 522 123 456')
    const [companyAddress, setCompanyAddress] = useState('Casablanca, Morocco')

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [newQuoteAlert, setNewQuoteAlert] = useState(true)
    const [quoteStatusAlert, setQuoteStatusAlert] = useState(true)

    // Display settings
    const [showPrices, setShowPrices] = useState(false)
    const [maintenanceMode, setMaintenanceMode] = useState(false)

    // UI state
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-6 h-6 text-red-500" />
                        Settings
                    </h1>
                    <p className="text-zinc-500 mt-1">Configure your platform settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white rounded-lg font-medium transition-colors"
                >
                    {saved ? (
                        <>
                            <Check className="w-4 h-4" />
                            Saved
                        </>
                    ) : saving ? (
                        <span>Saving...</span>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Company Info */}
            <SettingsSection
                title="Company Information"
                description="Your business details displayed on the platform"
                icon={Building2}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Contact Email</label>
                        <input
                            type="email"
                            value={companyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Address</label>
                        <input
                            type="text"
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                        />
                    </div>
                </div>
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection
                title="Email Notifications"
                description="Configure when you receive email alerts"
                icon={Bell}
            >
                <Toggle
                    label="Email Notifications"
                    description="Receive email notifications for important events"
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                />
                <Toggle
                    label="New Quote Alerts"
                    description="Get notified when a new quote is submitted"
                    checked={newQuoteAlert}
                    onChange={setNewQuoteAlert}
                />
                <Toggle
                    label="Quote Status Changes"
                    description="Get notified when quote status changes"
                    checked={quoteStatusAlert}
                    onChange={setQuoteStatusAlert}
                />
            </SettingsSection>

            {/* Display Settings */}
            <SettingsSection
                title="Display Settings"
                description="Control what visitors see on your site"
                icon={Palette}
            >
                <Toggle
                    label="Show Prices Publicly"
                    description="Display daily rates on equipment pages"
                    checked={showPrices}
                    onChange={setShowPrices}
                />
                <Toggle
                    label="Maintenance Mode"
                    description="Show maintenance page to visitors (admins can still access)"
                    checked={maintenanceMode}
                    onChange={setMaintenanceMode}
                />
            </SettingsSection>

            {/* Localization */}
            <SettingsSection
                title="Localization"
                description="Language and regional settings"
                icon={Globe}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Default Language</label>
                        <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50">
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Currency</label>
                        <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50">
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="MAD">MAD (DH)</option>
                        </select>
                    </div>
                </div>
            </SettingsSection>

            {/* Security Notice */}
            <SettingsSection
                title="Security"
                description="Access control and authentication"
                icon={Lock}
            >
                <div className="text-sm text-zinc-400 space-y-2">
                    <p>• Admin authentication is managed through PocketBase</p>
                    <p>• Access the PocketBase admin panel at <code className="text-red-400">/api/_/</code> for advanced settings</p>
                    <p>• Enable 2FA for admin accounts in PocketBase settings</p>
                </div>
            </SettingsSection>

            {/* External Links */}
            <div className="flex items-center gap-4 text-sm">
                <a
                    href={`${process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'}/_/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-red-400 transition-colors"
                >
                    PocketBase Admin →
                </a>
                <a
                    href={`/${lng}/admin`}
                    className="text-zinc-400 hover:text-red-400 transition-colors"
                >
                    Back to Dashboard →
                </a>
            </div>
        </div>
    )
}
