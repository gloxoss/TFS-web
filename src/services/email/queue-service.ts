/**
 * Email Queue Service
 * 
 * Manages email queue for reliable delivery with retry logic.
 * Emails are stored in PocketBase and processed by background job.
 */

import PocketBase from 'pocketbase'
import { createServiceLogger } from '@/lib/logger'
import type { IEmailService } from './interface'
import type {
    EmailQueueRecord,
    EnqueueEmailParams,
    QueueProcessResult,
    EmailQueueStatus
} from './queue-types'

const log = createServiceLogger('EmailQueue')

/**
 * Enqueue an email for background processing
 * Non-blocking - returns immediately after saving to database
 */
export async function enqueueEmail(
    pb: PocketBase,
    params: EnqueueEmailParams
): Promise<{ success: boolean; queueId?: string; error?: string }> {
    try {
        const record = await pb.collection('email_queue').create({
            to: params.to,
            subject: params.subject,
            html: params.html,
            reply_to: params.replyTo,
            status: 'pending',
            attempts: 0,
            max_attempts: params.maxAttempts || 3,
            next_attempt_at: new Date().toISOString(), // Send immediately
            payload_type: params.payloadType,
            payload_data: params.payloadData,
        })

        log.info('Email enqueued', { queueId: record.id, to: params.to, payloadType: params.payloadType })
        return { success: true, queueId: record.id }
    } catch (error) {
        log.error('Failed to enqueue email', error, { to: params.to, payloadType: params.payloadType })
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Process pending emails in queue
 * Should be called by background cron job
 */
export async function processEmailQueue(
    pb: PocketBase,
    emailService: IEmailService,
    limit: number = 10
): Promise<QueueProcessResult> {
    let processed = 0
    let sent = 0
    let failed = 0

    try {
        // Get pending emails ready to send
        const now = new Date().toISOString()
        const pendingEmails = await pb.collection('email_queue').getList<EmailQueueRecord>(1, limit, {
            filter: `status = 'pending' && next_attempt_at <= '${now}'`,
            sort: 'created'
        })

        log.debug('Processing email queue', { found: pendingEmails.items.length })

        for (const email of pendingEmails.items) {
            processed++

            try {
                // Send email
                const result = await emailService.send({
                    to: email.to,
                    subject: email.subject,
                    html: email.html,
                    replyTo: email.reply_to
                })

                if (result.success) {
                    // Mark as sent
                    await pb.collection('email_queue').update(email.id, {
                        status: 'sent',
                        sent_at: new Date().toISOString()
                    })
                    sent++
                    log.info('Email sent successfully', { queueId: email.id, to: email.to })
                } else {
                    // Retry logic
                    await handleEmailFailure(pb, email, result.error || 'Unknown error')
                    failed++
                }
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Unexpected error'
                await handleEmailFailure(pb, email, errorMsg)
                log.error('Email send exception', error, { queueId: email.id })
                failed++
            }
        }

        if (processed > 0) {
            log.info('Email queue batch processed', { processed, sent, failed })
        }
    } catch (error) {
        log.error('Email queue processing failed', error)
    }

    return { processed, sent, failed }
}

/**
 * Handle email send failure with exponential backoff retry logic
 */
async function handleEmailFailure(
    pb: PocketBase,
    email: EmailQueueRecord,
    errorMessage: string
): Promise<void> {
    const newAttempts = email.attempts + 1
    const maxAttempts = email.max_attempts || 3

    if (newAttempts >= maxAttempts) {
        // Max attempts reached, mark as failed
        await pb.collection('email_queue').update(email.id, {
            status: 'failed',
            attempts: newAttempts,
            error_message: errorMessage
        })
        log.warn('Email failed after max attempts', {
            queueId: email.id,
            to: email.to,
            attempts: newAttempts,
            error: errorMessage
        })
    } else {
        // Schedule retry with exponential backoff: 5min, 10min, 20min
        const backoffMinutes = Math.pow(2, newAttempts) * 5
        const nextAttempt = new Date(Date.now() + backoffMinutes * 60 * 1000)

        await pb.collection('email_queue').update(email.id, {
            attempts: newAttempts,
            next_attempt_at: nextAttempt.toISOString(),
            error_message: errorMessage
        })
        log.info('Email retry scheduled', {
            queueId: email.id,
            to: email.to,
            attempt: newAttempts,
            nextAttempt: nextAttempt.toISOString(),
            backoffMinutes
        })
    }
}

/**
 * Get queue statistics for monitoring
 */
export async function getQueueStats(pb: PocketBase): Promise<{
    pending: number
    sent: number
    failed: number
}> {
    try {
        const [pending, sent, failed] = await Promise.all([
            pb.collection('email_queue').getList(1, 1, { filter: 'status = "pending"' }),
            pb.collection('email_queue').getList(1, 1, { filter: 'status = "sent"' }),
            pb.collection('email_queue').getList(1, 1, { filter: 'status = "failed"' })
        ])

        return {
            pending: pending.totalItems,
            sent: sent.totalItems,
            failed: failed.totalItems
        }
    } catch (error) {
        log.error('Failed to get queue stats', error)
        return { pending: 0, sent: 0, failed: 0 }
    }
}
