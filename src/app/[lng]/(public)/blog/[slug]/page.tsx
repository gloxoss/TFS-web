/**
 * Public Blog Post Page
 * 
 * Displays a single blog post using the slug.
 * Renders rich text content with Tailwind Typography.
 */

import { createServerClient } from '@/lib/pocketbase/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import parse from 'html-react-parser'
import { ArrowLeft, Calendar, User } from 'lucide-react'

// PocketBase Image URL helper
const getImageUrl = (collectionId: string, recordId: string, fileName: string) => {
    return `${process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'}/api/files/${collectionId}/${recordId}/${fileName}`
}

async function getPost(slug: string) {
    try {
        const pb = await createServerClient()
        const result = await pb.collection('posts').getList(1, 50)
        const post = result.items.find(p => p.slug === slug && p.published === true)
        return post || null
    } catch (error) {
        console.error('Error fetching post:', error)
        return null
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ lng: string; slug: string }> }) {
    const { lng, slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    const coverImageUrl = post.cover_image
        ? getImageUrl(post.collectionId, post.id, post.cover_image)
        : null

    return (
        <article className="min-h-screen bg-zinc-950 pt-20 md:pt-24 text-foreground pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-default-100 overflow-hidden">
                {coverImageUrl ? (
                    <Image
                        src={coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-default-900" />
                )}
                <div className="absolute inset-0 bg-black/60" /> {/* Overlay */}

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-6 text-center space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Back Link */}
                        <Link
                            href={`/${lng}/blog`}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-white/80 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.created || undefined}>
                                    {post.created
                                        ? new Date(post.created).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : 'Recently'
                                    }
                                </time>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>TFS Team</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-10">
                <div className="bg-zinc-900 rounded-xl shadow-2xl p-8 md:p-12 border border-zinc-800">
                    <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-zinc-300 prose-a:text-primary prose-strong:text-white prose-li:text-zinc-300 prose-img:rounded-xl">
                        {/* Safe HTML Rendering */}
                        {post.content ? parse(post.content) : (
                            <p className="text-default-400 italic">No content available.</p>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary to-secondary">
                        <Link
                            href={`/${lng}/contact`}
                            className="block px-8 py-3 bg-black rounded-full hover:bg-black/90 transition-colors text-white font-medium"
                        >
                            Have a project in mind? Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
