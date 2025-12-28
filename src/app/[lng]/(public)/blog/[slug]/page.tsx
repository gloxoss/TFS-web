/**
 * Public Blog Post Page
 * 
 * Displays a single blog post using the slug.
 * Supports bilingual content (EN/FR).
 */

import { createServerClient } from '@/lib/pocketbase/server'
import { getBlogService } from '@/services'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import parse from 'html-react-parser'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'

export default async function BlogPostPage({ params }: { params: Promise<{ lng: string; slug: string }> }) {
    const { lng, slug } = await params

    const pb = await createServerClient()
    const blogService = getBlogService(pb)
    const post = await blogService.getPostBySlug(slug, lng)

    if (!post) {
        notFound()
    }

    return (
        <article className="min-h-screen bg-zinc-950 pt-20 md:pt-24 text-foreground pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-default-100 overflow-hidden">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D00000]/30 to-zinc-900" />
                )}
                <div className="absolute inset-0 bg-black/60" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-6 text-center space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Back Link */}
                        <Link
                            href={`/${lng}/blog`}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {lng === 'fr' ? 'Retour au Blog' : 'Back to Blog'}
                        </Link>

                        {/* Category Badge */}
                        {post.category && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D00000]/80 backdrop-blur-sm rounded-full text-xs font-medium text-white uppercase tracking-wider">
                                <Tag className="w-3 h-3" />
                                {post.category}
                            </span>
                        )}

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-white/80 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={post.publishedAt || post.created}>
                                    {new Date(post.publishedAt || post.created).toLocaleDateString(
                                        lng === 'fr' ? 'fr-FR' : 'en-US',
                                        { year: 'numeric', month: 'long', day: 'numeric' }
                                    )}
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
                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-lg md:text-xl text-zinc-300 font-light mb-8 pb-8 border-b border-zinc-800">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Main Content */}
                    <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-zinc-300 prose-a:text-[#D00000] prose-strong:text-white prose-li:text-zinc-300 prose-img:rounded-xl">
                        {post.content ? parse(post.content) : (
                            <p className="text-zinc-400 italic">
                                {lng === 'fr' ? 'Contenu à venir...' : 'Content coming soon...'}
                            </p>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#D00000] to-red-700">
                        <Link
                            href={`/${lng}/contact`}
                            className="block px-8 py-3 bg-black rounded-full hover:bg-black/90 transition-colors text-white font-medium"
                        >
                            {lng === 'fr' ? 'Vous avez un projet ? Contactez-nous' : 'Have a project in mind? Contact Us'}
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
