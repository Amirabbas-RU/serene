/**
 * Klaviyo client-side tracking module.
 * Loads Klaviyo's snippet once and provides typed helpers.
 *
 * Usage:
 *   import { klaviyo } from '~/lib/klaviyo-client';
 *   klaviyo.load('SITE_ID');
 *   klaviyo.identify('user@email.com');
 *   klaviyo.track('Viewed Product', { ... });
 */

type KlaviyoEventProperties = Record<string, unknown>;

interface KlaviyoAPI {
  push: (args: unknown[]) => void;
}

declare global {
  interface Window {
    _learnq?: KlaviyoAPI;
    klaviyo?: KlaviyoAPI;
  }
}

let loaded = false;

/** Load the Klaviyo snippet if not already loaded */
export function loadKlaviyo(siteId: string): void {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;

  window._learnq = window._learnq || ([] as unknown as KlaviyoAPI);
  window.klaviyo = window.klaviyo || window._learnq;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${siteId}`;
  script.type = 'text/javascript';
  const first = document.getElementsByTagName('script')[0];
  first?.parentNode?.insertBefore(script, first);
}

function getQueue(): KlaviyoAPI {
  return window._learnq || ([] as unknown as KlaviyoAPI);
}

/** Identify a user — call before tracking events to link to customer profile */
export function identify(email: string, properties?: KlaviyoEventProperties): void {
  getQueue().push(['identify', { $email: email, ...properties }]);
}

/** Track a named event */
export function track(eventName: string, properties?: KlaviyoEventProperties): void {
  getQueue().push(['track', eventName, properties ?? {}]);
}

/** Track product view */
export function trackViewedProduct(product: {
  ProductID?: string; Name?: string; Categories?: string[];
  ImageURL?: string; URL?: string; Brand?: string;
  Price?: number; CompareAtPrice?: number;
}): void {
  track('Viewed Product', product);
}

/** Track add to cart */
export function trackAddedToCart(item: {
  ProductID?: string; Name?: string; Categories?: string[];
  ImageURL?: string; URL?: string; Brand?: string;
  Price?: number; Quantity?: number;
}): void {
  track('Added to Cart', item);
}

/** Track started checkout */
export function trackStartedCheckout(items: Record<string, unknown>[]): void {
  track('Started Checkout', { Items: items });
}

export const klaviyo = {
  load: loadKlaviyo,
  identify,
  track,
  trackViewedProduct,
  trackAddedToCart,
  trackStartedCheckout,
};
