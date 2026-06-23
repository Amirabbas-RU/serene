/* ════════════════════════════════════════
 * Hydrogen context type augmentation for React Router 7
 * Adds `storefront`, `cart`, `env`, `session`,
 * `customerAccount`, and `waitUntil` to route `context`.
 * ════════════════════════════════════════ */

import type {
  Storefront,
  HydrogenCart as Cart,
  CustomerAccount,
  HydrogenSession,
} from '@shopify/hydrogen';

declare module 'react-router' {
  interface RouterContextProvider {
    storefront: Storefront;
    cart: Cart;
    customerAccount: CustomerAccount;
    env: Record<string, string | undefined>;
    session: HydrogenSession;
    waitUntil: (promise: Promise<unknown>) => void;
  }
}
