/**
 * Admin New Equipment Page
 * 
 * Form for creating new equipment listings.
 */

'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Package, Image as ImageIcon, X } from 'lucide-react'
import { createEquipment, getEquipmentCategories } from '@/lib/actions/admin-inventory'
import { slugify } from '@/lib/utils/slugify'

export default function NewEquipmentPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = use(params)
    const router = useRouter()

    // Form state
    const [nameEn, setNameEn] = useState('')
    const [nameFr, setNameFr] = useState('')
    const [slug, setSlug] = useState('')
    const [autoSlug, setAutoSlug] = useState(true)
    const [category, setCategory] = useState('')
    const [brand, setBrand] = useState('')
    const [descriptionEn, setDescriptionEn] = useState('')
    const [descriptionFr, setDescriptionFr] = useState('')
    const [dailyRate, setDailyRate] = useState('')
    const [stock, setStock] = useState('1')
    const [visibility, setVisibility] = useState(true)
    const [featured, setFeatured] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    // Categories
    const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])

    // UI state
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Load categories
    useEffect(() => {
        getEquipmentCategories().then(result => {
            if (result.success) {
                setCategories(result.categories)
            }
        })
    }, [])

    // Auto-generate slug
    const handleNameChange = (value: string) => {
        setNameEn(value)
        if (autoSlug) {
            setSlug(slugify(value))
        }
    }

    // Manual slug edit
    const handleSlugChange = (value: string) => {
        setSlug(slugify(value))
        setAutoSlug(false)
    }

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setImages(prev => [...prev, ...files])

        // Create previews
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target?.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    // Remove image
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const formData = new FormData()
            formData.append('name_en', nameEn)
            formData.append('name_fr', nameFr || nameEn)
            formData.append('slug', slug)
            formData.append('category', category)
            formData.append('brand', brand)
            formData.append('description_en', descriptionEn)
            formData.append('description_fr', descriptionFr)
            formData.append('daily_rate', dailyRate)
            formData.append('stock', stock)
            formData.append('visibility', String(visibility))
            formData.append('featured', String(featured))
            formData.append('availability_status', 'available')

            images.forEach(img => {
                formData.append('images', img)
            })

            const result = await createEquipment(formData)

            if (result.success) {
                router.push(`/${lng}/admin/inventory`)
            } else {
                setError(result.error || 'Failed to create equipment')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${lng}/admin/inventory`}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Package className="w-6 h-6 text-red-500" />
                            New Equipment
                        </h1>
                        <p className="text-zinc-500 text-sm">Add a new item to your catalog</p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Name (English) *</label>
                            <input
                                type="text"
                                value={nameEn}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                                placeholder="Sony FX6 Camera"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Name (French)</label>
                            <input
                                type="text"
                                value={nameFr}
                                onChange={(e) => setNameFr(e.target.value)}
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                                placeholder="Caméra Sony FX6"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">URL Slug *</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                                placeholder="sony-fx6-camera"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Brand</label>
                            <input
                                type="text"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                                placeholder="Sony"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Description</h2>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Description (English)</label>
                        <textarea
                            value={descriptionEn}
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50 resize-none"
                            placeholder="Describe the equipment features and specifications..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Description (French)</label>
                        <textarea
                            value={descriptionFr}
                            onChange={(e) => setDescriptionFr(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50 resize-none"
                            placeholder="Décrivez les caractéristiques de l'équipement..."
                        />
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Pricing & Stock</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Daily Rate ($)</label>
                            <input
                                type="number"
                                value={dailyRate}
                                onChange={(e) => setDailyRate(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                                placeholder="150.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-2">Stock Quantity</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                min="0"
                                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-900/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={visibility}
                                onChange={(e) => setVisibility(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-zinc-300">Visible to public</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm text-zinc-300">Featured item</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6 space-y-4">
                    <h2 className="font-semibold text-white">Images</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <label className="h-32 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-900/50 transition-colors">
                            <ImageIcon className="w-8 h-8 text-zinc-600 mb-2" />
                            <span className="text-xs text-zinc-500">Add Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-4">
                    <Link
                        href={`/${lng}/admin/inventory`}
                        className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white rounded-lg font-medium transition-colors"
                    >
                        {saving ? (
                            <span>Saving...</span>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Create Equipment
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
