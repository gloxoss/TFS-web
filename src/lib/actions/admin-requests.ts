'use server';

import { verifyAdminAccess } from '@/services/auth/access-control';
import { createServerClient, createAdminClient } from '@/lib/pocketbase/server';
import { getQuoteService } from '@/services';
import type { Quote, QuoteStatus } from '@/services';
import { createActionLogger } from '@/lib/logger';

export interface GetRequestsResponse {
    items: Quote[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
}

export async function getAdminRentalRequests(
    page: number = 1,
    limit: number = 20,
    status?: QuoteStatus
): Promise<GetRequestsResponse> {
    // 1. Security Check
    const canAccess = await verifyAdminAccess();
    if (!canAccess) {
        throw new Error('Unauthorized Access');
    }

    // 2. Fetch Data (Use Admin Client to bypass API rules)
    const pb = await createAdminClient();
    const service = getQuoteService(pb);

    // Use Service Layer (handles mapping, json parsing, expansion)
    const result = await service.getQuotes(page, limit, status);

    return {
        items: result.items,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.perPage
    };
}


export async function getRequestDetails(id: string): Promise<Quote | null> {
    const canAccess = await verifyAdminAccess();
    if (!canAccess) return null;

    const pb = await createAdminClient();
    const service = getQuoteService(pb);

    try {
        const quote = await service.getQuoteById(id);
        return quote;
    } catch (error) {
        const log = createActionLogger('getRequestDetails');
        log.error('Failed to fetch quote details', error, { quoteId: id });
        return null;
    }
}

export async function updateQuotePricing(
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    const canAccess = await verifyAdminAccess();
    if (!canAccess) return { success: false, error: 'Unauthorized' };

    const id = formData.get('id') as string;
    const price = Number(formData.get('price'));
    const file = formData.get('file') as File;
    const sendEmail = formData.get('sendEmail') !== 'false'; // Default to true

    if (!id || !price || !file) {
        return { success: false, error: 'Missing required fields' };
    }

    const pb = await createAdminClient();
    const service = getQuoteService(pb);

    try {
        // Get quote details before update (for email)
        const quoteBeforeUpdate = await service.getQuoteById(id);
        if (!quoteBeforeUpdate) {
            return { success: false, error: 'Quote not found' };
        }

        // SERVER-SIDE LOCK ENFORCEMENT: Prevent modification of locked quotes
        const lockCheck = await pb.collection('quotes').getOne(id);
        if (lockCheck.is_locked && lockCheck.status === 'quoted') {
            return {
                success: false,
                error: 'This quote is locked. Please unlock it before making changes.'
            };
        }

        // Upload PDF and update quote
        const result = await service.uploadQuote(id, file, price);
        if (!result.success) {
            return { success: false, error: result.error };
        }

        // Get updated quote (now has access_token if it was set during create)
        const quoteRecord = await pb.collection('quotes').getOne(id);

        // Send email notification if enabled
        if (sendEmail && quoteRecord.access_token) {
            try {
                const { getEmailService } = await import('@/services');
                const emailService = getEmailService();

                await emailService.sendQuoteReadyNotification({
                    to: quoteBeforeUpdate.clientEmail,
                    customerName: quoteBeforeUpdate.clientName,
                    confirmationNumber: quoteBeforeUpdate.confirmationNumber || id,
                    quoteId: id,
                    accessToken: quoteRecord.access_token,
                    estimatedPrice: price,
                    language: quoteBeforeUpdate.language || 'en',
                });

                console.log(`📧 Quote ready email sent to ${quoteBeforeUpdate.clientEmail}`);
            } catch (emailError) {
                // Log but don't fail the action if email fails
                const log = createActionLogger('updateQuotePricing');
                log.warn('Failed to send quote ready email', { error: emailError, email: quoteBeforeUpdate.clientEmail });
            }
        }

        return { success: true };
    } catch (error: any) {
        const log = createActionLogger('updateQuotePricing');
        log.error('Quote pricing update failed', error, { quoteId: id });
        return { success: false, error: error.message || 'Failed to update quote' };
    }
}

/**
 * Lock Quote - Prevents further edits and makes it ready for client review
 * 
 * When locked:
 * - Admin cannot edit pricing/items without unlocking first
 * - Client can view the finalized quote via magic link
 */
export async function lockQuote(
    quoteId: string
): Promise<{ success: boolean; error?: string }> {
    const canAccess = await verifyAdminAccess();
    if (!canAccess) return { success: false, error: 'Unauthorized' };

    const pb = await createAdminClient();

    try {
        // Verify quote exists and has required data
        const quote = await pb.collection('quotes').getOne(quoteId);

        if (!quote.quote_pdf) {
            return { success: false, error: 'Cannot lock quote without a PDF document. Please upload a quote first.' };
        }

        if (!quote.estimated_price) {
            return { success: false, error: 'Cannot lock quote without a price. Please set the price first.' };
        }

        // Lock the quote
        await pb.collection('quotes').update(quoteId, {
            is_locked: true,
            status: 'quoted', // Move to quoted status when locked
        });

        console.log(`🔒 Quote ${quoteId} locked`);
        return { success: true };
    } catch (error: any) {
        console.error('Error locking quote:', error);
        return { success: false, error: error.message || 'Failed to lock quote' };
    }
}

/**
 * Unlock Quote - Allows admin to make further edits
 * 
 * Use with caution: If client is already viewing the quote,
 * changes may cause confusion.
 */
export async function unlockQuote(
    quoteId: string
): Promise<{ success: boolean; error?: string }> {
    const canAccess = await verifyAdminAccess();
    if (!canAccess) return { success: false, error: 'Unauthorized' };

    const pb = await createAdminClient();

    try {
        // Verify quote exists and check status
        const quote = await pb.collection('quotes').getOne(quoteId);

        // Cannot unlock if already confirmed or rejected
        if (quote.status === 'confirmed' || quote.status === 'rejected') {
            return {
                success: false,
                error: `Cannot unlock a ${quote.status} quote. The client has already made a decision.`
            };
        }

        // Unlock the quote
        await pb.collection('quotes').update(quoteId, {
            is_locked: false,
            status: 'reviewing', // Move back to reviewing status
        });

        console.log(`🔓 Quote ${quoteId} unlocked`);
        return { success: true };
    } catch (error: any) {
        console.error('Error unlocking quote:', error);
        return { success: false, error: error.message || 'Failed to unlock quote' };
    }
}

/**
 * Finalize Quote - Upload PDF, set price, lock, and notify client in one action
 * 
 * This is the main "Send to Client" action combining:
 * 1. Upload quote PDF
 * 2. Set final price
 * 3. Lock the quote
 * 4. Send email notification to client
 */
export async function finalizeQuote(
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    const canAccess = await verifyAdminAccess();
    if (!canAccess) return { success: false, error: 'Unauthorized' };

    const id = formData.get('id') as string;
    const price = Number(formData.get('price'));
    const file = formData.get('file') as File | null;
    const shouldLock = formData.get('lock') === 'true';
    const sendEmail = formData.get('sendEmail') !== 'false';

    if (!id || !price) {
        return { success: false, error: 'Missing quote ID or price' };
    }

    const pb = await createAdminClient();
    const service = getQuoteService(pb);

    try {
        // Get quote details before update
        const quote = await service.getQuoteById(id);
        if (!quote) {
            return { success: false, error: 'Quote not found' };
        }

        // SERVER-SIDE LOCK ENFORCEMENT: Check if quote is locked
        const lockCheckRecord = await pb.collection('quotes').getOne(id);
        if (lockCheckRecord.is_locked && lockCheckRecord.status === 'quoted') {
            return {
                success: false,
                error: 'This quote is locked and cannot be modified. Please unlock it first.'
            };
        }

        // If file provided, upload it
        if (file && file.size > 0) {
            const uploadResult = await service.uploadQuote(id, file, price);
            if (!uploadResult.success) {
                return { success: false, error: uploadResult.error };
            }
        } else {
            // Just update the price without new file
            await pb.collection('quotes').update(id, {
                estimated_price: price,
            });
        }

        // Lock if requested
        if (shouldLock) {
            await pb.collection('quotes').update(id, {
                is_locked: true,
                status: 'quoted',
            });
        }

        // Get updated quote for email
        const quoteRecord = await pb.collection('quotes').getOne(id);

        // Send email notification
        if (sendEmail && quoteRecord.access_token) {
            try {
                const { getEmailService } = await import('@/services');
                const emailService = getEmailService();

                await emailService.sendQuoteReadyNotification({
                    to: quote.clientEmail,
                    customerName: quote.clientName,
                    confirmationNumber: quote.confirmationNumber || id,
                    quoteId: id,
                    accessToken: quoteRecord.access_token,
                    estimatedPrice: price,
                    language: quote.language || 'en',
                });

                console.log(`📧 Quote finalized and email sent to ${quote.clientEmail}`);
            } catch (emailError) {
                console.error('Failed to send finalization email:', emailError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error('Error finalizing quote:', error);
        return { success: false, error: error.message || 'Failed to finalize quote' };
    }
}

/**
 * Admin Confirm Quote - Manually mark a quote as confirmed
 * 
 * Use when client confirms via phone/email instead of magic link.
 * Only works for quotes in 'quoted' status.
 */
export async function adminConfirmQuote(
    quoteId: string,
    note?: string
): Promise<{ success: boolean; error?: string }> {
    const canAccess = await verifyAdminAccess();
    if (!canAccess) return { success: false, error: 'Unauthorized' };

    const pb = await createAdminClient();

    try {
        const quote = await pb.collection('quotes').getOne(quoteId);

        // Validate current status
        if (quote.status === 'confirmed') {
            return { success: false, error: 'Quote is already confirmed' };
        }
        if (quote.status === 'rejected') {
            return { success: false, error: 'Cannot confirm a rejected quote' };
        }
        if (quote.status === 'pending' || quote.status === 'reviewing') {
            return { success: false, error: 'Please finalize and send the quote first before confirming' };
        }

        // Update to confirmed
        const internalNotes = quote.internal_notes || '';
        const timestamp = new Date().toISOString();
        const confirmNote = `[ADMIN CONFIRMED - ${timestamp}]${note ? `: ${note}` : ' (Manual confirmation)'}`;

        await pb.collection('quotes').update(quoteId, {
            status: 'confirmed',
            internal_notes: `${internalNotes}\n\n${confirmNote}`.trim(),
        });

        console.log(`✅ Quote ${quoteId} manually confirmed by admin`);
        return { success: true };
    } catch (error: any) {
        console.error('Error confirming quote:', error);
        return { success: false, error: error.message || 'Failed to confirm quote' };
    }
}

/**
 * Admin Reject Quote - Manually mark a quote as rejected
 * 
 * Use when admin needs to decline a quote (item unavailable, etc.)
 */
export async function adminRejectQuote(
    quoteId: string,
    reason?: string
): Promise<{ success: boolean; error?: string }> {
    const canAccess = await verifyAdminAccess();
    if (!canAccess) return { success: false, error: 'Unauthorized' };

    const pb = await createAdminClient();

    try {
        const quote = await pb.collection('quotes').getOne(quoteId);

        if (quote.status === 'confirmed') {
            return { success: false, error: 'Cannot reject a confirmed quote' };
        }
        if (quote.status === 'rejected') {
            return { success: false, error: 'Quote is already rejected' };
        }

        const internalNotes = quote.internal_notes || '';
        const timestamp = new Date().toISOString();
        const rejectNote = `[ADMIN REJECTED - ${timestamp}]${reason ? `: ${reason}` : ''}`;

        await pb.collection('quotes').update(quoteId, {
            status: 'rejected',
            internal_notes: `${internalNotes}\n\n${rejectNote}`.trim(),
        });

        console.log(`❌ Quote ${quoteId} rejected by admin`);
        return { success: true };
    } catch (error: any) {
        console.error('Error rejecting quote:', error);
        return { success: false, error: error.message || 'Failed to reject quote' };
    }
}
