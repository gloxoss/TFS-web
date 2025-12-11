import PocketBase from 'pocketbase';
import { IProductService } from './interface';
import { Product } from './types';

// We map the raw DB response to our clean Product type
// ensuring the UI never sees raw DB fields like "collectionId"
const mapRecordToProduct = (record: any): Product => ({
    id: record.id,
    name: record.name,
    description: record.description,
    dailyRate: record.price, // Mapping 'price' in DB to 'dailyRate' in app
    category: record.category,
    imageUrl: record.image ? `${process.env.NEXT_PUBLIC_PB_URL}/api/files/${record.collectionId}/${record.id}/${record.image}` : '',
    isAvailable: record.active,
    specs: record.specs || {},
});

export class PocketBaseProductService implements IProductService {
    private pb: PocketBase;

    constructor() {
        this.pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
    }

    async getAllProducts(): Promise<Product[]> {
        const records = await this.pb.collection('products').getFullList({
            sort: '-created',
        });
        return records.map(mapRecordToProduct);
    }

    async getProductById(id: string): Promise<Product | null> {
        try {
            const record = await this.pb.collection('products').getOne(id);
            return mapRecordToProduct(record);
        } catch (error) {
            return null;
        }
    }

    async getFeaturedProducts(): Promise<Product[]> {
        const records = await this.pb.collection('products').getList(1, 4, {
            filter: 'featured = true',
        });
        return records.items.map(mapRecordToProduct);
    }
}
