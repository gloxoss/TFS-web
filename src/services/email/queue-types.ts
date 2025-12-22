/**
 * Email Queue Types
 * 
 * Type definitions for the email queue system
 */

export type EmailQueueStatus = 'pending' | 'sent' | 'failed'

export type EmailPayloadType =
    | 'quote_confirmation'
    | 'admin_notification'
    | 'quote_ready'

export interface EmailQueueRecord {
    id: string
    to: string
    subject: string
    html: string
    reply_to?: string
    status: EmailQueueStatus
    attempts: number
    max_attempts: number
    error_message?: string
    sent_at?: string
    next_attempt_at?: string
    payload_type: EmailPayloadType
    payload_data: any
    created: string
    updated: string
}

export interface EnqueueEmailParams {
    to: string
    subject: string
    html: string
    replyTo?: string
    payloadType: EmailPayloadType
    payloadData: any
    maxAttempts?: number
}

export interface QueueProcessResult {
    processed: number
    sent: number
    failed: number
}
