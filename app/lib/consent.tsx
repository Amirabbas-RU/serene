/**
 * ─────────────────────────────────────────────────────────────────
 *  SERENE — Consent Management (GDPR + Google Consent Mode v2)
 * ─────────────────────────────────────────────────────────────────
 *  Single source of truth for cookie consent.
 *
 *  Categories → Consent Mode v2 mapping:
 *    necessary    → (always granted, security_storage=granted)
 *    preferences  → functionality_storage + personalization_storage
 *    analytics    → analytics_storage
 *    marketing    → ad_storage + ad_user_data + ad_personalization
 *
 *  Storage: cookie `serene_consent` (1 year, SameSite=Lax) +
 *           localStorage mirror for fast read + versioning.
 *  Gating:  all tracking (Klaviyo, gtag) checks `hasConsent()` first.
 *  IDs:     all consent elements use `serene-consent-*` ids.
 * ─────────────────────────────────────────────────────────────────
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────

export type ConsentCategory = "necessary" | "preferences" | "analytics" | "marketing";

export interface ConsentState {
  necessary: boolean; // always true
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentRecord extends ConsentState {
  /** ISO timestamp of last update */
  t: string;
  /** consent schema version — bump to re-prompt */
  v: string;
  /** whether user has made a choice (banner shown vs not) */
  decided: boolean;
}

// ─── Constants ────────────────────────────────────────────────────

export const CONSENT_VERSION = "1";
export const CONSENT_COOKIE = "serene_consent";
export const CONSENT_LS_KEY = "serene_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export const ALL_GRANTED: ConsentState = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
};

export const ALL_DENIED: ConsentState = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

// ─── Cookie helpers ───────────────────────────────────────────────

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

// ─── Persistence ──────────────────────────────────────────────────

function readStored(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  // prefer cookie, fallback to localStorage
  const raw = getCookie(CONSENT_COOKIE) ?? localStorage.getItem(CONSENT_LS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.v !== CONSENT_VERSION) return null; // stale version → re-prompt
    if (typeof parsed.necessary !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(state: ConsentState, decided: boolean) {
  const record: ConsentRecord = { ...state, t: new Date().toISOString(), v: CONSENT_VERSION, decided };
  const json = JSON.stringify(record);
  setCookie(CONSENT_COOKIE, json, COOKIE_MAX_AGE);
  try { localStorage.setItem(CONSENT_LS_KEY, json); } catch {}
}

// ─── Consent Mode v2 bridge ──────────────────────────────────────

type GtagConsentParams = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function toGtagConsent(s: ConsentState): GtagConsentParams {
  return {
    ad_storage: s.marketing ? "granted" : "denied",
    ad_user_data: s.marketing ? "granted" : "denied",
    ad_personalization: s.marketing ? "granted" : "denied",
    analytics_storage: s.analytics ? "granted" : "denied",
    functionality_storage: s.preferences ? "granted" : "denied",
    personalization_storage: s.preferences ? "granted" : "denied",
    security_storage: "granted",
  };
}

/** Push default (denied) before any tag loads — call inline in <head>. */
export function gtagConsentDefault(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    (window.dataLayer as unknown[]).push(args);
  };
  window.gtag("consent", "default", {
    ...toGtagConsent(ALL_DENIED),
    wait_for_update: 500,
  });
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("set", "url_passthrough", true);
}

/** Push an update after user choice. */
export function pushGtagConsentUpdate(s: ConsentState): void {
  if (typeof window === "undefined") return;
  window.gtag?.("consent", "update", toGtagConsent(s));
  // also dispatch event for any listener (e.g. Klaviyo gate)
  window.dispatchEvent(new CustomEvent("serene:consent:update", { detail: s }));
}

// ─── Helpers ──────────────────────────────────────────────────────

export function hasConsent(category: ConsentCategory): boolean {
  const rec = readStored();
  if (!rec || !rec.decided) return category === "necessary";
  return rec[category] === true;
}

export function canUseAnalytics(): boolean { return hasConsent("analytics"); }
export function canUseMarketing(): boolean { return hasConsent("marketing"); }
export function canUsePreferences(): boolean { return hasConsent("preferences"); }

// ─── Context ──────────────────────────────────────────────────────

interface ConsentContextValue {
  consent: ConsentState;
  decided: boolean;
  hydrated: boolean;
  bannerReady: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (state: ConsentState) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  dismissBanner: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** Delay in ms before showing the consent banner after first visit */
const BANNER_DELAY_MS = 5000;

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [decided, setDecided] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [bannerReady, setBannerReady] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // hydrate from storage + push default or stored consent to gtag
  useEffect(() => {
    // ensure gtag stub exists + default denied is set
    gtagConsentDefault();

    const stored = readStored();
    if (stored) {
      const s: ConsentState = {
        necessary: true,
        preferences: stored.preferences,
        analytics: stored.analytics,
        marketing: stored.marketing,
      };
      setConsent(s);
      setDecided(stored.decided);
      if (stored.decided) {
        pushGtagConsentUpdate(s);
      }
    }
    setHydrated(true);

    // delay banner appearance for better UX — let page content load first
    const timer = setTimeout(() => setBannerReady(true), BANNER_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(ALL_GRANTED);
    setDecided(true);
    persist(ALL_GRANTED, true);
    pushGtagConsentUpdate(ALL_GRANTED);
    setShowPreferences(false);
  }, []);

  const rejectAll = useCallback(() => {
    setConsent(ALL_DENIED);
    setDecided(true);
    persist(ALL_DENIED, true);
    pushGtagConsentUpdate(ALL_DENIED);
    setShowPreferences(false);
  }, []);

  const savePreferences = useCallback((next: ConsentState) => {
    const normalized: ConsentState = { ...next, necessary: true };
    setConsent(normalized);
    setDecided(true);
    persist(normalized, true);
    pushGtagConsentUpdate(normalized);
    setShowPreferences(false);
  }, []);

  const openPreferences = useCallback(() => setShowPreferences(true), []);
  const closePreferences = useCallback(() => setShowPreferences(false), []);
  const dismissBanner = useCallback(() => setShowPreferences(true), []);

  // banner visible only after hydrate + 5s delay + no decision yet + preferences not open
  const showBanner = hydrated && bannerReady && !decided && !showPreferences;

  return (
    <ConsentContext.Provider
      value={{
        consent,
        decided,
        hydrated,
        bannerReady,
        showBanner,
        showPreferences,
        acceptAll,
        rejectAll,
        savePreferences,
        openPreferences,
        closePreferences,
        dismissBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within <ConsentProvider>");
  return ctx;
}
