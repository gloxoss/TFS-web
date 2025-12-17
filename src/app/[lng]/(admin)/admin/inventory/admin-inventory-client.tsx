'use client'

import { toggleEquipmentVisibility, deleteEquipment } from '@/lib/actions/admin-inventory'
import { Eye, EyeOff, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export function EquipmentRow({
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
