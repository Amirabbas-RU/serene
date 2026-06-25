import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { klaviyo } from '~/lib/klaviyo-client';

/* ─── Types ─── */

export interface CartItem {
  /** Unique line ID (generated) */
  id: string;
  /** Storefront variant ID */
  variantId: string;
  /** Product title */
  title: string;
  /** Product handle for linking */
  handle: string;
  /** Variant title (e.g. "Small / Black") */
  variantTitle: string;
  /** Unit price */
  price: {
    amount: string;
    currencyCode: string;
  };
  /** Quantity */
  quantity: number;
  /** Product image URL */
  imageUrl: string | null;
  /** Alt text for image */
  imageAlt: string | null;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: { amount: string; currencyCode: string };
}

interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  /** Redirect to Shopify checkout with current cart items */
  checkout: () => void;
  /** True once hydration is complete */
  hydrated: boolean;
}

/* ─── Constants ─── */

const CART_COOKIE = 'serene_cart';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/* ─── Cookie helpers ─── */

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;path=/;max-age=0`;
}

/* ─── Serialization ─── */

function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

function deserializeCart(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).id === 'string' &&
        typeof (item as CartItem).variantId === 'string',
    );
  } catch {
    return [];
  }
}

/* ─── Helpers ─── */

function computeTotal(items: CartItem[]): { totalQuantity: number; subtotal: { amount: string; currencyCode: string } } {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const currencyCode = items.length > 0 ? items[0].price.currencyCode : 'USD';
  const amount = items
    .reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0)
    .toFixed(2);
  return { totalQuantity, subtotal: { amount, currencyCode } };
}

/* ─── Context ─── */

const CartContext = createContext<CartContextValue | null>(null);

/* ─── Provider ─── */

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from cookie on mount
  useEffect(() => {
    const raw = getCookie(CART_COOKIE);
    if (raw) {
      const parsed = deserializeCart(raw);
      if (parsed.length > 0) {
        setItems(parsed);
      }
    }
    setHydrated(true);
  }, []);

  // Persist to cookie when items change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      deleteCookie(CART_COOKIE);
    } else {
      setCookie(CART_COOKIE, serializeCart(items), COOKIE_MAX_AGE);
    }
  }, [items, hydrated]);

  const addItem = useCallback((newItem: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity ?? 1;
    setItems((prev) => {
      // Check if this variant already exists in cart
      const existingIndex = prev.findIndex((item) => item.variantId === newItem.variantId);
      const newQuantity = existingIndex >= 0 ? prev[existingIndex].quantity + qty : qty;

      // Fire Klaviyo event
      klaviyo.trackAddedToCart({
        ProductID: newItem.variantId,
        Name: newItem.title,
        ImageURL: newItem.imageUrl ?? undefined,
        URL: typeof window !== 'undefined' ? `${window.location.origin}/products/${newItem.handle}` : undefined,
        Price: newItem.price ? parseFloat(newItem.price.amount) : undefined,
        Quantity: newQuantity,
      });

      if (existingIndex >= 0) {
        // Increment quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
        };
        return updated;
      }
      // Add new line item
      return [
        ...prev,
        {
          ...newItem,
          id: `line_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          quantity: qty,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    deleteCookie(CART_COOKIE);
  }, []);

  /** Serialize cart items and redirect to Shopify checkout */
  const checkout = useCallback(() => {
    if (items.length === 0) return;
    const payload = items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));
    klaviyo.trackStartedCheckout(payload);
    const encoded = encodeURIComponent(JSON.stringify(payload));
    window.location.href = `/checkout?items=${encoded}`;
  }, [items]);

  const { totalQuantity, subtotal } = computeTotal(items);

  const value: CartContextValue = {
    items,
    totalQuantity,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    hydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* ─── Hook ─── */

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return ctx;
}
