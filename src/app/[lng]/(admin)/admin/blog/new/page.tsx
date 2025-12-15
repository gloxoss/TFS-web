/**
 * Admin: Create New Blog Post
 * 
 * Interface for writing and publishing blog posts.
 * Uses Tiptap editor and PocketBase.
 */

'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Button,
    Input,
    Card,
    CardBody,
    Switch,
    Textarea
} from '@heroui/react'
import {
    Save,
    ArrowLeft,
    Image as ImageIcon,
    Globe,
    FileText
} from 'lucide-react'
import { TiptapEditor } from '@/components/admin/blog/tiptap-editor'
import { slugify } from '@/lib/utils/slugify'
import { createPost } from '@/lib/actions/blog'

export default function CreatePostPage({ params }: { params: Promise<{ lng: string }> }) {
    const { lng } = use(params)
    const router = useRouter()

    // Form State
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [content, setContent] = useState('<p>Start writing your story...</p>')
    const [excerpt, setExcerpt] = useState('')
    const [published, setPublished] = useState(false)
    const [coverImage, setCoverImage] = useState<File | null>(null)

    // UI State
    const [isSaving, setIsSaving] = useState(false)
    const [autoSlug, setAutoSlug] = useState(true)

    // Handle title change & auto-slug
    const handleTitleChange = (val: string) => {
        setTitle(val)
        if (autoSlug) {
            setSlug(slugify(val))
        }
    }

    // Handle slug manual edit
    const handleSlugChange = (val: string) => {
        setSlug(slugify(val))
        setAutoSlug(false)
    }

    // Save Post
    const handleSave = async () => {
        if (!title || !slug) {
            alert('Title and slug are required')
            return
        }

        setIsSaving(true)
        try {
            console.log('Preparing post data...')

            const formData = new FormData()
            formData.append('title', title)
            formData.append('slug', slug)
            formData.append('content', content)
            formData.append('excerpt', excerpt)
            formData.append('published', String(published))

            if (coverImage) {
                formData.append('cover_image', coverImage)
            }

            // Call Server Action
            const result = await createPost(formData)

            if (result.success) {
                alert('Post created successfully!')
                // Optional: Redirect to list (commented out for now to allow user verification)
                // router.push(`/${lng}/admin/dashboard/blog`)
            } else {
                throw new Error(result.error || 'Unknown server error')
            }

        } catch (error: any) {
            console.error('Error saving post:', error)
            alert(`Failed to save post: ${error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/${lng}/admin/dashboard`}
                        className="p-2 hover:bg-default-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">New Post</h1>
                        <p className="text-default-500 text-sm">Create a new blog article</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        color="primary"
                        onPress={handleSave}
                        isLoading={isSaving}
                        startContent={!isSaving && <Save className="w-4 h-4" />}
                    >
                        Save Post
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (Editor) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardBody className="p-4 space-y-4">
                            <Input
                                label="Post Title"
                                placeholder="Enter a catchy title"
                                variant="bordered"
                                size="lg"
                                classNames={{
                                    input: "text-2xl font-bold",
                                    label: "text-lg"
                                }}
                                value={title}
                                onValueChange={handleTitleChange}
                            />

                            <div className="min-h-[500px]">
                                <TiptapEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Sidebar (Meta) */}
                <div className="space-y-6">
                    {/* Publishing */}
                    <Card>
                        <CardBody className="p-4 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Publishing
                            </h3>

                            <Switch
                                isSelected={published}
                                onValueChange={setPublished}
                                color="success"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">
                                        {published ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="text-tiny text-default-400">
                                        {published ? 'Visible to public' : 'Only visible to admins'}
                                    </span>
                                </div>
                            </Switch>

                            <Input
                                label="URL Slug"
                                placeholder="my-awesome-post"
                                value={slug}
                                onValueChange={handleSlugChange}
                                description={`/blog/${slug}`}
                                startContent={<span className="text-default-400 text-sm">/</span>}
                            />
                        </CardBody>
                    </Card>

                    {/* Meta Info */}
                    <Card>
                        <CardBody className="p-4 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Meta Details
                            </h3>

                            <Textarea
                                label="Excerpt"
                                placeholder="Short summary for SEO and previews..."
                                minRows={3}
                                value={excerpt}
                                onValueChange={setExcerpt}
                            />

                            <div className="space-y-2">
                                <label className="text-small text-default-500">Cover Image</label>
                                <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center hover:bg-default-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) setCoverImage(file)
                                        }}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageIcon className="w-8 h-8 text-default-400" />
                                        <span className="text-sm text-default-500">
                                            {coverImage ? coverImage.name : 'Click to upload image'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}
