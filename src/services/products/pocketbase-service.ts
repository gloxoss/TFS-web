import PocketBase, { RecordModel } from 'pocketbase';
import { IProductService, ProductFilters, PaginatedResult } from './interface';
import { Product, Category } from './types';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

/**
 * Map raw DB record to clean Product type
 * 
 * CATALOG MODE / BLIND QUOTE:
 * - Does NOT expose: dailyRate, stockTotal, stockAvailable
 * - Only exposes isAvailable boolean (computed from stock)
 * - Pricing and stock data never reaches the client
 * 
 * Handles TDD schema fields (name_en, name_fr, description_en, description_fr)
 * with fallback to legacy single-language fields for compatibility.
 * 
 * @param record - PocketBase record
 * @param lang - Language code (defaults to 'en')
 */
function mapRecordToProduct(record: RecordModel, lang: string = 'en'): Product {
    // Handle bilingual name (TDD: name_en, name_fr) with fallback
    const nameEn = record.name_en || record.name || ''
    const nameFr = record.name_fr || record.name || nameEn
    const name = lang === 'fr' ? nameFr : nameEn

    // Handle bilingual description (TDD: description_en, description_fr)
    const descriptionEn = record.description_en || record.description
    const descriptionFr = record.description_fr || record.description || descriptionEn
    const description = lang === 'fr' ? descriptionFr : descriptionEn

    // Handle bilingual specs (TDD: specs_en, specs_fr)
    const specsEn = record.specs_en
    const specsFr = record.specs_fr
    const specsRaw = lang === 'fr' ? (specsFr || specsEn) : (specsEn || specsFr)

    // Parse specs if it's a string
    let specs: Record<string, string | number> = {}
    if (typeof specsRaw === 'string') {
        try {
            specs = JSON.parse(specsRaw)
        } catch {
            specs = {}
        }
    } else if (typeof specsRaw === 'object' && specsRaw !== null) {
        specs = specsRaw
    } else if (record.specs) {
        specs = typeof record.specs === 'string' ? JSON.parse(record.specs) : record.specs
    }

    // Calculate availability without exposing stock numbers
    const stockAvailable = record.stock_available ?? record.stock_total ?? record.stock ?? 0
    const isAvailable = record.visibility !== false &&
        record.availability_status !== 'maintenance' &&
        stockAvailable > 0

    // Return PUBLIC Product type - NO pricing or stock numbers exposed
    return {
        id: record.id,
        // Bilingual fields
        nameEn,
        nameFr,
        name,
        slug: record.slug || record.id,
        categoryId: record.category,
        brand: record.brand,
        // Bilingual descriptions
        descriptionEn,
        descriptionFr,
        description,
        // Bilingual specs
        specsEn: record.specs_en,
        specsFr: record.specs_fr,
        specs,
        // Images - handle both array and single file fields
        imageUrl: Array.isArray(record.images) && record.images[0]
            ? `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.images[0]}`
            : record.image
                ? `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.image}`
                : undefined,
        images: Array.isArray(record.images)
            ? record.images.map((img: string) =>
                `${PB_URL}/api/files/${record.collectionId}/${record.id}/${img}`
            )
            : undefined,
        // Status flags - ONLY boolean availability, no stock numbers
        isFeatured: record.featured || record.is_featured || false,
        isAvailable,
        visibility: record.visibility !== false,
        // NOTE: dailyRate, stockTotal, stockAvailable are INTENTIONALLY OMITTED
        // They are only available via ProductInternal for admin use
    }
}

// Wrapper for use in .map() - uses default English
const mapRecordToProductDefault = (record: RecordModel): Product => mapRecordToProduct(record, 'en');

// Map raw DB record to clean Category type
const mapRecordToCategory = (record: RecordModel): Category => ({
    id: record.id,
    name: record.name,
    slug: record.slug || record.id,
    description: record.description,
    thumbnail: record.thumbnail
        ? `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.thumbnail}`
        : undefined,
});

// Collection names per TDD cinema-tdd.md
const EQUIPMENT_COLLECTION = 'equipment';
const CATEGORIES_COLLECTION = 'categories';

export class PocketBaseProductService implements IProductService {
    private pb: PocketBase;

    constructor(pbClient: PocketBase) {
        this.pb = pbClient;
    }

    async getAllProducts(): Promise<Product[]> {
        try {
            const records = await this.pb.collection(EQUIPMENT_COLLECTION).getFullList({
                // sort: 'name',
            });
            return records.map(mapRecordToProductDefault);
        } catch (error) {
            console.error('Error fetching all products:', error);
            return [];
        }
    }

