import { Product, Category } from "./types";

export interface ProductFilters {
    categorySlug?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
}

export interface PaginatedResult<T> {
    items: T[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}

export interface IProductService {
    getAllProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    getProductBySlug(slug: string): Promise<Product | null>;
    getFeaturedProducts(): Promise<Product[]>;
    getProducts(filters?: ProductFilters, page?: number, perPage?: number): Promise<PaginatedResult<Product>>;
    getCategories(): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
}
