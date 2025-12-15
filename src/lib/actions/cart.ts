"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/pocketbase/server";
import { getCartService } from "@/services";
import { ResolvedKit } from '@/types/commerce';
import type { CartItem } from '@/stores/useCartStore';

interface AddToCartResult {
  success: boolean;
  error?: string;
}

interface ResolveKitResult {
  success: boolean;
  kit?: ResolvedKit;
  error?: string;
}

export async function addToCart(formData: FormData): Promise<AddToCartResult> {
  try {
    // Get authenticated client
    const pb = await createServerClient();

    // Ensure user is authenticated
    if (!pb.authStore.isValid) {
      return { success: false, error: "Authentication required" };
    }

    // Create authenticated service instance
    const cartService = getCartService(pb);

    // Extract form data
    const productId = formData.get("productId") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1;
    const kitSelections = formData.get("kitSelections") ? JSON.parse(formData.get("kitSelections") as string) : undefined;

    // Use the service (this is a placeholder - implement actual logic)
    // await cartService.addItem(productId, quantity, kitSelections);

    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function getUserCart(): Promise<{ success: boolean; items?: CartItem[]; error?: string }> {
  try {
    const pb = await createServerClient();

    if (!pb.authStore.isValid) {
      return { success: false, error: "Not authenticated" };
    }

    // Assuming there's a cart_items collection with user relation
    // This needs to be implemented based on your schema
    const cartItems = await pb.collection('cart_items').getFullList({
      filter: `user="${pb.authStore.model?.id}"`,
      expand: 'product',
    });

    // Map to CartItem format
    const items: CartItem[] = cartItems.map(record => ({
      id: record.id,
      product: {
        id: record.product,
        name: record.expand?.product?.name || '',
        slug: record.expand?.product?.slug || '',
        imageUrl: record.expand?.product?.image_url,
        nameEn: record.expand?.product?.name_en || record.expand?.product?.name || '',
        nameFr: record.expand?.product?.name_fr || '',
        categoryId: record.expand?.product?.category || '',
        isAvailable: record.expand?.product?.is_available ?? true,
      },
      quantity: record.quantity || 1,
      dates: record.dates || { start: '', end: '' },
      // kitSelections: record.kit_selections ? JSON.parse(record.kit_selections) : undefined,
    }));

    return { success: true, items };
  } catch (error) {
    console.error("Get user cart error:", error);
    return { success: false, error: "Failed to load cart" };
  }
}

export async function mergeGuestCart(guestItems: CartItem[]): Promise<{ success: boolean; error?: string }> {
  try {
    const pb = await createServerClient();

    if (!pb.authStore.isValid) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = pb.authStore.model?.id;
    if (!userId) {
      return { success: false, error: "Invalid user session" };
    }

    // Get existing user cart items
    const existingCartItems = await pb.collection('cart_items').getFullList({
      filter: `user="${userId}"`,
    });

    // Create a map of existing items by product ID for quick lookup
    const existingItemsMap = new Map<string, any>();
    existingCartItems.forEach(item => {
      existingItemsMap.set(item.product, item);
    });

    // Process each guest item
    for (const guestItem of guestItems) {
      // DEBUG LOGGING
      console.log('Processing guest item for merge:', {
        productId: guestItem.product.id,
        qty: guestItem.quantity,
        dates: guestItem.dates,
        hasDates: !!guestItem.dates
      });

      const existingItem = existingItemsMap.get(guestItem.product.id);

      // Fallback for missing dates (legacy items)
      const validDates = guestItem.dates || {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString()
      };

      console.log('Merge Debug:', { userId, collection: 'cart_items' });

      if (existingItem) {
        // ... (existing update logic)
        const newQuantity = existingItem.quantity + guestItem.quantity;
        await pb.collection('cart_items').update(existingItem.id, {
          quantity: newQuantity,
        });
      } else {
        console.log("Merging new item...", { userId, product: guestItem.product.id });
        // Add new item to cart
        await pb.collection('cart_items').create({
          user: userId,
          product: guestItem.product.id,
          quantity: guestItem.quantity,
          dates: validDates,
          // kit_selections: guestItem.kitSelections ? JSON.stringify(guestItem.kitSelections) : null,
        });
      }
    }

    // Revalidate cart-related paths
    revalidatePath('/', 'layout');

    return { success: true };
    return { success: true };
  } catch (error: any) {
    console.error("Merge guest cart error details:", JSON.stringify(error.response || error, null, 2));
    return { success: false, error: "Failed to merge cart" };
  }
}

export async function resolveKit(productId: string): Promise<ResolveKitResult> {
  try {
    const pb = await createServerClient();
    const cartService = getCartService(pb);

    const kit = await cartService.resolveKit(productId);

    return { success: true, kit: kit || undefined };
  } catch (error) {
    console.error("Resolve kit error:", error);
    return { success: false, error: "Failed to resolve kit" };
  }
}