    async getProductById(id: string): Promise<Product | null> {
        try {
            const record = await this.pb.collection(EQUIPMENT_COLLECTION).getOne(id, {
                // expand: 'category',
            });
            const product = mapRecordToProduct(record);
            if (record.expand?.category) {
                product.category = mapRecordToCategory(record.expand.category);
            }
            return product;
        } catch (error) {
            console.error('Error fetching product by id:', error);
            return null;
        }
    }

    async getProductBySlug(slug: string, retries: number = 3): Promise<Product | null> {
        // Add retry logic for cold start / connection issues
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const record = await this.pb.collection(EQUIPMENT_COLLECTION).getFirstListItem(
                    `slug = "${slug}"`,
                    // { expand: 'category' }
                );
                const product = mapRecordToProduct(record);
                if (record.expand?.category) {
                    product.category = mapRecordToCategory(record.expand.category);
                }
                return product;
            } catch (error: any) {
                const isNotFound = error?.status === 404 || error?.message?.includes('not found');

                // If it's genuinely not found (not a connection error), don't retry
                if (isNotFound) {
                    console.log(`Product with slug "${slug}" not found in database`);
                    return null;
                }

                // Log the error with attempt number
                console.error(`Error fetching product by slug (attempt ${attempt}/${retries}):`, error);

                // Wait before retrying (exponential backoff)
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, attempt * 200));
                }
            }
        }

        // All retries exhausted
        console.error(`Failed to fetch product with slug "${slug}" after ${retries} attempts`);
        return null;
    }

    async getFeaturedProducts(): Promise<Product[]> {
        try {
            const records = await this.pb.collection(EQUIPMENT_COLLECTION).getList(1, 6, {
                filter: 'featured = true',
                // sort: 'name',
            });
            return records.items.map(mapRecordToProductDefault);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    }

    async getProducts(
        filters?: ProductFilters,
        page: number = 1,
        perPage: number = 12
    ): Promise<PaginatedResult<Product>> {
        try {
            // Build filter string
            const filterParts: string[] = [];

            if (filters?.categorySlug) {
                try {
                    const category = await this.pb.collection(CATEGORIES_COLLECTION).getFirstListItem(`slug="${filters.categorySlug}"`);
                    filterParts.push(`category = "${category.id}"`);
                } catch (e) {
                    return { items: [], totalItems: 0, page, totalPages: 0, perPage };
                }
            }

            if (filters?.search) {
                const searchTerm = filters.search.replace(/"/g, '\\"');
                // Use actual fields from products collection schema
                filterParts.push(`(name ~ "${searchTerm}" || description ~ "${searchTerm}")`);
            }

            if (filters?.minPrice !== undefined) {
                filterParts.push(`(daily_rate >= ${filters.minPrice})`);
            }

            if (filters?.maxPrice !== undefined) {
                filterParts.push(`(daily_rate <= ${filters.maxPrice})`);
            }

            if (filters?.isAvailable) {
                filterParts.push('(stock_available > 0)');
            }

            const filterString = filterParts.length > 0 ? filterParts.join(' && ') : '';

            const result = await this.pb.collection(EQUIPMENT_COLLECTION).getList(page, perPage, {
                filter: filterString || undefined,
                // sort: 'name', // Removing sort as it causes 400 error on equipment collection
                // expand: 'category', // Field does not exist in equipment collection
            });

            return {
                items: result.items.map((record) => {
                    const product = mapRecordToProduct(record);
                    if (record.expand?.category) {
                        product.category = mapRecordToCategory(record.expand.category);
                    }
                    return product;
                }),
                page: result.page,
                perPage: result.perPage,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            // Return empty result on error (e.g., collection doesn't exist)
            return {
                items: [],
                page: 1,
                perPage,
                totalItems: 0,
                totalPages: 0,
            };
        }
    }

    async getCategories(): Promise<Category[]> {
        try {
            const records = await this.pb.collection(CATEGORIES_COLLECTION).getFullList({
                sort: 'name',
            });
            return records.map(mapRecordToCategory);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Return empty array on error (e.g., collection doesn't exist)
            return [];
        }
    }

    async getCategoryBySlug(slug: string): Promise<Category | null> {
        try {
            const record = await this.pb.collection(CATEGORIES_COLLECTION).getFirstListItem(
                `slug = "${slug}"`
            );
            return mapRecordToCategory(record);
        } catch {
            return null;
        }
    }
}
