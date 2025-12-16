/**
 * Admin Blog List Page
 * 
 * View and manage blog posts.
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { FileText, Plus, Eye, EyeOff, Edit, Trash2, Calendar } from 'lucide-react'
import { createServerClient } from '@/lib/pocketbase/server'
import { verifyAdminAccess } from '@/services/auth/access-control'
import { revalidatePath } from 'next/cache'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    published: boolean
    coverImageUrl: string | null
    created: string
    updated: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
    const isAdmin = await verifyAdminAccess()
    if (!isAdmin) return []

    try {
        const client = await createServerClient(false)
        const baseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'

        const result = await client.collection('posts').getFullList({
            sort: '-created'
        })

        return result.map(post => ({
            id: post.id,
            title: post.title || post.title_en || 'Untitled',
            slug: post.slug || '',
            excerpt: post.excerpt || post.excerpt_en || '',
            published: post.published || post.visibility || false,
            coverImageUrl: post.cover_image
                ? `${baseUrl}/api/files/${post.collectionId}/${post.id}/${post.cover_image}`
                : null,
            created: post.created,
            updated: post.updated
        }))
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return []
    }
}

// Toggle post visibility
async function togglePostVisibility(id: string) {
    'use server'
    const isAdmin = await verifyAdminAccess()
    if (!isAdmin) return

    try {
        const client = await createServerClient()
        const post = await client.collection('posts').getOne(id)
        await client.collection('posts').update(id, {
            published: !post.published
        })
        revalidatePath('/[lng]/admin/blog')
    } catch (error) {
        console.error('Error toggling visibility:', error)
    }
}

// Delete post
async function deletePost(id: string) {
    'use server'
    const isAdmin = await verifyAdminAccess()
    if (!isAdmin) return

    try {
        const client = await createServerClient()
        await client.collection('posts').delete(id)
        revalidatePath('/[lng]/admin/blog')
    } catch (error) {
        console.error('Error deleting post:', error)
    }
}

// Post Row Component
function PostRow({ post, lng }: { post: BlogPost; lng: string }) {
    return (
        <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    {post.coverImageUrl ? (
                        <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="w-16 h-10 rounded-lg object-cover bg-zinc-800"
                        />
                    ) : (
                        <div className="w-16 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-zinc-600" />
                        </div>
                    )}
                    <div>
                        <Link
                            href={`/${lng}/admin/blog/${post.id}`}
                            className="font-medium text-white hover:text-red-400 transition-colors line-clamp-1"
                        >
                            {post.title}
                        </Link>
                        <p className="text-xs text-zinc-500 line-clamp-1">{post.excerpt || 'No excerpt'}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.published
                    ? 'bg-green-900/20 text-green-500'
                    : 'bg-zinc-800 text-zinc-400'
                    }`}>
                    {post.published ? 'Published' : 'Draft'}
                </span>
            </td>
            <td className="py-4 px-4">
                <span className="text-sm text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created).toLocaleDateString()}
                </span>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                    <form action={togglePostVisibility.bind(null, post.id)}>
                        <button
                            type="submit"
                            className={`p-2 rounded-lg transition-colors ${post.published
                                ? 'text-green-500 hover:bg-green-900/20'
                                : 'text-zinc-500 hover:bg-zinc-800'
                                }`}
                            title={post.published ? 'Published' : 'Draft'}
                        >
                            {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </form>
                    <Link
                        href={`/${lng}/admin/blog/${post.id}`}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </Link>
                    <form action={deletePost.bind(null, post.id)}>
                        <button
                            type="submit"
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-900/20 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </form>
                </div>
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
                    <div className="w-16 h-10 bg-zinc-800 rounded-lg mr-3" />
                    <div className="flex-1">
                        <div className="h-4 bg-zinc-800 rounded w-48 mb-2" />
                        <div className="h-3 bg-zinc-800 rounded w-32" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Blog Content
async function BlogContent({ lng }: { lng: string }) {
    const posts = await getBlogPosts()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-red-500" />
                        Blog Posts
                    </h1>
                    <p className="text-zinc-500 mt-1">Create and manage blog content</p>
                </div>
                <Link
                    href={`/${lng}/admin/blog/new`}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span>{posts.length} posts total</span>
                <span>•</span>
                <span>{posts.filter(p => p.published).length} published</span>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-900/50">
                        <tr className="border-b border-zinc-800">
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Post</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Created</th>
                            <th className="text-left py-3 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <PostRow key={post.id} post={post} lng={lng} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-zinc-500">
                                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No blog posts yet</p>
                                    <Link
                                        href={`/${lng}/admin/blog/new`}
                                        className="text-red-400 text-sm hover:underline mt-2 inline-block"
                                    >
                                        Create your first post →
                                    </Link>
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
export default async function AdminBlogPage({
    params
}: {
    params: Promise<{ lng: string }>
}) {
    const { lng } = await params

    return (
        <Suspense fallback={<TableSkeleton />}>
            <BlogContent lng={lng} />
        </Suspense>
    )
}
