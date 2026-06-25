import {createStorefrontClient} from '@shopify/hydrogen';

let _storefront: ReturnType<typeof createStorefrontClient>['storefront'] | null = null;

/** Returns a storefront client for making Shopify Storefront API queries. */
export function getStorefrontClient() {
  if (_storefront) return _storefront;

  const {storefront} = createStorefrontClient({
    storeDomain: process.env.PUBLIC_STORE_DOMAIN ?? 'mock.shop',
    publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN ?? '',
    storefrontApiVersion: '2026-04',
  });

  _storefront = storefront;
  return _storefront;
}

/** Wrapper with automatic retry for transient API failures */
export async function storefrontQuery(
  query: string,
  options?: {variables?: Record<string, any>}
) {
  const client = getStorefrontClient();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await client.query(query, {
        variables: options?.variables,
      });
      return result;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}
