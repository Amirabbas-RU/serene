import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { motion } from "framer-motion";
import { Shield, Cookie, FileText, ChevronRight, Info, Settings2, ExternalLink } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { useConsent } from "~/lib/consent";

type PolicyHandle = "privacy-policy" | "cookie-policy" | "terms-of-service";

const VALID: Record<string, PolicyHandle> = {
  "privacy-policy": "privacy-policy",
  "cookie-policy": "cookie-policy",
  "terms-of-service": "terms-of-service",
};

export async function loader({ params }: LoaderFunctionArgs) {
  const handle = params.handle ?? "";
  if (!VALID[handle]) throw new Response("Not Found", { status: 404 });
  return { handle: VALID[handle] as PolicyHandle };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const titles: Record<PolicyHandle, string> = {
    "privacy-policy": "Privacy Policy — SERENE",
    "cookie-policy": "Cookie Policy — SERENE",
    "terms-of-service": "Terms of Service — SERENE",
  };
  return [{ title: data ? titles[data.handle] : "Policy — SERENE" }];
};

const UPDATED = "16 September 2026";

// ─── Cookie table data ──────────────────────────────────────────────
const COOKIE_ROWS = [
  { category: "Strictly Necessary", provider: "Shopify / SERENE", names: "serene_cart, _shopify_y, _shopify_s, cart, secure_customer_sig, serene_consent", purpose: "Core site function — cart, checkout session, security, load-balancing, and storing your consent choice. Always active.", duration: "Session to 1 year", signal: "security_storage: granted" },
  { category: "Preferences", provider: "SERENE", names: "localization, serene_consent (mirror)", purpose: "Remember language/region and personalization choices.", duration: "1 year", signal: "functionality_storage + personalization_storage" },
  { category: "Statistics", provider: "Google", names: "_ga, _ga_*, _gid (only if consented)", purpose: "Aggregate analytics (page views, product views, searches) via Google Analytics 4. In denied mode, Google tags run consent-aware with limited signals.", duration: "Up to 2 years (if consented)", signal: "analytics_storage" },
  { category: "Marketing", provider: "Google / Klaviyo", names: "_gcl_*, _fbp, IDE, klaviyo cookies (only if consented)", purpose: "Ads, remarketing, conversion measurement and email personalization. Klaviyo script (serene-klaviyo-script) loads only after marketing consent.", duration: "Up to 2 years (if consented)", signal: "ad_storage + ad_user_data + ad_personalization" },
] as const;

