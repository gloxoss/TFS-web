'use client';

import { updateQuotePricing, lockQuote, unlockQuote, finalizeQuote } from '@/lib/actions/admin-requests';
import { Quote } from '@/services';
import { format } from 'date-fns';
import { ArrowLeft, Send, AlertCircle, Lock, Unlock, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface RequestDetailViewProps {
    request: Quote;
    lng: string;
}

export default function RequestDetailView({ request, lng }: RequestDetailViewProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [price, setPrice] = useState<string>(request.estimatedPrice?.toString() || '');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lockOnSend, setLockOnSend] = useState(true);

    const items = JSON.parse(request.itemsJson || '[]');

    // Calculate if within 15-minute grace period
    const GRACE_PERIOD_MINUTES = 15;
    const isWithinGracePeriod = () => {
        if (!request.quotedAt) return false;
        const quotedTime = new Date(request.quotedAt).getTime();
        const now = Date.now();
        const minutesSinceQuoted = (now - quotedTime) / (1000 * 60);
        return minutesSinceQuoted < GRACE_PERIOD_MINUTES;
    };

    // Lock form if:
    // - Explicitly locked OR
    // - Status is quoted/confirmed AND grace period has expired
    const isQuotedOrConfirmed = request.status === 'quoted' || request.status === 'confirmed';
    const isRejected = request.status === 'rejected';
    const isLocked = request.isLocked || (isQuotedOrConfirmed && !isWithinGracePeriod());

    // Calculate remaining time for display
    const getRemainingMinutes = () => {
        if (!request.quotedAt || !isQuotedOrConfirmed) return 0;
        const quotedTime = new Date(request.quotedAt).getTime();
        const now = Date.now();
        const minutesSinceQuoted = (now - quotedTime) / (1000 * 60);
        return Math.max(0, Math.ceil(GRACE_PERIOD_MINUTES - minutesSinceQuoted));
    };
    const remainingMinutes = getRemainingMinutes();

    const handleSendQuote = async () => {
        if (!price || isNaN(Number(price))) {
            setError('Please enter a valid price');
            return;
        }
        if (!file && !request.pdfFileName && !isLocked) {
            setError('Please upload a quote PDF');
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', request.id);
            formData.append('price', price);
            formData.append('lock', lockOnSend.toString());
            formData.append('sendEmail', lockOnSend.toString());
            if (file) formData.append('file', file);

            const result = await finalizeQuote(formData);
            if (result.success) {
                router.refresh();
                if (lockOnSend) {
                    router.push(`/${lng}/admin/requests`); // Redirect to inbox when locked
                }
            } else {
                setError(result.error || 'Failed to send quote');
            }
        });
    };

    const handleUnlock = async () => {
        startTransition(async () => {
            const result = await unlockQuote(request.id);
            if (result.success) {
                router.refresh();
            } else {
                setError(result.error || 'Failed to unlock quote');
            }
        });
    };

    const handleLock = async () => {
        startTransition(async () => {
            const result = await lockQuote(request.id);
            if (result.success) {
                router.refresh();
            } else {
                setError(result.error || 'Failed to lock quote');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href={`/${lng}/admin/requests`}
                    className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Inbox
                </Link>
                <div className="flex items-center gap-2">
                    {isLocked && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> LOCKED
                        </span>
                    )}
                    {/* Grace period indicator */}
                    {!isLocked && isQuotedOrConfirmed && remainingMinutes > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-500/20 flex items-center gap-1">
                            ⏱️ {remainingMinutes}min to edit
                        </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 ring-yellow-500/20' :
                        request.status === 'quoted' ? 'bg-blue-500/10 text-blue-500 ring-blue-500/20' :
                            'bg-green-500/10 text-green-500 ring-green-500/20'
                        }`}>
                        {request.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Details & Items */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Client Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Client Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-zinc-500">Name</p>
                                <p className="text-white font-medium">{request.clientName}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Email</p>
                                <p className="text-white font-medium">{request.clientEmail}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Company</p>
                                <p className="text-white font-medium">{request.clientCompany || '-'}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Dates</p>
                                <p className="text-white font-medium">
                                    {format(new Date(request.rentalStartDate), 'MMM d, yyyy')} - {format(new Date(request.rentalEndDate), 'MMM d, yyyy')}
                                </p>
                            </div>
                        </div>
                        {request.projectDescription && (
                            <div className="mt-4 pt-4 border-t border-zinc-800">
                                <p className="text-zinc-500 mb-1">Project Description</p>
                                <p className="text-zinc-300">{request.projectDescription}</p>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                            <h3 className="text-lg font-semibold text-white">Requested Items</h3>
                        </div>
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-950">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                                {items.map((item: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">{item.name}</div>
                                            {item.kitSelections && Object.keys(item.kitSelections).length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {Object.entries(item.kitSelections).map(([key, val]) => (
                                                        <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                            {val as string}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-white font-mono">
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sticky top-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Pricing & Actions</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-zinc-400 mb-1">
                                    Total Estimated Price ($)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                    <input
                                        type="number"
                                        id="price"
                                        value={price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            setError(null);
                                        }}
                                        disabled={isLocked}
                                        placeholder="0.00"
                                        className="block w-full pl-7 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label htmlFor="quote-file" className="block text-sm font-medium text-zinc-400 mb-1">
                                    Upload Official Quote (PDF)
                                </label>
                                <input
                                    type="file"
                                    id="quote-file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFile(e.target.files[0]);
                                            setError(null);
                                        }
                                    }}
                                    disabled={isLocked}
                                    className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                {isLocked && request.pdfFileName && (
                                    <p className="mt-2 text-xs text-green-500 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Uploaded: {request.pdfFileName}
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="pt-4 border-t border-zinc-800 space-y-3">
                                {/* Lock on Send Toggle */}
                                {!isLocked && !isRejected && (
                                    <label className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={lockOnSend}
                                            onChange={(e) => setLockOnSend(e.target.checked)}
                                            className="w-4 h-4 rounded border-zinc-600 bg-zinc-900 text-red-500 focus:ring-red-500/50"
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-white flex items-center gap-1.5">
                                                <Lock className="w-3.5 h-3.5" />
                                                Lock & Notify Client
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                Client will receive email with quote link
                                            </span>
                                        </div>
                                    </label>
                                )}

                                {/* Send Quote Button */}
                                {!isLocked && !isRejected && (
                                    <button
                                        onClick={handleSendQuote}
                                        disabled={isPending}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-600 text-white font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending ? (
                                            <span className="animate-pulse">Processing...</span>
                                        ) : lockOnSend ? (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Quote to Client
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-4 h-4" />
                                                Save as Draft
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Locked State: Show status and unlock button */}
                                {isLocked && !isRejected && (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                                            <p className="text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Quote Sent & Locked
                                            </p>
                                            <p className="text-zinc-500 text-xs mt-1">
                                                Waiting for client response
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleUnlock}
                                            disabled={isPending}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
                                        >
                                            {isPending ? (
                                                <span className="animate-pulse">Unlocking...</span>
                                            ) : (
                                                <>
                                                    <Unlock className="w-4 h-4" />
                                                    Unlock for Editing
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Rejected State */}
                                {isRejected && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                                        <p className="text-red-400 text-sm font-medium flex items-center justify-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Quote Declined by Client
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
