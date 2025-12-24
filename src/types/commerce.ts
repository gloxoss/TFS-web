import { Product } from "@/services/products/types";

// The Blueprint for a Bundle (stored in kit_templates collection)
export interface KitTemplate {
  id: string;
  name: string;
  main_product_id?: string; // The "trigger" product that opens the kit builder
  base_price_modifier: number; // e.g., -50 for $50 discount on bundle
}

// A Slot in a Kit (grouping of kit items by category)
export interface KitSlotDefinition {
  id: string;
  name: string; // e.g., "Lenses", "Cables"
  categoryId?: string; // Category of items in this slot
  required: boolean; // Must pick at least one?
  allowMultiple: boolean; // Can pick multiple items?
}

// The "Ingredients" of a Bundle (stored in kit_items collection)
export interface KitItem {
  id: string;
  product_id: string;
  product?: Product; // Expanded relation
  is_mandatory: boolean;
  is_recommended?: boolean; // For pre-selection of defaults
  default_quantity: number;
  slot_name?: string; // Which slot this item belongs to (e.g., "Lenses")
  swappable_category_id?: string; // If set, user can swap with other items in this category
}

// Resolved Kit for UI rendering
export interface ResolvedKitSlot {
  slotName: string;
  required: boolean;
  allowMultiple: boolean;
  defaultItems: KitItem[];
  selectedItems: KitItem[];
  availableOptions: Product[]; // All products user can choose from
}

export interface ResolvedKit {
  template: KitTemplate;
  mainProduct: Product;
  slots: ResolvedKitSlot[];
}

// The Shopping Cart Structure
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  group_id?: string; // CRITICAL: Links items together (e.g. Camera + Lens)
  kit_template_id?: string; // Tracks which logic created this group
  kit_selections?: { [slotName: string]: string[] }; // Selected product IDs per slot
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