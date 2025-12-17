/**
 * Admin Users Management Page
 * 
 * View and manage platform users.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { Users, UserPlus, Shield, ShieldCheck, ShieldX, Mail } from 'lucide-react'
import { createServerClient } from '@/lib/pocketbase/server'
import { verifyAdminAccess } from '@/services/auth/access-control'

interface User {
    id: string
    email: string
    name: string
    role: string
    verified: boolean
    created: string
    lastLogin: string | null
}

async function getUsers(): Promise<User[]> {
    const isAdmin = await verifyAdminAccess()
    if (!isAdmin) return []

    try {
        const client = await createServerClient(false)
        const result = await client.collection('users').getFullList({
            sort: '-created'
        })

        return result.map(user => ({
            id: user.id,
            email: user.email || '',
            name: user.name || user.username || '',
            role: user.role || 'customer',
            verified: user.verified || false,
            created: user.created,
            lastLogin: user.last_login || null
        }))
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

// Role Badge Component
function RoleBadge({ role }: { role: string }) {
    const colors: Record<string, string> = {
        admin: 'bg-red-900/20 text-red-500 border-red-900/30',
        editor: 'bg-blue-900/20 text-blue-500 border-blue-900/30',
        customer: 'bg-zinc-800 text-zinc-400 border-zinc-700'
    }

    const icons: Record<string, React.ReactNode> = {
        admin: <ShieldCheck className="w-3 h-3" />,
        editor: <Shield className="w-3 h-3" />,
        customer: null
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${colors[role] || colors.customer}`}>
            {icons[role]}
            {role}
        </span>
    )
}

// User Row Component
function UserRow({ user }: { user: User }) {
    return (
        <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-400 border border-zinc-700">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-white">{user.name || 'No name'}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                        </p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <RoleBadge role={user.role} />
            </td>
            <td className="py-4 px-4">
                {user.verified ? (
                    <span className="text-green-500 text-sm flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        Verified
                    </span>
                ) : (
                    <span className="text-yellow-500 text-sm flex items-center gap-1">
                        <ShieldX className="w-4 h-4" />
                        Pending
                    </span>
                )}
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-500">
                    {new Date(user.created).toLocaleDateString()}
                </span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-500">
                    {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                    }
                </span>
            </td>
        </tr>
    )
}

// Loading Skeleton
function TableSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center py-4 border-b border-zinc-800">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full mr-3" />
                    <div className="flex-1">
                        <div className="h-4 bg-zinc-800 rounded w-32 mb-2" />
                        <div className="h-3 bg-zinc-800 rounded w-48" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Users Content
async function UsersContent({ lng }: { lng: string }) {
    const users = await getUsers()

    // Stats
    const admins = users.filter(u => u.role === 'admin').length
    const verified = users.filter(u => u.verified).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Users className="w-6 h-6 text-red-500" />
                        Users
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage platform users and roles</p>
                </div>
                <a
                    href={`${process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'}/_/#/collections?collectionId=_pb_users_auth_`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Manage in PocketBase
                </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-4">
                    <p className="text-sm text-zinc-500">Total Users</p>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-4">
                    <p className="text-sm text-zinc-500">Admins</p>
                    <p className="text-2xl font-bold text-red-500">{admins}</p>
                </div>
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-4">
                    <p className="text-sm text-zinc-500">Verified</p>
                    <p className="text-2xl font-bold text-green-500">{verified}</p>
                </div>
            </div>

            {/* Notice */}
            <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-lg p-4">
                <p className="text-sm text-yellow-500">
                    <strong>Note:</strong> For security, user creation and role changes are managed through the PocketBase admin panel.
                    Click "Manage in PocketBase" to add new users or change roles.
                </p>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-900/50">
                        <tr className="border-b border-zinc-800">
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">User</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Role</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Joined</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserRow key={user.id} user={user} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-zinc-500">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No users found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Main Page Export
export default async function AdminUsersPage({
    params
}: {
    params: Promise<{ lng: string }>
}) {
    const { lng } = await params

    return (
        <Suspense fallback={<TableSkeleton />}>
            <UsersContent lng={lng} />
        </Suspense>
    )
}
