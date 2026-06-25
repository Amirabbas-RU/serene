/**
 * Klaviyo client-side tracking module.
 * Loads Klaviyo's snippet once and provides typed helpers.
 *
 * Usage:
 *   import { klaviyo } from '~/lib/klaviyo-client';
 *   klaviyo.track('Viewed Product', { ... });
 *   klaviyo.identify({ email: '...' });
 */

type KlaviyoEventProperties = Record<string, unknown>;

interface KlaviyoAPI {
  push: (args: unknown[]) => void;
}

interface KlaviyoWindow {
  _learnq?: KlaviyoAPI;
  klaviyo?: KlaviyoAPI;
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

  // Initialize the queue
  window._learnq = window._learnq || [];
  window.klaviyo = window.klaviyo || window._learnq;

  // Load the script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${siteId}`;
  script.type = 'text/javascript';
  const first = document.getElementsByTagName('script')[0];
  first?.parentNode?.insertBefore(script, first);
}

function getQueue(): KlaviyoAPI {
  return window._learnq || [];
}

/** Identify a user by email + properties */
export function identify(email: string, properties?: KlaviyoEventProperties): void {
  getQueue().push(['identify', { $email: email, ...properties }]);
}

/** Track a named event with optional properties */
export function track(eventName: string, properties?: KlaviyoEventProperties): void {
  getQueue().push(['track', eventName, properties ?? {}]);
}

/** Track a product view (Klaviyo's standard 'Viewed Product') */
export function trackViewedProduct(product: {
  ProductID?: string;
  Name?: string;
  Categories?: string[];
  ImageURL?: string;
  URL?: string;
  Brand?: string;
  Price?: number;
  CompareAtPrice?: number;
}): void {
  track('Viewed Product', product);
}

/** Track add to cart */
export function trackAddedToCart(item: {
  ProductID?: string;
  Name?: string;
  Categories?: string[];
  ImageURL?: string;
  URL?: string;
  Brand?: string;
  Price?: number;
  Quantity?: number;
}): void {
  track('Added to Cart', item);
}

/** Track started checkout */
export function trackStartedCheckout(items: Record<string, unknown>[]): void {
  track('Started Checkout', { Items: items });
}

/** Export a unified klaviyo object for convenient access */
export const klaviyo = {
  load: loadKlaviyo,
  identify,
  track,
  trackViewedProduct,
  trackAddedToCart,
  trackStartedCheckout,
};
