/**
 * Quote Actions Component
 * 
 * Client component to handle user interactions on the public quote page.
 * Includes:
 * - Accept & Sign button (triggers SignatureModal)
 * - Reject button (triggers RejectModal with optional reason)
 */

'use client'

import { useState } from 'react'
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Textarea,
} from '@heroui/react'
import { Pen, XCircle, AlertTriangle } from 'lucide-react'
import { SignatureModal } from './signature-modal'
import { acceptQuote, rejectQuote } from '@/lib/actions/quote'
import { ENABLE_DIGITAL_SIGNATURE } from '@/lib/config'
import { useRouter } from 'next/navigation'

interface QuoteActionsProps {
    quoteId: string
    accessToken: string
    confirmationNumber: string
    status: string
}

export function QuoteActions({
    quoteId,
    accessToken,
    confirmationNumber,
    status
}: QuoteActionsProps) {
    const [isSignModalOpen, setIsSignModalOpen] = useState(false)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const router = useRouter()

    // Only show for 'quoted' status
    if (status !== 'quoted') {
        return null
    }

    const handleSignQuote = async (formData: FormData) => {
        setIsSubmitting(true)
        try {
            const result = await acceptQuote(quoteId, accessToken, formData)

            if (result.success) {
                setIsSignModalOpen(false)
                router.refresh()
            } else {
                alert(result.error || 'Failed to accept quote')
            }
        } catch (error) {
            console.error('Sign quote error:', error)
            alert('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRejectQuote = async () => {
        setIsSubmitting(true)
        try {
            const result = await rejectQuote(quoteId, accessToken, rejectReason.trim() || undefined)

            if (result.success) {
                setIsRejectModalOpen(false)
                router.refresh()
            } else {
                alert(result.error || 'Failed to reject quote')
            }
        } catch (error) {
            console.error('Reject quote error:', error)
            alert('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Decision Dock - Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {/* Reject Button */}
                <Button
                    color="danger"
                    variant="bordered"
                    size="lg"
                    className="font-semibold"
                    startContent={<XCircle className="w-5 h-5" />}
                    onPress={() => setIsRejectModalOpen(true)}
                >
                    Decline Quote
                </Button>

                {/* Accept & Sign Button */}
                {ENABLE_DIGITAL_SIGNATURE ? (
                    <Button
                        color="success"
                        size="lg"
                        className="font-semibold shadow-lg shadow-green-600/20"
                        startContent={<Pen className="w-5 h-5" />}
                        onPress={() => setIsSignModalOpen(true)}
                    >
                        Accept & Sign Quote
                    </Button>
                ) : (
                    <Button
                        color="success"
                        size="lg"
                        className="font-semibold shadow-lg shadow-green-600/20"
                        onPress={() => setIsSignModalOpen(true)}
                    >
                        Accept Quote
                    </Button>
                )}
            </div>

            {/* Signature Modal */}
            <SignatureModal
                isOpen={isSignModalOpen}
                onClose={() => setIsSignModalOpen(false)}
                onSubmit={handleSignQuote}
                isLoading={isSubmitting}
                confirmationNumber={confirmationNumber}
            />

            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => !isSubmitting && setIsRejectModalOpen(false)}
                size="md"
                classNames={{
                    base: 'bg-zinc-900 border border-zinc-800',
                    header: 'border-b border-zinc-800',
                    body: 'py-6',
                    footer: 'border-t border-zinc-800',
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                Decline Quote #{confirmationNumber}
                            </h2>
                            <p className="text-sm text-zinc-400 font-normal">
                                This action cannot be undone
                            </p>
                        </div>
                    </ModalHeader>

                    <ModalBody>
                        <p className="text-zinc-300 mb-4">
                            Are you sure you want to decline this quote?
                            If you have concerns or need changes, please contact us first.
                        </p>

                        <Textarea
                            label="Reason (optional)"
                            placeholder="Help us improve by sharing why you're declining..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            classNames={{
                                input: 'text-white',
                                inputWrapper: 'bg-zinc-800 border-zinc-700',
                            }}
                            minRows={3}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="ghost"
                            onPress={() => setIsRejectModalOpen(false)}
                            isDisabled={isSubmitting}
                            className="text-zinc-400"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleRejectQuote}
                            isLoading={isSubmitting}
                        >
                            Confirm Decline
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

