/**
 * Admin Inventory Page
 * 
 * Equipment list with CRUD operations.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { getEquipmentList, toggleEquipmentVisibility, deleteEquipment } from '@/lib/actions/admin-inventory'
import { Package, Plus, Search, Eye, EyeOff, Edit, Trash2, Image as ImageIcon } from 'lucide-react'

// Equipment Table Row
function EquipmentRow({
    item,
    lng
}: {
    item: {
        id: string
        nameEn: string
        category: string
        brand: string
        dailyRate: number
        stock: number
        visibility: boolean
        imageUrls: string[]
        availabilityStatus: string
    }
    lng: string
}) {
    const statusColors: Record<string, string> = {
        available: 'bg-green-900/20 text-green-500',
        rented: 'bg-yellow-900/20 text-yellow-500',
        maintenance: 'bg-red-900/20 text-red-500'
    }

    return (
        <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    {item.imageUrls[0] ? (
                        <img
                            src={item.imageUrls[0]}
                            alt={item.nameEn}
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-800"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-zinc-600" />
                        </div>
                    )}
                    <div>
                        <Link
                            href={`/${lng}/admin/inventory/${item.id}`}
                            className="font-medium text-white hover:text-red-400 transition-colors"
                        >
                            {item.nameEn}
                        </Link>
                        <p className="text-xs text-zinc-500">{item.brand}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-400 capitalize">{item.category}</span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-300">${item.dailyRate}/day</span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-400">{item.stock}</span>
            </td>
            <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.availabilityStatus] || 'bg-zinc-800 text-zinc-400'}`}>
                    {item.availabilityStatus}
                </span>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                    <form action={async () => {
                        'use server'
                        await toggleEquipmentVisibility(item.id)
                    }}>
                        <button
                            type="submit"
                            className={`p-2 rounded-lg transition-colors ${item.visibility
                                ? 'text-green-500 hover:bg-green-900/20'
                                : 'text-zinc-500 hover:bg-zinc-800'
                                }`}
                            title={item.visibility ? 'Visible' : 'Hidden'}
                        >
                            {item.visibility ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </form>
                    <Link
                        href={`/${lng}/admin/inventory/${item.id}`}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </Link>
                    <form action={async () => {
                        'use server'
                        await deleteEquipment(item.id)
                    }}>
                        <button
                            type="submit"
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-900/20 transition-colors"
                            title="Delete"
                            onClick={(e) => {
                                if (!confirm('Are you sure you want to delete this item?')) {
                                    e.preventDefault()
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    )
}

// Loading skeleton
function TableSkeleton() {
    return (
        <div className="animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center py-4 border-b border-zinc-800">
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg mr-3" />
                    <div className="flex-1">
                        <div className="h-4 bg-zinc-800 rounded w-48 mb-2" />
                        <div className="h-3 bg-zinc-800 rounded w-24" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Main Content
async function InventoryContent({ lng, searchParams }: {
    lng: string
    searchParams: { page?: string; search?: string; category?: string }
}) {
    const page = parseInt(searchParams.page || '1')
    const result = await getEquipmentList(page, 20, {
        search: searchParams.search,
        category: searchParams.category
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-red-500" />
                        Inventory
                    </h1>
                    <p className="text-zinc-500 mt-1">Manage your equipment catalog</p>
                </div>
                <Link
                    href={`/${lng}/admin/inventory/new`}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Equipment
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
                <form className="flex-1 relative" action={`/${lng}/admin/inventory`}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search equipment..."
                        defaultValue={searchParams.search}
                        className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-900/50"
                    />
                </form>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span>{result.totalItems} items total</span>
                <span>•</span>
                <span>Page {result.page} of {result.totalPages || 1}</span>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-900/50">
                        <tr className="border-b border-zinc-800">
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Equipment</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Category</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Rate</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Stock</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.items.length > 0 ? (
                            result.items.map((item) => (
                                <EquipmentRow key={item.id} item={item} lng={lng} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-zinc-500">
                                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No equipment found</p>
                                    <Link
                                        href={`/${lng}/admin/inventory/new`}
                                        className="text-red-400 text-sm hover:underline mt-2 inline-block"
                                    >
                                        Add your first item →
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {page > 1 && (
                        <Link
                            href={`/${lng}/admin/inventory?page=${page - 1}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                            Previous
                        </Link>
                    )}
                    <span className="text-zinc-500">
                        Page {page} of {result.totalPages}
                    </span>
                    {page < result.totalPages && (
                        <Link
                            href={`/${lng}/admin/inventory?page=${page + 1}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

// Main Page Export
export default async function AdminInventoryPage({
    params,
    searchParams
}: {
    params: Promise<{ lng: string }>
    searchParams: Promise<{ page?: string; search?: string; category?: string }>
}) {
    const { lng } = await params
    const resolvedSearchParams = await searchParams

    return (
        <Suspense fallback={<TableSkeleton />}>
            <InventoryContent lng={lng} searchParams={resolvedSearchParams} />
        </Suspense>
    )
}
