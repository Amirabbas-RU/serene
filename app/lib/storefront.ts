import {createStorefrontClient} from '@shopify/hydrogen';

let _storefront: ReturnType<typeof createStorefrontClient>['storefront'] | null = null;

/**
 * Returns a storefront client for making Shopify Storefront API queries.
 * In dev mode, it reads env vars from Vite's import.meta.env.
 */
export function getStorefrontClient() {
  if (_storefront) return _storefront;

  // @ts-expect-error — Vite replaces import.meta.env at build time
  const env = typeof import.meta !== 'undefined' ? import.meta.env : {};

  const {storefront} = createStorefrontClient({
    storeDomain: env.PUBLIC_STORE_DOMAIN ?? 'mock.shop',
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN ?? '',
    privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN ?? '',
    storefrontId: env.PUBLIC_STOREFRONT_ID ?? '',
    storefrontApiVersion: '2026-04',
  });

  _storefront = storefront;
  return _storefront;
}
