import PocketBase from 'pocketbase';
import { Cart, CartItem, KitTemplate, KitItem, ResolvedKit, ResolvedKitSlot } from '@/types/commerce';
import { Product } from '@/services/products/types';

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export class CartService {
  private pb: PocketBase;

  constructor(pbClient: PocketBase) {
    this.pb = pbClient;
  }

  // 1. THE TRIGGER: Check if product has a kit template
  async checkBundleRequirement(productId: string): Promise<{ hasBundle: boolean; template?: KitTemplate; slots?: any[] }> {
    try {
      console.log('[CartService.checkBundleRequirement] Checking for productId:', productId);
      // Find a template where this product is the "Main Trigger"
      const template = await this.pb.collection('kit_templates').getFirstListItem(`main_product_id="${productId}"`);
      console.log('[CartService.checkBundleRequirement] Template found:', template?.id, template?.name);

      if (!template) {
        console.log('[CartService.checkBundleRequirement] No template found');
        return { hasBundle: false };
      }

      // Fetch kit_slots for this template (NEW: category-based slots)
      const slots = await this.pb.collection('kit_slots').getFullList({
        filter: `template_id="${template.id}"`
      });
      console.log('[CartService.checkBundleRequirement] Found', slots.length, 'kit slots');

      return {
        hasBundle: true,
        template: {
          id: template.id,
          name: template.name,
          main_product_id: template.main_product_id,
          base_price_modifier: template.base_price_modifier,
        },
        slots: slots.map(record => ({
          id: record.id,
          category_id: record.category_id,
          slot_name: record.slot_name,
          recommended_ids: record.recommended_ids || [], // JSON array of product IDs
          display_order: record.display_order
        }))
      };
    } catch (e: any) {
      // 404 means no bundle found, which is fine
      console.log('[CartService.checkBundleRequirement] Error/404:', e?.message || e);
      return { hasBundle: false };
    }
  }

  // 1b. RESOLVE KIT: Convert DB structure to UI-friendly ResolvedKit (Category-Based)
  async resolveKit(productId: string): Promise<ResolvedKit | null> {
    console.log('[CartService.resolveKit] Starting for productId:', productId);
    const bundleCheck = await this.checkBundleRequirement(productId);
    console.log('[CartService.resolveKit] Bundle check result:', bundleCheck.hasBundle, 'slots:', bundleCheck.slots?.length);

    if (!bundleCheck.hasBundle || !bundleCheck.template || !bundleCheck.slots) {
      console.log('[CartService.resolveKit] Returning null - no bundle');
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
        isAvailable: (record.stock_available || record.stock || 0) > 0,
        imageUrl: record.images?.[0] ? `${PB_URL}/api/files/equipment/${record.id}/${record.images[0]}` : undefined,
      };
    } catch {
      return null;
    }

    // Build resolved slots from category-based kit_slots
    const resolvedSlots: ResolvedKitSlot[] = [];

    for (const slot of bundleCheck.slots) {
      // Get ALL products from this category
      const categoryProducts = await this.pb.collection('equipment').getFullList({
        filter: `category="${slot.category_id}"`
      });

      // Map to Product objects
      const availableOptions: Product[] = categoryProducts.map(record => ({
        id: record.id,
        name: record.name_en || record.name,
        nameEn: record.name_en || record.name,
        nameFr: record.name_fr || record.name,
        slug: record.slug,
        categoryId: record.category,
        isAvailable: (record.stock_available || record.stock || 1) > 0,
        imageUrl: record.images?.[0]
          ? `${PB_URL}/api/files/equipment/${record.id}/${record.images[0]}`
          : undefined,
      }));

      // Create KitItem objects for recommended products (for defaultItems/selectedItems)
      const recommendedIds = slot.recommended_ids || [];
      const defaultItems: KitItem[] = recommendedIds.map((pid: string) => ({
        id: `${slot.id}-${pid}`,
        product_id: pid,
        is_mandatory: false,
        is_recommended: true,
        default_quantity: 1,
        slot_name: slot.slot_name,
      }));

      resolvedSlots.push({
        slotName: slot.slot_name,
        required: false,
        allowMultiple: true,
        defaultItems,
        selectedItems: defaultItems, // Pre-select recommended
        availableOptions,
      });
    }

    // Sort slots by display_order
    resolvedSlots.sort((a, b) => {
      const slotA = bundleCheck.slots!.find(s => s.slot_name === a.slotName);
      const slotB = bundleCheck.slots!.find(s => s.slot_name === b.slotName);
      return (slotA?.display_order || 0) - (slotB?.display_order || 0);
    });

    return {
      template: bundleCheck.template,
      mainProduct,
      slots: resolvedSlots,
    };
  }

  // 2. THE ACTION: Add a "Smart Group" to cart
  async addBundleToCart(userId: string, selections: { productId: string; quantity: number }[], dates: { start: Date; end: Date }) {
    // A. Get or Create Cart
    const cartId = await this.getOrCreateCartId(userId);

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