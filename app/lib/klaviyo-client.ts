/**
 * Klaviyo client-side tracking module.
 * GDPR-gated: all identify/track calls check marketing consent first.
 * Queued events wait until consent is granted via `serene:consent:update`.
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
let pending: Array<() => void> = [];

function hasMarketingConsent(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const raw = document.cookie.match(/(?:^|; )serene_consent=([^;]*)/)?.[1]
      ?? localStorage.getItem("serene_consent");
    if (!raw) return false;
    const rec = JSON.parse(decodeURIComponent(raw));
    return rec?.decided === true && rec?.marketing === true;
  } catch { return false; }
}

function flushPending() {
  if (!hasMarketingConsent()) return;
  const q = [...pending];
  pending = [];
  q.forEach((fn) => { try { fn(); } catch {} });
}

if (typeof window !== "undefined") {
  window.addEventListener("serene:consent:update", () => {
    if (hasMarketingConsent() && !loaded) {
      // will be loaded by ConsentProvider/Root; just flush queue
    }
    flushPending();
  });
}

/**
 * Load the Klaviyo snippet — only when marketing consent is granted.
 * If called without consent, queues the load for later.
 */
export function loadKlaviyo(siteId: string): void {
  if (typeof window === "undefined") return;
  if (loaded) return;

  if (!hasMarketingConsent()) {
    // defer until consent granted
    const defer = () => {
      if (loaded) return;
      if (!hasMarketingConsent()) return;
      window.removeEventListener("serene:consent:update", defer as EventListener);
      doLoad(siteId);
    };
    window.addEventListener("serene:consent:update", defer as EventListener);
    // also store so flushPending can trigger if needed
    pending.push(() => defer());
    return;
  }
  doLoad(siteId);
}

function doLoad(siteId: string): void {
  if (loaded) return;
  loaded = true;
  window._learnq = window._learnq || ([] as unknown as KlaviyoAPI);
  window.klaviyo = window.klaviyo || window._learnq;
  const script = document.createElement("script");
  script.async = true;
  script.id = "serene-klaviyo-script";
  script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${siteId}`;
  script.type = "text/javascript";
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);
}

function getQueue(): KlaviyoAPI | null {
  const q = window._learnq || window.klaviyo;
  return (q as KlaviyoAPI) ?? null;
}

/** Identify — gated on marketing consent */
export function identify(email: string, properties?: KlaviyoEventProperties): void {
  if (!hasMarketingConsent()) {
    pending.push(() => identify(email, properties));
    return;
  }
  getQueue()?.push(["identify", { $email: email, ...properties }]);
  flushPending();
}

/** Track — gated on marketing consent */
export function track(eventName: string, properties?: KlaviyoEventProperties): void {
  if (!hasMarketingConsent()) {
    pending.push(() => track(eventName, properties));
    return;
  }
  getQueue()?.push(["track", eventName, properties ?? {}]);
}

export function trackViewedProduct(product: {
  ProductID?: string; Name?: string; Categories?: string[];
  ImageURL?: string; URL?: string; Brand?: string;
  Price?: number; CompareAtPrice?: number;
}): void {
  track("Viewed Product", product);
}

export function trackAddedToCart(item: {
  ProductID?: string; Name?: string; Categories?: string[];
  ImageURL?: string; URL?: string; Brand?: string;
  Price?: number; Quantity?: number;
}): void {
  track("Added to Cart", item);
}

export function trackStartedCheckout(items: Record<string, unknown>[]): void {
  track("Started Checkout", { Items: items });
}

export const klaviyo = {
  load: loadKlaviyo,
  identify,
  track,
  trackViewedProduct,
  trackAddedToCart,
  trackStartedCheckout,
};
