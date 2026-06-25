/**
 * Checkout Route — Creates a Shopify checkout cart from client-side cart items
 * and redirects to the Shopify checkout page.
 */
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getStorefrontClient } from '~/lib/storefront';

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

  if (!itemsRaw) {
    throw new Error('No cart items provided');
  }

  let items: { variantId: string; quantity: number }[];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    throw new Error('Invalid items format');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw redirect(returnUrl);
  }

  const client = getStorefrontClient();

  // Build storefront cart input — ensure IDs are fully qualified
  const lines = items.map((item) => ({
    merchandiseId: item.variantId.startsWith('gid://')
      ? item.variantId
      : `gid://shopify/ProductVariant/${item.variantId}`,
    quantity: item.quantity,
  }));

  const result = await client.query(CART_CREATE_MUTATION, {
    variables: {
      input: { lines },
    },
  });

  const checkoutUrl = (result as any)?.cartCreate?.cart?.checkoutUrl;
  const errors = (result as any)?.cartCreate?.userErrors;

  if (errors && errors.length > 0) {
    throw new Error(
      `Shopify cart errors: ${errors.map((e: any) => e.message).join(', ')}`,
    );
  }

  if (!checkoutUrl) {
    throw new Error('Failed to create checkout');
  }

  throw redirect(checkoutUrl);
}

export default function CheckoutRoute() {
  return null;
}
