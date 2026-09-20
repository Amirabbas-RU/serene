/**
 * ad:personam (Adform) client-side tracking module.
 * GDPR-gated: the Universal Pixel only loads & fires when marketing consent
 * is granted. Page views (retargeting) and conversion events are deferred
 * until consent arrives via `serene:consent:update`.
 *
 * Pixel config:
 *   pm  = 4306012 (ad:personam advertiser "SERENE", id 2253308)
 *   host = a2.adform.net (Americas)
 */

declare global {
  interface Window {
    _adftrack?: unknown[] | Record<string, unknown>;
    triggerAdformEvent?: (eventName: string) => void;
  }
}

const PM = 4306012;
const HOST = "a2.adform.net";

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
  if (!loaded) loadAdpersonam();
  const q = [...pending];
  pending = [];
  q.forEach((fn) => { try { fn(); } catch {} });
}

if (typeof window !== "undefined") {
  window.addEventListener("serene:consent:update", flushPending);
}

/** Load the ad:personam Universal Pixel — only when marketing consent is granted. */
export function loadAdpersonam(): void {
  if (typeof window === "undefined" || loaded) return;

  if (!hasMarketingConsent()) {
    // defer until consent granted
    const defer = () => {
      if (loaded) return;
      if (!hasMarketingConsent()) return;
      window.removeEventListener("serene:consent:update", defer as EventListener);
      doLoad();
    };
    window.addEventListener("serene:consent:update", defer as EventListener);
    pending.push(() => defer());
    return;
  }
  doLoad();
}

function doLoad(): void {
  if (loaded) return;
  loaded = true;

  // 1. Initialize tracking array
  window._adftrack = Array.isArray(window._adftrack)
    ? window._adftrack
    : window._adftrack
      ? [window._adftrack as unknown]
      : [];

  // 2. Track page view (retargeting) — GTM-style
  (window._adftrack as unknown[]).push({ HttpHost: HOST, pm: PM });

  // 3. Helper for conversion events (e.g. purchases)
  window.triggerAdformEvent = (eventName: string) => {
    if (window._adftrack && eventName) {
      (window._adftrack as unknown[]).push({
        HttpHost: HOST,
        pm: PM,
        divider: encodeURIComponent("|"),
        pagename: encodeURIComponent(eventName),
      });
    }
  };

  // 4. Load Adform library async
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.async = true;
  s.id = "serene-adpersonam-script";
  s.src = "https://s2.adform.net/banners/scripts/st/trackpoint-async.js";
  const x = document.getElementsByTagName("script")[0];
  x?.parentNode?.insertBefore(s, x);
}

/** Fire a conversion event (e.g. "Purchase") — gated on marketing consent. */
export function trackAdformEvent(eventName: string): void {
  if (!hasMarketingConsent()) {
    pending.push(() => trackAdformEvent(eventName));
    flushPending();
    return;
  }
  window.triggerAdformEvent?.(eventName);
}

export const adpersonam = {
  load: loadAdpersonam,
  trackEvent: trackAdformEvent,
};
