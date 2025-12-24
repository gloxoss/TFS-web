/**
 * Email Queue Cron Processor
 * 
 * Background job to process pending emails from queue.
 * Called every 5 minutes by Vercel Cron or external scheduler.
 * 
 * Endpoint: /api/cron/process-email-queue
 * Method: GET
 * Auth: Bearer token (CRON_SECRET)
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/pocketbase/server'
import { getEmailService } from '@/services'
import { processEmailQueue } from '@/services/email/queue-service'
import { createActionLogger } from '@/lib/logger'

const log = createActionLogger('EmailQueueCron')

export async function GET(request: Request) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization')
        const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

        if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
            log.warn('Unauthorized cron attempt', {
                hasSecret: !!process.env.CRON_SECRET,
                hasAuth: !!authHeader
            })
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        log.info('Email queue cron started')

        // Get admin client and email service
        const pb = await createAdminClient()
        const emailService = getEmailService()

        // Process up to 20 emails per run
        const result = await processEmailQueue(pb, emailService, 20)

        log.info('Email queue cron completed', result)

        return NextResponse.json({
            success: true,
            ...result,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        log.error('Email queue cron failed', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
