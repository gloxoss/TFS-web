import PocketBase from 'pocketbase';
import { Cart, CartItem, KitTemplate, KitItem } from '@/types/commerce';
import { Product } from '@/services/products/types';

export class CartService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  }

  // 1. THE TRIGGER: Check if product forces a bundle
  async checkBundleRequirement(productId: string): Promise<{ hasBundle: boolean; template?: KitTemplate; items?: KitItem[] }> {
    try {
      // Find a template where this product is the "Main Trigger"
      const template = await this.pb.collection('kit_templates').getFirstListItem(`main_product="${productId}"`);

      if (!template) return { hasBundle: false };

      // Fetch the ingredients
      const items = await this.pb.collection('kit_items').getFullList({
        filter: `template="${template.id}"`,
        expand: 'product',
      });

      return {
        hasBundle: true,
        template: {
          id: template.id,
          name: template.name,
          base_price_modifier: template.base_price_modifier,
        },
        items: items.map(record => ({
            id: record.id,
            product_id: record.product,
            product: record.expand?.product,
            is_mandatory: record.is_mandatory,
            default_quantity: record.default_quantity,
            swappable_category_id: record.swappable_category
        }))
      };
    } catch (e) {
      // 404 means no bundle found, which is fine
      return { hasBundle: false };
    }
  }

  // 2. THE ACTION: Add a "Smart Group" to cart
  async addBundleToCart(userId: string, selections: { productId: string; quantity: number }[], dates: { start: Date; end: Date }) {
    // A. Get or Create Cart
    let cartId = await this.getOrCreateCartId(userId);

    // B. Generate a Unique Group ID (UUID)
    const groupId = crypto.randomUUID();

    // C. Batch Create Items
    // We use a Promise.all to add them "simultaneously"
    // In a real production app, we would use a Batch Transaction here
    const promises = selections.map(item => {
      return this.pb.collection('cart_items').create({
        cart: cartId,
        product: item.productId,
        quantity: item.quantity,
        group_id: groupId, // <-- This glues them together
        dates: {
            start: dates.start.toISOString(),
            end: dates.end.toISOString()
        }
      });
    });

    await Promise.all(promises);
    return { success: true, groupId };
  }

  // Helper: Get active cart
  private async getOrCreateCartId(userId: string): Promise<string> {
    try {
      const cart = await this.pb.collection('carts').getFirstListItem(`user="${userId}" && status="active"`);
      return cart.id;
    } catch {
      const newCart = await this.pb.collection('carts').create({
        user: userId,
        status: 'active'
      });
      return newCart.id;
    }
  }

  // 3. FETCH: Get Cart with Hierarchy
  async getCart(userId: string): Promise<Cart | null> {
    try {
        const cartRecord = await this.pb.collection('carts').getFirstListItem(`user="${userId}" && status="active"`);
        const items = await this.pb.collection('cart_items').getFullList({
            filter: `cart="${cartRecord.id}"`,
            expand: 'product',
            sort: 'group_id,created' // Group items together visually
        });

        return {
            id: cartRecord.id,
            user_id: cartRecord.user,
            status: cartRecord.status,
            items: items.map(item => ({
                id: item.id,
                product: item.expand?.product,
                quantity: item.quantity,
                group_id: item.group_id,
                dates: {
                    start: new Date(item.dates.start),
                    end: new Date(item.dates.end)
                }
            })) as CartItem[]
        };
    } catch {
        return null;
    }
  }
}