/**
 * ─────────────────────────────────────────────────────────────────
 *  SERENE — ConsentBanner + Preferences Modal
 *  IDs: serene-consent-*
 *  a11y: focus trap, Esc, aria-modal, prefers-reduced-motion aware
 * ─────────────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Settings2, X, Check, ChevronDown, Cookie, Lock, BarChart3, Megaphone, SlidersHorizontal, Info } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useConsent, type ConsentState } from "~/lib/consent";

// ─── Helpers ──────────────────────────────────────────────────────

const CATEGORIES = [
  {
    key: "necessary" as const,
    label: "Strictly Necessary",
    icon: Lock,
    desc: "Required for the site to function — security, cart, session, load balancing. Cannot be disabled.",
    alwaysOn: true,
  },
  {
    key: "preferences" as const,
    label: "Preferences",
    icon: SlidersHorizontal,
    desc: "Remember your choices (language, region) and enable personalization features.",
    gtag: "functionality_storage + personalization_storage",
  },
  {
    key: "analytics" as const,
    label: "Statistics",
    icon: BarChart3,
    desc: "Help us understand how visitors use the site (page views, searches, product views) so we can improve it.",
    gtag: "analytics_storage",
  },
  {
    key: "marketing" as const,
    label: "Marketing",
    icon: Megaphone,
    desc: "Used for advertising, remarketing and to measure campaign performance (ad_storage, ad_user_data, ad_personalization).",
    gtag: "ad_storage + ad_user_data + ad_personalization",
  },
] as const;

// ─── Toggle ───────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
  id,
  label,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  id: string;
  label: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        checked ? "bg-clay" : "bg-cream-dark/60",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

// ─── Banner (bottom bar) ──────────────────────────────────────────

export function ConsentBanner() {
  const { showBanner, acceptAll, rejectAll, dismissBanner } = useConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          id="serene-consent-banner"
          role="dialog"
          aria-modal="false"
          aria-labelledby="serene-consent-banner-title"
          aria-describedby="serene-consent-banner-desc"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed bottom-0 inset-x-0 z-[70] px-4 pb-4 sm:pb-6 pointer-events-none"
        >
          <div className="mx-auto max-w-5xl rounded-2xl border border-cream-dark/30 bg-cream-light/95 backdrop-blur-xl shadow-2xl shadow-forest/10 overflow-hidden pointer-events-auto">
            {/* accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-clay via-clay-light to-sage" />
            <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-5 lg:gap-6 lg:items-center">
              <div className="flex gap-4 min-w-0 flex-1">
                <div className="hidden sm:flex h-10 w-10 rounded-xl bg-clay/10 items-center justify-center shrink-0">
                  <Cookie className="h-5 w-5 text-clay" />
                </div>
                <div className="min-w-0">
                  <h2 id="serene-consent-banner-title" className="font-heading text-base sm:text-lg text-forest leading-tight">
                    We value your privacy
                  </h2>
                  <p id="serene-consent-banner-desc" className="text-sm text-forest/60 leading-relaxed mt-1.5">
                    We use cookies to improve your experience, analyse traffic and personalise content.
                    Choose what you allow — you can change this anytime in{" "}
                    <Link to="/policies/privacy-policy" className="text-clay hover:text-clay-dark underline underline-offset-2">Privacy Policy</Link>
                    {" "}or via the cookie preferences.
                  </p>
                  <p className="text-xs text-forest/40 mt-2">
                    Google Consent Mode v2 is active — signals are sent in consent-aware mode until you decide.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 lg:shrink-0 lg:justify-end">
                <Button
                  id="serene-consent-reject-all"
                  variant="outline"
                  size="default"
                  onClick={rejectAll}
                  className="rounded-full"
                >
                  Reject all
                </Button>
                <Button
                  id="serene-consent-customize"
                  variant="secondary"
                  size="default"
                  onClick={dismissBanner}
                  className="rounded-full"
                >
                  <Settings2 className="h-4 w-4" />
                  Customize
                </Button>
                <Button
                  id="serene-consent-accept-all"
                  variant="primary"
                  size="default"
                  onClick={acceptAll}
                  className="rounded-full"
                >
                  <Check className="h-4 w-4" />
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Preferences Modal ────────────────────────────────────────────

export function ConsentPreferences() {
  const { consent, showPreferences, savePreferences, closePreferences, acceptAll, rejectAll } = useConsent();
  const [draft, setDraft] = useState<ConsentState>(consent);
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setDraft(consent); }, [consent]);

  // body lock + Esc
  useEffect(() => {
    if (!showPreferences) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePreferences(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [showPreferences, closePreferences]);

  // focus first button on open
  useEffect(() => {
    if (!showPreferences) return;
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }, 80);
    return () => clearTimeout(t);
  }, [showPreferences]);

  return (
    <AnimatePresence>
      {showPreferences && (
        <>
          <motion.div
            id="serene-consent-backdrop"
            key="consent-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-forest/40 backdrop-blur-sm"
            onClick={closePreferences}
            aria-hidden="true"
          />
          <motion.div
            id="serene-consent-preferences"
            key="consent-preferences"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="serene-consent-preferences-title"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            tabIndex={-1}
            className="fixed z-[81] inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto
                       sm:w-[480px] sm:max-h-[min(88vh,720px)]
                       bg-cream-light border border-cream-dark/30 sm:rounded-2xl shadow-2xl shadow-forest/20
                       flex flex-col overflow-hidden max-sm:rounded-none"
          >
            {/* Header */}
            <div className="shrink-0 px-6 pt-6 pb-4 border-b border-cream-dark/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-clay/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-clay" />
                  </div>
                  <div>
                    <h2 id="serene-consent-preferences-title" className="font-heading text-lg text-forest leading-tight">
                      Cookie preferences
                    </h2>
                    <p className="text-xs text-forest/50 mt-1 leading-relaxed">
                      Manage your consent for cookies and Consent Mode v2 signals. Necessary cookies are always on.
                    </p>
                  </div>
                </div>
                <button
                  id="serene-consent-close"
                  type="button"
                  aria-label="Close cookie preferences"
                  onClick={closePreferences}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-forest/40 hover:text-forest hover:bg-forest/5 transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* quick actions */}
              <div className="flex gap-2 mt-4">
                <button
                  id="serene-consent-pref-reject-all"
                  type="button"
                  onClick={rejectAll}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-cream-dark/40 text-forest/70 hover:bg-cream-dark/30 transition-colors"
                >
                  Reject all
                </button>
                <button
                  id="serene-consent-pref-accept-all"
                  type="button"
                  onClick={acceptAll}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-forest text-cream hover:bg-forest-light transition-colors"
                >
                  Accept all
                </button>
                <Link
                  to="/policies/cookie-policy"
                  onClick={closePreferences}
                  className="text-xs font-medium px-3 py-1.5 rounded-full text-clay hover:text-clay-dark transition-colors ml-auto inline-flex items-center gap-1"
                >
                  <Info className="h-3 w-3" />
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {CATEGORIES.map((cat) => {
                const checked = draft[cat.key];
                const isNecessary = cat.key === "necessary";
                const isOpen = expanded === cat.key;
                return (
                  <div
                    key={cat.key}
                    id={`serene-consent-category-${cat.key}`}
                    className={cn(
                      "rounded-xl border p-4 transition-colors",
                      isNecessary ? "bg-forest/[0.03] border-forest/10" : "bg-white/60 border-cream-dark/20 hover:border-cream-dark/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 min-w-0">
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", isNecessary ? "bg-forest/10" : "bg-clay/10")}>
                          <cat.icon className={cn("h-4 w-4", isNecessary ? "text-forest/60" : "text-clay")} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-forest leading-tight flex items-center gap-2">
                            {cat.label}
                            {isNecessary && <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-forest text-cream">Always on</span>}
                          </p>
                          <p className="text-xs text-forest/50 leading-relaxed mt-1 line-clamp-2">{cat.desc}</p>
                          {"gtag" in cat && (
                            <p className="text-[11px] font-mono text-forest/30 mt-1">{(cat as { gtag: string }).gtag}</p>
                          )}
                        </div>
                      </div>
                      <Toggle
                        id={`serene-consent-toggle-${cat.key}`}
                        label={cat.label}
                        checked={checked}
                        disabled={isNecessary}
                        onChange={(v) => setDraft((d) => ({ ...d, [cat.key]: v }))}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpanded((e) => (e === cat.key ? null : cat.key))}
                      className="mt-3 text-xs text-forest/40 hover:text-forest/70 inline-flex items-center gap-1 transition-colors"
                      aria-expanded={isOpen}
                      aria-controls={`serene-consent-detail-${cat.key}`}
                    >
                      <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
                      {isOpen ? "Hide details" : "Details"}
                    </button>
                    {isOpen && (
                      <div id={`serene-consent-detail-${cat.key}`} className="mt-3 rounded-lg bg-cream-dark/20 border border-cream-dark/20 p-3 text-xs text-forest/60 leading-relaxed">
                        {cat.key === "necessary" && <p>Necessary cookies keep the site secure and functional (cart, checkout session, CSRF, load balancing). They do not require consent under GDPR/ePrivacy and are never used for tracking.</p>}
                        {cat.key === "preferences" && <p>Preference cookies store choices like language or region so you don't have to re-select them. Mapped to Consent Mode v2 <code className="font-mono bg-white/60 px-1 rounded">functionality_storage</code> and <code className="font-mono bg-white/60 px-1 rounded">personalization_storage</code>.</p>}
                        {cat.key === "analytics" && <p>Analytics cookies (e.g. Google Analytics 4) measure usage in aggregate. Mapped to <code className="font-mono bg-white/60 px-1 rounded">analytics_storage</code>. When denied, Google tags run in consent-aware mode with limited signals.</p>}
                        {cat.key === "marketing" && <p>Marketing cookies enable ads, remarketing and conversion measurement. Mapped to <code className="font-mono bg-white/60 px-1 rounded">ad_storage</code>, <code className="font-mono bg-white/60 px-1 rounded">ad_user_data</code>, <code className="font-mono bg-white/60 px-1 rounded">ad_personalization</code>. Klaviyo email tracking is also gated by this category.</p>}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="rounded-xl bg-clay/5 border border-clay/15 p-3 flex gap-2.5">
                <Info className="h-4 w-4 text-clay shrink-0 mt-0.5" />
                <p className="text-xs text-forest/60 leading-relaxed">
                  You can change your choices anytime via <span className="font-medium text-forest">Cookie preferences</span> in the footer or on the{" "}
                  <Link to="/policies/cookie-policy" onClick={closePreferences} className="text-clay underline underline-offset-2">Cookie Policy</Link> page.
                  Consent is stored for 1 year (cookie <code className="font-mono bg-white/70 px-1 rounded">serene_consent</code>).
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="shrink-0 px-6 py-4 border-t border-cream-dark/20 bg-white/40 flex gap-3">
              <Button
                id="serene-consent-save"
                variant="primary"
                className="flex-1 rounded-full"
                onClick={() => savePreferences(draft)}
              >
                Save preferences
              </Button>
              <Button
                id="serene-consent-cancel"
                variant="outline"
                className="rounded-full"
                onClick={closePreferences}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
