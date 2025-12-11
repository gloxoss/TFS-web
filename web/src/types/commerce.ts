import { Product } from "@/services/products/types";

// The Blueprint for a Bundle
export interface KitTemplate {
  id: string;
  name: string;
  base_price_modifier: number; // e.g., 0.9 for 10% off
}

// The "Ingredients" of a Bundle
export interface KitItem {
  id: string;
  product_id: string;
  product?: Product; // Expanded relation
  is_mandatory: boolean;
  default_quantity: number;
  swappable_category_id?: string; // If set, user can swap with other items in this category
}

// The Shopping Cart Structure
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  group_id?: string; // CRITICAL: Links items together (e.g. Camera + Lens)
  kit_template_id?: string; // Tracks which logic created this group
  dates: {
    start: Date;
    end: Date;
  };
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  status: 'active' | 'abandoned' | 'converted';
}