import {createStorefrontClient, storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler, getStorefrontHeaders} from '@shopify/hydrogen/oxygen';

declare global {
  interface Env {
    SESSION_SECRET?: string;
    PUBLIC_STOREFRONT_API_TOKEN?: string;
    PRIVATE_STOREFRONT_API_TOKEN?: string;
    PUBLIC_STOREFRONT_ID?: string;
    PUBLIC_STORE_DOMAIN?: string;
    NODE_ENV?: string;
  }
}

export default {
  async fetch(request: Request, env: Env, _executionCtx: unknown) {
    const {storefront} = createStorefrontClient({
      cache: await caches.open('hydrogen'),
      storeDomain: env.PUBLIC_STORE_DOMAIN ?? 'mock.shop',
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN ?? '',
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN ?? '',
      storefrontId: env.PUBLIC_STOREFRONT_ID ?? '',
      storefrontHeaders: getStorefrontHeaders(request),
      storefrontApiVersion: '2026-04',
    });

    const handler = createRequestHandler({
      // @ts-expect-error — Vite generates this virtual module at build time
      build: () => import('virtual:react-router/server-build'),
      getLoadContext: () => ({storefront, env}),
    });

    const response = await handler(request);

    if (response.status !== 404) return response;

    return storefrontRedirect({request, response, storefront});
  },
};
