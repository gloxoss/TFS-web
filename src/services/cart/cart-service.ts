import PocketBase from 'pocketbase';
import { Cart, CartItem, KitTemplate, KitItem, ResolvedKit, ResolvedKitSlot } from '@/types/commerce';
import { Product } from '@/services/products/types';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export class CartService {
  private pb: PocketBase;

  constructor(pbClient?: PocketBase) {
    this.pb = pbClient || new PocketBase(PB_URL);
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
          main_product_id: template.main_product,
          base_price_modifier: template.base_price_modifier,
        },
        items: items.map(record => ({
            id: record.id,
            product_id: record.product,
            product: record.expand?.product,
            is_mandatory: record.is_mandatory,
            default_quantity: record.default_quantity,
            slot_name: record.slot_name,
            swappable_category_id: record.swappable_category
        }))
      };
    } catch (e) {
      // 404 means no bundle found, which is fine
      return { hasBundle: false };
    }
  }

  // 1b. RESOLVE KIT: Convert DB structure to UI-friendly ResolvedKit
  async resolveKit(productId: string): Promise<ResolvedKit | null> {
    const bundleCheck = await this.checkBundleRequirement(productId);
    if (!bundleCheck.hasBundle || !bundleCheck.template || !bundleCheck.items) {
      return null;
    }

    // Get the main product (PUBLIC fields only - no pricing)
    let mainProduct: Product;
    try {
      const record = await this.pb.collection('equipment').getOne(productId);
      mainProduct = {
        id: record.id,
        name: record.name_en || record.name,
        nameEn: record.name_en || record.name,
        nameFr: record.name_fr || record.name,
        slug: record.slug,
        categoryId: record.category,
        // BLIND QUOTE: No dailyRate, stockTotal, stockAvailable
        isAvailable: (record.stock_available || record.stock || 0) > 0,
        imageUrl: record.images?.[0] ? `${PB_URL}/api/files/equipment/${record.id}/${record.images[0]}` : undefined,
      };
    } catch {
      return null;
    }

    // Group items by slot_name
    const slotMap = new Map<string, KitItem[]>();
    for (const item of bundleCheck.items) {
      const slotName = item.slot_name || 'Default';
      if (!slotMap.has(slotName)) {
        slotMap.set(slotName, []);
      }
      slotMap.get(slotName)!.push(item);
    }

    // Build resolved slots
    const slots: ResolvedKitSlot[] = [];
    for (const [slotName, items] of slotMap) {
      // Get available options from swappable category
      let availableOptions: Product[] = [];
      const categoryId = items[0]?.swappable_category_id;
      if (categoryId) {
        try {
          const records = await this.pb.collection('equipment').getFullList({
            filter: `category="${categoryId}"`,
          });
          // PUBLIC Product type only - no pricing data (BLIND QUOTE)
          availableOptions = records.map(r => ({
            id: r.id,
            name: r.name_en || r.name,
            nameEn: r.name_en || r.name,
            nameFr: r.name_fr || r.name,
            slug: r.slug,
            categoryId: r.category,
            // BLIND QUOTE: No dailyRate, stockTotal, stockAvailable
            isAvailable: (r.stock_available || r.stock || 0) > 0,
            imageUrl: r.images?.[0] ? `${PB_URL}/api/files/equipment/${r.id}/${r.images[0]}` : undefined,
          }));
        } catch {
          // No available options
        }
      }

      // Check if any item in this slot is swappable (allows selection)
      const allowMultiple = items.some(i => !i.is_mandatory);
      const required = items.some(i => i.is_mandatory);

      slots.push({
        slotName,
        required,
        allowMultiple,
        defaultItems: items.filter(i => i.is_mandatory),
        selectedItems: items, // Start with all items selected
        availableOptions,
      });
    }

    return {
      template: bundleCheck.template,
      mainProduct,
      slots,
    };
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