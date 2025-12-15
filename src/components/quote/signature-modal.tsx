/**
 * Signature Modal Component
 * 
 * Modal for capturing digital signatures when accepting quotes.
 * Uses react-signature-canvas for drawing signatures.
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from '@heroui/react'
import { Eraser, Check, X, Pen } from 'lucide-react'
import SignatureCanvas from 'react-signature-canvas'

interface SignatureModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (signatureData: FormData) => Promise<void>
    isLoading?: boolean
    confirmationNumber?: string
}

export function SignatureModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    confirmationNumber,
}: SignatureModalProps) {
    const sigCanvasRef = useRef<SignatureCanvas>(null)
    const [isEmpty, setIsEmpty] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Clear the signature pad
    const handleClear = useCallback(() => {
        sigCanvasRef.current?.clear()
        setIsEmpty(true)
        setError(null)
    }, [])

    // Handle drawing end to update isEmpty state
    const handleEnd = useCallback(() => {
        if (sigCanvasRef.current) {
            setIsEmpty(sigCanvasRef.current.isEmpty())
        }
    }, [])

    // Submit the signature
    const handleSubmit = useCallback(async () => {
        if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
            setError('Please sign above to accept the quote.')
            return
        }

        setError(null)

        try {
            // Convert signature to PNG blob
            const dataUrl = sigCanvasRef.current.toDataURL('image/png')
            const response = await fetch(dataUrl)
            const blob = await response.blob()

            // Create FormData with signature file
            const formData = new FormData()
            formData.append('signature', blob, 'signature.png')

            await onSubmit(formData)
        } catch (err) {
            console.error('Signature submission error:', err)
            setError('Failed to process signature. Please try again.')
        }
    }, [onSubmit])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            backdrop="blur"
            classNames={{
                base: "bg-content1",
                header: "border-b border-divider",
                footer: "border-t border-divider",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">Accept Quote</h3>
                    {confirmationNumber && (
                        <p className="text-sm text-default-500">
                            Quote: {confirmationNumber}
                        </p>
                    )}
                </ModalHeader>

                <ModalBody className="py-6">
                    <div className="space-y-4">
                        {/* Instructions */}
                        <div className="flex items-center gap-2 text-sm text-default-600">
                            <Pen className="w-4 h-4" />
                            <span>Sign below to accept this quote and confirm your rental.</span>
                        </div>

                        {/* Signature Canvas */}
                        <div className="relative border-2 border-dashed border-default-300 rounded-lg bg-white">
                            <SignatureCanvas
                                ref={sigCanvasRef}
                                penColor="black"
                                canvasProps={{
                                    width: 500,
                                    height: 200,
                                    className: 'w-full h-[200px] rounded-lg cursor-crosshair',
                                }}
                                onEnd={handleEnd}
                            />

                            {/* Signature line */}
                            <div className="absolute bottom-8 left-8 right-8 border-b border-default-400" />
                            <span className="absolute bottom-2 left-8 text-xs text-default-400">
                                Sign above the line
                            </span>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className="text-sm text-danger">{error}</p>
                        )}

                        {/* Clear button */}
                        <Button
                            variant="flat"
                            size="sm"
                            startContent={<Eraser className="w-4 h-4" />}
                            onPress={handleClear}
                            isDisabled={isEmpty || isLoading}
                        >
                            Clear Signature
                        </Button>

                        {/* Legal notice */}
                        <p className="text-xs text-default-400">
                            By signing above, you agree to the terms and conditions outlined in this quote.
                            This signature constitutes a legally binding acceptance of the rental agreement.
                        </p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="flat"
                        onPress={onClose}
                        isDisabled={isLoading}
                        startContent={<X className="w-4 h-4" />}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                        isDisabled={isEmpty || isLoading}
                        startContent={!isLoading && <Check className="w-4 h-4" />}
                    >
                        {isLoading ? 'Processing...' : 'Accept & Sign'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
