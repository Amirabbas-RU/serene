/**
 * Checkout Route — Creates a Shopify checkout cart from client-side cart items
 * and redirects to the Shopify checkout page.
 *
 * v8_middleware: must `return` the Response, never `throw`.
 */
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getStorefrontClient } from '~/lib/storefront';
import type { CartCreateResponse } from '~/lib/shopify-types';

const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const itemsRaw = url.searchParams.get('items');
  const returnUrl = url.searchParams.get('return') || '/';

  // Redirect back if no items or empty array
  if (!itemsRaw) return redirect('/cart');
  if (itemsRaw === '[]' || itemsRaw === encodeURIComponent('[]')) return redirect(returnUrl);

  let items: { variantId: string; quantity: number }[];
  try {
    items = JSON.parse(decodeURIComponent(itemsRaw));
  } catch {
    return redirect('/cart');
  }

  if (!Array.isArray(items) || items.length === 0) {
    return redirect(returnUrl);
  }

  const client = getStorefrontClient();

  const lines = items.map((item) => ({
    merchandiseId: item.variantId.startsWith('gid://')
      ? item.variantId
      : `gid://shopify/ProductVariant/${item.variantId}`,
    quantity: item.quantity,
  }));

  try {
    const result = await client.mutate(CART_CREATE_MUTATION, {
      variables: {
        input: { lines },
      },
    });

    const checkoutUrl = (result as CartCreateResponse)?.cartCreate?.cart?.checkoutUrl;

    if (!checkoutUrl) {
      console.error('[checkout] No checkoutUrl in response');
      return redirect('/cart?error=checkout_failed');
    }

    return redirect(checkoutUrl);
  } catch (err) {
    console.error('[checkout] Error creating cart:', err);
    return redirect('/cart?error=checkout_failed');
  }
}

export default function CheckoutRoute() {
  return null;
}
