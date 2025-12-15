/**
 * Store Info Card Component
 * 
 * Displays store contact information in a visually appealing card.
 * Used when the AI calls the get_store_info tool.
 * 
 * Design: Glassmorphism with dark cinema aesthetic
 */

import { MapPin, Phone, Mail, Clock, ExternalLink, Instagram, Facebook } from 'lucide-react'

export interface StoreInfoData {
    name: string
    address: string
    phone: string
    email: string
    hours: {
        weekdays: string
        saturday: string
        sunday: string
    }
    mapUrl: string
    socialMedia?: {
        instagram?: string
        facebook?: string
    }
}

interface StoreInfoCardProps {
    data: StoreInfoData
}

export function StoreInfoCard({ data }: StoreInfoCardProps) {
    return (
        <div className="w-full max-w-sm my-3">
            {/* Main Card - Glassmorphism */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl border border-zinc-700/50 shadow-2xl">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                <div className="relative p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm">
                                {data.name}
                            </h3>
                            <p className="text-xs text-zinc-400">Film Equipment Rental</p>
                        </div>
                    </div>

                    {/* Info Items */}
                    <div className="space-y-3">
                        {/* Address */}
                        <a
                            href={data.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 group hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                {data.address}
                            </span>
                            <ExternalLink className="w-3 h-3 text-zinc-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>

                        {/* Phone */}
                        <a
                            href={`tel:${data.phone}`}
                            className="flex items-center gap-3 group hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                {data.phone}
                            </span>
                        </a>

                        {/* Email */}
                        <a
                            href={`mailto:${data.email}`}
                            className="flex items-center gap-3 group hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
                        >
                            <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                                {data.email}
                            </span>
                        </a>

                        {/* Hours */}
                        <div className="flex items-start gap-3 p-2 -m-2">
                            <Clock className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm space-y-0.5">
                                <div className="flex justify-between gap-4">
                                    <span className="text-zinc-500">Mon-Fri</span>
                                    <span className="text-zinc-300">{data.hours.weekdays}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-zinc-500">Saturday</span>
                                    <span className="text-zinc-300">{data.hours.saturday}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <span className="text-zinc-500">Sunday</span>
                                    <span className="text-red-400">{data.hours.sunday}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    {data.socialMedia && (
                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                            {data.socialMedia.instagram && (
                                <a
                                    href={`https://instagram.com/${data.socialMedia.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-xs text-zinc-400 hover:text-white"
                                >
                                    <Instagram className="w-3.5 h-3.5" />
                                    {data.socialMedia.instagram}
                                </a>
                            )}
                            {data.socialMedia.facebook && (
                                <a
                                    href={`https://facebook.com/${data.socialMedia.facebook}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-xs text-zinc-400 hover:text-white"
                                >
                                    <Facebook className="w-3.5 h-3.5" />
                                    Facebook
                                </a>
                            )}
                        </div>
                    )}

                    {/* CTA Button */}
                    <a
                        href={data.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 text-center text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-blue-500/20"
                    >
                        Get Directions
                    </a>
                </div>
            </div>
        </div>
    )
}
