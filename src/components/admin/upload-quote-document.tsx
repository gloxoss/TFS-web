'use client'

/**
 * Upload Quote Document Modal
 *
 * Admin component to finalize and send quotes to clients.
 * Features:
 * - PDF file upload dropzone
 * - Price input field
 * - Lock & Send toggle
 * - Submit to finalize quote
 */

import { useState, useCallback, useTransition } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Switch,
    Progress,
} from '@heroui/react'
import { useDropzone } from 'react-dropzone'
import { FileUp, X, Lock, Send, AlertCircle, Check } from 'lucide-react'
import { finalizeQuote } from '@/lib/actions/admin-requests'
import { cn } from '@/lib/utils'

interface UploadQuoteDocumentProps {
    isOpen: boolean
    onClose: () => void
    quoteId: string
    currentPrice?: number
    confirmationNumber?: string
    onSuccess?: () => void
}

export function UploadQuoteDocument({
    isOpen,
    onClose,
    quoteId,
    currentPrice = 0,
    confirmationNumber,
    onSuccess,
}: UploadQuoteDocumentProps) {
    const [file, setFile] = useState<File | null>(null)
    const [price, setPrice] = useState(currentPrice.toString())
    const [lockAndSend, setLockAndSend] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
            setError(null)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
    })

    const handleSubmit = () => {
        if (!price || Number(price) <= 0) {
            setError('Please enter a valid price')
            return
        }

        setError(null)

        startTransition(async () => {
            const formData = new FormData()
            formData.append('id', quoteId)
            formData.append('price', price)
            formData.append('lock', lockAndSend.toString())
            formData.append('sendEmail', lockAndSend.toString())

            if (file) {
                formData.append('file', file)
            }

            const result = await finalizeQuote(formData)

            if (result.success) {
                setSuccess(true)
                setTimeout(() => {
                    onClose()
                    onSuccess?.()
                    // Reset state
                    setFile(null)
                    setPrice('')
                    setSuccess(false)
                }, 1500)
            } else {
                setError(result.error || 'Failed to finalize quote')
            }
        })
    }

    const handleClose = () => {
        if (!isPending) {
            setFile(null)
            setError(null)
            setSuccess(false)
            onClose()
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="lg"
            classNames={{
                base: 'bg-zinc-900 border border-zinc-800',
                header: 'border-b border-zinc-800',
                body: 'py-6',
                footer: 'border-t border-zinc-800',
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-white">
                        Finalize Quote {confirmationNumber && `#${confirmationNumber}`}
                    </h2>
                    <p className="text-sm text-zinc-400 font-normal">
                        Upload the official quote PDF and set the final price
                    </p>
                </ModalHeader>

                <ModalBody className="space-y-6">
                    {/* PDF Upload Dropzone */}
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Quote Document (PDF)
                        </label>
                        <div
                            {...getRootProps()}
                            className={cn(
                                'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
                                isDragActive
                                    ? 'border-primary bg-primary/10'
                                    : file
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800/50'
                            )}
                        >
                            <input {...getInputProps()} />
                            {file ? (
                                <div className="flex items-center justify-center gap-3">
                                    <Check className="w-8 h-8 text-green-500" />
                                    <div className="text-left">
                                        <p className="text-white font-medium">{file.name}</p>
                                        <p className="text-sm text-zinc-400">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="ghost"
                                        className="ml-4"
                                        onPress={(e) => {
                                            e.stopPropagation()
                                            setFile(null)
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <FileUp className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                                    <p className="text-zinc-300 mb-1">
                                        Drag & drop your PDF here, or click to browse
                                    </p>
                                    <p className="text-sm text-zinc-500">Max size: 10MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Price Input */}
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Total Price (MAD)
                        </label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter the total quote price"
                            startContent={<span className="text-zinc-500">MAD</span>}
                            classNames={{
                                input: 'text-white text-lg',
                                inputWrapper: 'bg-zinc-800 border-zinc-700',
                            }}
                        />
                    </div>

                    {/* Lock & Send Toggle */}
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                        <div className="flex items-center gap-3">
                            {lockAndSend ? (
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Lock className="w-5 h-5 text-primary" />
                                </div>
                            ) : (
                                <div className="p-2 bg-zinc-700 rounded-lg">
                                    <Send className="w-5 h-5 text-zinc-400" />
                                </div>
                            )}
                            <div>
                                <p className="text-white font-medium">Lock & Send to Client</p>
                                <p className="text-sm text-zinc-400">
                                    {lockAndSend
                                        ? 'Quote will be locked and client will be notified'
                                        : 'Save as draft without notifying client'}
                                </p>
                            </div>
                        </div>
                        <Switch
                            isSelected={lockAndSend}
                            onValueChange={setLockAndSend}
                            color="primary"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
                            <Check className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">Quote finalized successfully!</p>
                        </div>
                    )}

                    {/* Loading Progress */}
                    {isPending && (
                        <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Uploading..."
                            classNames={{
                                indicator: 'bg-gradient-to-r from-primary to-secondary',
                            }}
                        />
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        onPress={handleClose}
                        isDisabled={isPending}
                        className="text-zinc-400"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleSubmit}
                        isDisabled={isPending || (!file && !currentPrice)}
                        isLoading={isPending}
                        startContent={!isPending && <Send className="w-4 h-4" />}
                    >
                        {lockAndSend ? 'Lock & Send Quote' : 'Save Draft'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
