import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PocketBaseQuoteService } from '../pocketbase-service'
import PocketBase from 'pocketbase'

// Hoist mock functions so they are available in vi.mock factory
const mocks = vi.hoisted(() => {
    return {
        collection: vi.fn(),
        create: vi.fn(),
        getOne: vi.fn(),
        getList: vi.fn(),
        update: vi.fn(),
        authWithPassword: vi.fn(),
    }
})

// Mock the module using a class for the default export
vi.mock('pocketbase', () => {
    const mockPbInstance = {
        collection: mocks.collection,
        authStore: {
            isValid: true,
            model: { id: 'admin' },
            save: vi.fn(),
            clear: vi.fn(),
        },
    }

    return {
        default: class {
            constructor() {
                return mockPbInstance
            }
        }
    }
})

describe('PocketBaseQuoteService', () => {
    let service: PocketBaseQuoteService

    beforeEach(() => {
        vi.clearAllMocks()

        // Setup chainable returns
        mocks.collection.mockReturnValue({
            create: mocks.create,
            getOne: mocks.getOne,
            getList: mocks.getList,
            update: mocks.update,
            authWithPassword: mocks.authWithPassword,
        })

        // Instantiate service with the mocked PocketBase
        service = new PocketBaseQuoteService(new PocketBase('http://test.url') as any)
    })

    describe('createQuote', () => {
        it('should create a quote with correct payload', async () => {
            const payload = {
                clientName: 'John Doe',
                clientEmail: 'john@example.com',
                clientPhone: '1234567890',
                items: [],
                rentalStartDate: '2024-01-01',
                rentalEndDate: '2024-01-03',
            }

            const mockRecord = {
                id: 'quote_123',
                ...payload,
                created: '2024-01-01',
                updated: '2024-01-01',
                status: 'pending',
            }

            mocks.create.mockResolvedValue(mockRecord)

            const result = await service.createQuote(payload)

            expect(result.success).toBe(true)
            expect(mocks.collection).toHaveBeenCalledWith('quotes')
            expect(mocks.create).toHaveBeenCalled()
        })
    })

    describe('getQuoteByToken', () => {
        it('should return quote if token matches', async () => {
            const quoteId = 'quote_123'
            const token = 'valid_token'
            const mockRecord = {
                id: quoteId,
                access_token: token,
                client_name: 'John Doe',
                items_json: '[]',
                rental_start_date: '2024-01-01',
                rental_end_date: '2024-01-03',
                status: 'pending',
                created: '2024-01-01',
                updated: '2024-01-01',
            }

            mocks.authWithPassword.mockResolvedValue(true)
            mocks.getOne.mockResolvedValue(mockRecord)

            const result = await service.getQuoteByToken(quoteId, token)

            expect(result).not.toBeNull()
            expect(result?.id).toBe(quoteId)

            // Check if auth was called on the instance
            expect(mocks.collection).toHaveBeenCalledWith('_superusers')
            expect(mocks.authWithPassword).toHaveBeenCalled()
            expect(mocks.collection).toHaveBeenCalledWith('quotes')
            expect(mocks.getOne).toHaveBeenCalledWith(quoteId)
        })

        it('should return null if token does not match', async () => {
            const quoteId = 'quote_123'
            const token = 'invalid_token'
            const mockRecord = {
                id: quoteId,
                access_token: 'real_token', // Mismatch
            }

            mocks.getOne.mockResolvedValue(mockRecord)

            const result = await service.getQuoteByToken(quoteId, token)

            expect(result).toBeNull()
        })
    })
})