function PolicyHero({ handle }: { handle: PolicyHandle }) {
  const hero = {
    "privacy-policy": { icon: Shield, kicker: "Privacy", title: "Privacy Policy", blurb: "How SERENE collects, uses and protects your personal data — and your rights under the GDPR." },
    "cookie-policy": { icon: Cookie, kicker: "Cookies & Consent", title: "Cookie Policy", blurb: "What cookies we use, why, and how to control them — including Google Consent Mode v2." },
    "terms-of-service": { icon: FileText, kicker: "Terms", title: "Terms of Service", blurb: "The terms that govern your use of SERENE and purchases made through our store." },
  }[handle];
  const Icon = hero.icon;
  return (
    <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-b from-forest via-forest-light to-forest relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-clay/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[24rem] h-[24rem] bg-sage/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-4 text-cream/70 border-cream/15 bg-cream/5">{hero.kicker}</Badge>
        <div className="flex gap-4 items-start">
          <div className="hidden sm:flex h-11 w-11 rounded-xl bg-cream/10 border border-cream/10 items-center justify-center shrink-0 mt-1">
            <Icon className="h-5 w-5 text-cream/80" />
          </div>
          <div>
            <h1 id={`serene-heading-policy-${handle}`} className="font-heading text-4xl sm:text-5xl text-cream leading-tight">{hero.title}</h1>
            <p className="text-cream/60 mt-3 max-w-2xl leading-relaxed">{hero.blurb}</p>
            <p id="serene-policy-updated" className="text-xs text-cream/40 mt-4">Last updated: {UPDATED} · Version 1.0 · ID: serene-policy-{handle}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav id="serene-policy-toc" aria-label="On this page" className="rounded-2xl border border-cream-dark/30 bg-white/60 backdrop-blur p-4 sm:p-5">
      <p className="text-xs font-semibold tracking-widest uppercase text-forest/40 mb-3">On this page</p>
      <ol className="space-y-2">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="text-sm text-forest/60 hover:text-clay transition-colors inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-clay/60" /> {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-heading text-xl sm:text-2xl text-forest">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-forest/70 space-y-3">{children}</div>
    </section>
  );
}

function ManageButton() {
  const { openPreferences } = useConsent();
  return (
    <button
      id="serene-policy-manage-preferences"
      type="button"
      onClick={openPreferences}
      className="inline-flex items-center gap-2 rounded-full bg-forest text-cream px-5 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors"
    >
      <Settings2 className="h-4 w-4" />
      Manage cookie preferences
    </button>
  );
}

// ─── Page ───────────────────────────────────────────────────────────
export default function PolicyHandleRoute() {
  const { handle } = useLoaderData<typeof loader>();

  return (
    <div id={`serene-page-policy-${handle}`} className="bg-cream">
      <PolicyHero handle={handle} />

      {/* breadcrumbs */}
      <div className="px-4 sm:px-6 py-4 border-b border-cream-dark/20 bg-cream-light/60">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-forest/40">
          <Link to="/" className="hover:text-forest transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/policies" className="hover:text-forest transition-colors">Policies</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-forest/70 capitalize">{handle.replace(/-/g, " ")}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid lg:grid-cols-[1fr_240px] gap-8 lg:gap-10 items-start">
        <article className="min-w-0 space-y-10">
          {handle === "privacy-policy" && <PrivacyContent />}
          {handle === "cookie-policy" && <CookieContent />}
          {handle === "terms-of-service" && <TermsContent />}

          {/* Attributions — shared */}
          <section id="serene-policy-attributions" className="rounded-2xl border border-cream-dark/20 bg-white/70 p-6">
            <h3 className="font-heading text-base text-forest flex items-center gap-2">
              <Info className="h-4 w-4 text-clay" /> Attributions & processors
            </h3>
            <p className="text-xs text-forest/50 mt-2 leading-relaxed">SERENE works with trusted processors to run the store. Each is bound by a data-processing agreement and only receives what is needed for its purpose. Consent Mode v2 signals are forwarded where applicable.</p>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-xs leading-relaxed">
              <li className="rounded-xl border border-cream-dark/20 bg-cream-light/60 p-3">
                <span className="font-semibold text-forest">Shopify Inc.</span> — storefront, checkout, cart & order processing. <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noreferrer" className="text-clay underline underline-offset-2 inline-flex items-center gap-1">Privacy <ExternalLink className="h-3 w-3" /></a>
              </li>
              <li className="rounded-xl border border-cream-dark/20 bg-cream-light/60 p-3">
                <span className="font-semibold text-forest">Klaviyo, Inc.</span> — email & on-site personalization (marketing consent). Script id <code className="font-mono bg-white px-1 rounded">serene-klaviyo-script</code>. <a href="https://www.klaviyo.com/legal/privacy-notice" target="_blank" rel="noreferrer" className="text-clay underline underline-offset-2 inline-flex items-center gap-1">Privacy <ExternalLink className="h-3 w-3" /></a>
              </li>
              <li className="rounded-xl border border-cream-dark/20 bg-cream-light/60 p-3">
                <span className="font-semibold text-forest">Google LLC</span> — Consent Mode v2, Analytics 4 & Ads (analytics/marketing consent, <code className="font-mono bg-white px-1 rounded">dataLayer</code>/<code className="font-mono bg-white px-1 rounded">gtag</code>). <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-clay underline underline-offset-2 inline-flex items-center gap-1">Privacy <ExternalLink className="h-3 w-3" /></a>
              </li>
              <li className="rounded-xl border border-cream-dark/20 bg-cream-light/60 p-3">
                <span className="font-semibold text-forest">Vercel / Oxygen</span> — hosting, CDN & edge delivery. Minimal logs retained for security.
              </li>
            </ul>
            <p className="text-[11px] text-forest/40 mt-4">IDs in use: <code className="font-mono">serene_consent</code> (cookie + localStorage), <code className="font-mono">serene-consent-*</code> (DOM), <code className="font-mono">serene:consent:update</code> (event), <code className="font-mono">serene-consent-default</code> & <code className="font-mono">serene-klaviyo-script</code> (scripts).</p>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <ManageButton />
            <Link to="/policies" className="inline-flex items-center gap-1.5 text-sm text-forest/60 hover:text-forest transition-colors px-4 py-2.5">
              <ChevronRight className="h-4 w-4 rotate-180" /> All policies
            </Link>
          </div>
        </article>

        {/* TOC desktop */}
        <aside className="hidden lg:block sticky top-28">
          {handle === "privacy-policy" && <Toc items={[
            { id: "serene-policy-privacy-controller", label: "Controller & contact" },
            { id: "serene-policy-privacy-lawful", label: "Lawful bases" },
            { id: "serene-policy-privacy-collect", label: "What we collect" },
            { id: "serene-policy-privacy-use", label: "How we use data" },
            { id: "serene-policy-privacy-share", label: "Sharing" },
            { id: "serene-policy-privacy-retention", label: "Retention" },
            { id: "serene-policy-privacy-rights", label: "Your rights" },
            { id: "serene-policy-privacy-cookies", label: "Cookies" },
            { id: "serene-policy-privacy-contact", label: "Contact & complaints" },
          ]} />}
          {handle === "cookie-policy" && <Toc items={[
            { id: "serene-policy-cookie-what", label: "What are cookies" },
            { id: "serene-policy-cookie-consent-mode", label: "Consent Mode v2" },
            { id: "serene-policy-cookie-table", label: "Cookie table" },
            { id: "serene-policy-cookie-manage", label: "Manage preferences" },
            { id: "serene-policy-cookie-duration", label: "Duration & storage" },
            { id: "serene-policy-cookie-rights", label: "Your choices" },
          ]} />}
          {handle === "terms-of-service" && <Toc items={[
            { id: "serene-policy-terms-about", label: "About these terms" },
            { id: "serene-policy-terms-orders", label: "Orders & pricing" },
            { id: "serene-policy-terms-shipping", label: "Shipping & returns" },
            { id: "serene-policy-terms-ip", label: "Intellectual property" },
            { id: "serene-policy-terms-liability", label: "Liability" },
            { id: "serene-policy-terms-law", label: "Governing law" },
            { id: "serene-policy-terms-contact", label: "Contact" },
          ]} />}
          <div className="mt-4 rounded-xl bg-clay/5 border border-clay/15 p-3">
            <p className="text-xs text-forest/60 leading-relaxed">Questions? <Link to="/pages/contact" className="text-clay underline underline-offset-2">Contact us</Link> — we respond within 24 hours.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <>
      <Section id="serene-policy-privacy-controller" title="1. Data controller & contact">
        <p><strong className="text-forest">Controller:</strong> SERENE — Timeless Home &amp; Body. For any privacy question, email <a href="mailto:privacy@serene.example" className="text-clay underline underline-offset-2">privacy@serene.example</a> or write to the address listed at checkout. Our Data Protection Officer can be reached at the same address.</p>
        <p className="text-xs text-forest/50">If you are in the EU/EEA, you may also contact your local supervisory authority. We cooperate fully with all data-protection authorities.</p>
      </Section>
      <Section id="serene-policy-privacy-lawful" title="2. Lawful bases (GDPR Art. 6)">
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-medium text-forest">Contract</span> — to process orders, payments, delivery and returns.</li>
          <li><span className="font-medium text-forest">Legitimate interests</span> — to keep the store secure and prevent fraud (security_storage, always granted).</li>
          <li><span className="font-medium text-forest">Consent</span> — for analytics, marketing and preferences cookies (Consent Mode v2 signals below). Withdraw anytime via Cookie preferences.</li>
          <li><span className="font-medium text-forest">Legal obligation</span> — to retain invoices and meet accounting requirements.</li>
        </ul>
      </Section>
      <Section id="serene-policy-privacy-collect" title="3. What we collect">
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-medium text-forest">Account & orders:</span> name, email, address, phone, order history — from Shopify checkout.</li>
          <li><span className="font-medium text-forest">Device & usage:</span> IP, user agent, pages viewed, products viewed, cart actions — only if you consent to Statistics/Marketing.</li>
          <li><span className="font-medium text-forest">Marketing:</span> email engagement and on-site behavior via Klaviyo — only if you grant Marketing consent (script <code className="font-mono bg-white/60 px-1 rounded">serene-klaviyo-script</code>).</li>
          <li><span className="font-medium text-forest">Preferences:</span> language/region choices — only if you grant Preferences consent.</li>
          <li><span className="font-medium text-forest">Consent record:</span> your choices plus timestamp/version in cookie <code className="font-mono bg-white/60 px-1 rounded">serene_consent</code> (see Cookie Policy).</li>
        </ul>
      </Section>
      <Section id="serene-policy-privacy-use" title="4. How we use your data">
        <p>To fulfill orders, provide customer support, improve the site, personalize content (if consented), send marketing you opted into, secure the store, and meet legal obligations. We do not sell your data. Automated decision-making is not used for legal or similarly significant effects.</p>
      </Section>
      <Section id="serene-policy-privacy-share" title="5. Sharing">
        <p>We share only with processors listed under <a href="#serene-policy-attributions" className="text-clay underline underline-offset-2">Attributions</a> and with payment/shipping providers needed to complete your order. International transfers rely on adequacy decisions or Standard Contractual Clauses.</p>
      </Section>
      <Section id="serene-policy-privacy-retention" title="6. Retention">
        <ul className="list-disc pl-5 space-y-1">
          <li>Order & invoice data — as required by law (typically 6–10 years depending on jurisdiction).</li>
          <li>Consent record <code className="font-mono bg-white/60 px-1 rounded">serene_consent</code> — 1 year (then re-prompt).</li>
          <li>Analytics/marketing cookies — up to 2 years only while consent is granted; deleted on withdrawal.</li>
          <li>Session/cart cookies — session to 30 days.</li>
        </ul>
      </Section>
      <Section id="serene-policy-privacy-rights" title="7. Your rights">
        <p>You have the right to access, rectify, erase, restrict, object, port, and withdraw consent. To exercise any right, email <a href="mailto:privacy@serene.example" className="text-clay underline underline-offset-2">privacy@serene.example</a>. We respond within 30 days. Withdrawing consent does not affect prior lawful processing. You also have the right to lodge a complaint with your supervisory authority.</p>
        <div className="rounded-xl border border-cream-dark/20 bg-cream-light/60 p-4 flex gap-3">
          <ManageButton />
          <span className="text-xs text-forest/50 self-center">Withdraw or change cookie consent anytime here.</span>
        </div>
      </Section>
      <Section id="serene-policy-privacy-cookies" title="8. Cookies">
        <p>We use four categories: Strictly Necessary (always on, <code className="font-mono bg-white/60 px-1 rounded">security_storage: granted</code>), Preferences, Statistics and Marketing. Google Consent Mode v2 signals are sent in denied mode until you decide. See our <Link to="/policies/cookie-policy" className="text-clay underline underline-offset-2">Cookie Policy</Link> for the full table, purposes and durations.</p>
      </Section>
      <Section id="serene-policy-privacy-contact" title="9. Contact & complaints">
        <p>Email <a href="mailto:privacy@serene.example" className="text-clay underline underline-offset-2">privacy@serene.example</a> for any request. If you are unsatisfied with our response, you may lodge a complaint with your national data-protection authority. EU residents may also use the platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-clay underline underline-offset-2 inline-flex items-center gap-1">ec.europa.eu/consumers/odr <ExternalLink className="h-3 w-3" /></a>.</p>
      </Section>
    </>
  );
}

function CookieContent() {
  return (
    <>
      <Section id="serene-policy-cookie-what" title="What are cookies?">
        <p>Cookies are small text files stored on your device. At SERENE we group them into four categories shown in the table below. Only Strictly Necessary cookies are set without your choice — everything else requires your consent.</p>
      </Section>

      <Section id="serene-policy-cookie-consent-mode" title="Google Consent Mode v2">
        <p>Consent Mode v2 lets Google tags adapt to your choices before you decide. Until you choose, all non-essential signals are sent as <code className="font-mono bg-white/60 px-1 rounded">denied</code> with limited, aggregated modeling only:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><code className="font-mono bg-white/60 px-1 rounded">ad_storage</code>, <code className="font-mono bg-white/60 px-1 rounded">ad_user_data</code>, <code className="font-mono bg-white/60 px-1 rounded">ad_personalization</code> → Marketing category</li>
          <li><code className="font-mono bg-white/60 px-1 rounded">analytics_storage</code> → Statistics category</li>
          <li><code className="font-mono bg-white/60 px-1 rounded">functionality_storage</code> + <code className="font-mono bg-white/60 px-1 rounded">personalization_storage</code> → Preferences category</li>
          <li><code className="font-mono bg-white/60 px-1 rounded">security_storage</code> → always <code className="font-mono bg-white/60 px-1 rounded">granted</code> (necessary)</li>
        </ul>
        <p className="text-xs text-forest/50">Technical defaults injected by <code className="font-mono bg-white/60 px-1 rounded">serene-consent-default</code> in <code className="font-mono bg-white/60 px-1 rounded">&lt;head&gt;</code>: <code className="font-mono bg-white/60 px-1 rounded">wait_for_update: 500</code>, <code className="font-mono bg-white/60 px-1 rounded">ads_data_redaction: true</code>, <code className="font-mono bg-white/60 px-1 rounded">url_passthrough: true</code>. Updates are pushed via <code className="font-mono bg-white/60 px-1 rounded">gtag('consent','update', …)</code> and broadcast as the custom event <code className="font-mono bg-white/60 px-1 rounded">serene:consent:update</code> (consumed by Klaviyo gating).</p>
      </Section>

      <section id="serene-policy-cookie-table" className="scroll-mt-28">
        <h2 className="font-heading text-xl sm:text-2xl text-forest">Cookie table</h2>
        <p className="text-xs text-forest/50 mt-2">Provider, names, purpose, duration and the Consent Mode signal it maps to. Marketing cookies (including Klaviyo) load only after you grant Marketing.</p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-cream-dark/20">
          <table id="serene-cookie-table" className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-cream-dark/20 text-forest/60">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Category</th>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Names</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark/15">
              {COOKIE_ROWS.map((row, i) => (
                <tr key={row.category} id={`serene-cookie-row-${i}`} className="align-top">
                  <td className="px-4 py-3 font-medium text-forest whitespace-nowrap">{row.category}</td>
                  <td className="px-4 py-3 text-forest/60">{row.provider}</td>
                  <td className="px-4 py-3 font-mono text-[11px] leading-relaxed text-forest/60 max-w-[14rem] break-words">{row.names}</td>
                  <td className="px-4 py-3 text-forest/60 leading-relaxed max-w-[18rem]">{row.purpose}</td>
                  <td className="px-4 py-3 text-forest/60 whitespace-nowrap">{row.duration}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-forest/60">{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-forest/40 mt-3">Shopify may set additional strictly-necessary cookies for fraud prevention and checkout integrity. Names above are representative and may vary by session.</p>
      </section>

      <Section id="serene-policy-cookie-manage" title="Manage your preferences">
        <p>Change your choices anytime — no need to clear cookies manually. Your preference is stored as the cookie and localStorage key <code className="font-mono bg-white/60 px-1 rounded">serene_consent</code> (version <code className="font-mono bg-white/60 px-1 rounded">v1</code>).</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <ManageButton />
          <span className="text-xs text-forest/50 self-center">Also available in the footer → “Cookie preferences” (<code className="font-mono bg-white/60 px-1 rounded">serene-consent-manage</code>).</span>
        </div>
        <ul className="list-disc pl-5 space-y-1 pt-2">
          <li>Banner: <code className="font-mono bg-white/60 px-1 rounded">serene-consent-banner</code> with actions <code className="font-mono bg-white/60 px-1 rounded">serene-consent-accept-all</code> / <code className="font-mono bg-white/60 px-1 rounded">serene-consent-reject-all</code> / <code className="font-mono bg-white/60 px-1 rounded">serene-consent-customize</code>.</li>
          <li>Preferences modal: <code className="font-mono bg-white/60 px-1 rounded">serene-consent-preferences</code> with toggles <code className="font-mono bg-white/60 px-1 rounded">serene-consent-toggle-*</code> and details <code className="font-mono bg-white/60 px-1 rounded">serene-consent-detail-*</code>.</li>
          <li>Quick toggles inside the modal: <code className="font-mono bg-white/60 px-1 rounded">serene-consent-pref-accept-all</code> / <code className="font-mono bg-white/60 px-1 rounded">serene-consent-pref-reject-all</code>, save as <code className="font-mono bg-white/60 px-1 rounded">serene-consent-save</code>.</li>
        </ul>
      </Section>

      <Section id="serene-policy-cookie-duration" title="Duration & storage">
        <p>Consent cookie <code className="font-mono bg-white/60 px-1 rounded">serene_consent</code>: 1 year, <code className="font-mono bg-white/60 px-1 rounded">SameSite=Lax</code>, <code className="font-mono bg-white/60 px-1 rounded">path=/</code>, mirrored in <code className="font-mono bg-white/60 px-1 rounded">localStorage</code> for fast reads. On version bump, stale records are discarded and the banner is shown again.</p>
        <p className="text-xs text-forest/50">To inspect: DevTools → Application → Cookies / Local Storage → key <code className="font-mono bg-white/60 px-1 rounded">serene_consent</code> → value is JSON: <code className="font-mono bg-white/60 px-1 rounded">{"{"}"necessary":true,…,"decided":true,"v":"1","t":"ISO-date"{"}"}</code>.</p>
      </Section>

      <Section id="serene-policy-cookie-rights" title="Your choices & browser controls">
        <p>Besides the preferences above, you can block or delete cookies in your browser settings. Doing so may break cart or checkout (strictly necessary cookies). Withdrawing marketing consent flushes any queued Klaviyo events and prevents the Klaviyo script from loading; withdrawing analytics consent switches Google tags back to consent-aware mode.</p>
      </Section>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <Section id="serene-policy-terms-about" title="1. About these terms">
        <p>These Terms of Service govern your access to and use of SERENE's website, storefront and services. By browsing, creating an account or placing an order, you agree to these terms. If you do not agree, please do not use the site. We may update these terms; the “Last updated” date above reflects the current version.</p>
      </Section>
      <Section id="serene-policy-terms-orders" title="2. Orders, pricing & payment">
        <p>All prices are shown in the store currency and may change without notice. Orders are an offer to purchase; we reserve the right to accept or decline any order (e.g. for pricing errors, stock or fraud checks). Payments are processed securely via Shopify's checkout and our payment providers. You agree to provide accurate billing and shipping information.</p>
      </Section>
      <Section id="serene-policy-terms-shipping" title="3. Shipping, delivery & returns">
        <p>Delivery timelines are estimates. Risk passes on delivery. Please inspect goods promptly and report damage or defects within 14 days. Returns and exchanges are handled per the policy shown at checkout and on our Support pages. Where the law provides a withdrawal right, it remains unaffected.</p>
      </Section>
      <Section id="serene-policy-terms-ip" title="4. Intellectual property">
        <p>All content on SERENE — including text, imagery, design, logos and product photography — is owned by SERENE or its licensors and protected by intellectual-property laws. You may not copy, reproduce or distribute content without permission. Product names and marks belong to their owners.</p>
      </Section>
      <Section id="serene-policy-terms-liability" title="5. Liability & disclaimer">
        <p>To the fullest extent permitted by law, SERENE is not liable for indirect or consequential loss. Nothing in these terms limits liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded by law. The site is provided “as is” without warranties beyond those required by applicable law.</p>
      </Section>
      <Section id="serene-policy-terms-law" title="6. Governing law & disputes">
        <p>These terms are governed by the laws applicable at SERENE's principal place of business, without prejudice to mandatory consumer protections in your country of residence. We encourage you to contact us first at <a href="mailto:support@serene.example" className="text-clay underline underline-offset-2">support@serene.example</a> to resolve any concern informally.</p>
      </Section>
      <Section id="serene-policy-terms-contact" title="7. Contact">
        <p>Questions about these terms? Reach us at <a href="mailto:support@serene.example" className="text-clay underline underline-offset-2">support@serene.example</a> or via <Link to="/pages/contact" className="text-clay underline underline-offset-2">Contact</Link>. For privacy matters, see our <Link to="/policies/privacy-policy" className="text-clay underline underline-offset-2">Privacy Policy</Link> and <Link to="/policies/cookie-policy" className="text-clay underline underline-offset-2">Cookie Policy</Link>.</p>
      </Section>
    </>
  );
}
