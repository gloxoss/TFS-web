import { Product } from "./types";

export interface IProductService {
    getAllProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    getFeaturedProducts(): Promise<Product[]>;
}
