export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: Category;
  description?: string;
  daily_rate: number;
  stock_total: number;
  stock_available: number;
  images?: string[];
  specs?: Record<string, any>;
  is_featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}
