import { useEffect } from "react";
import type { LinksFunction, MetaFunction } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { RootErrorBoundary } from "~/components/ErrorPage";
import PageLayout from "~/components/PageLayout";
import { CartProvider } from "~/lib/cart-context";
import { ConsentProvider } from "~/lib/consent";
import { ConsentBanner, ConsentPreferences } from "~/components/ConsentBanner";
import { klaviyo } from "~/lib/klaviyo-client";
import "~/styles/app.css";

export const ErrorBoundary = RootErrorBoundary;

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "apple-touch-icon", href: "/favicon.svg" },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap",
  },
];

export const meta: MetaFunction = () => [
  { title: "SERENE — Timeless Home & Body" },
  {
    name: "description",
    content:
      "Handcrafted goods for a calmer home — soy candles, linens, and ceramic vessels made with intention.",
  },
  { name: "theme-color", content: "#1a3a30" },
  { property: "og:title", content: "SERENE — Timeless Home & Body" },
  {
    property: "og:description",
    content:
      "Handcrafted goods for a calmer home — thoughtfully designed, ethically made, built to last.",
  },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
];

// ─── Consent Mode v2 — default denied (must run before any tag) ──
const CONSENT_DEFAULT_SCRIPT = `
(function(){
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments)}
  window.gtag=window.gtag||gtag;
  gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'denied',
    functionality_storage:'denied',
    personalization_storage:'denied',
    security_storage:'granted',
    wait_for_update:500
  });
  gtag('set','ads_data_redaction',true);
  gtag('set','url_passthrough',true);
})();
`.trim();

// ─── Google Tag Manager — loads after consent defaults ──────────────
const GTM_ID = "GTM-5QGZFJXQ";

const GTM_HEAD_SCRIPT = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`.trim();

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Consent Mode v2 defaults — must be earliest script */}
        <script
          id="serene-consent-default"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
        />
        {/* Google Tag Manager — loads after consent defaults, inherits denied signals */}
        <script
          id="serene-gtm"
          dangerouslySetInnerHTML={{ __html: GTM_HEAD_SCRIPT }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Google Tag Manager noscript — fallback for JS-disabled browsers */}
        <noscript id="serene-gtm-noscript">
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ConsentProvider>
          <CartProvider>
            <PageLayout>
              <Outlet />
            </PageLayout>
          </CartProvider>
          <ConsentBanner />
          <ConsentPreferences />
          <KlaviyoIdentify />
        </ConsentProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function KlaviyoIdentify() {
  const location = useLocation();

  useEffect(() => {
    // Gated inside klaviyo-client — only injects script when marketing consent granted
    klaviyo.load("WkDKeF");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(location.search);
    const email = params.get("klaviyo_email");
    if (email) {
      klaviyo.identify(email);
      const url = new URL(window.location.href);
      url.searchParams.delete("klaviyo_email");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }, [location.search]);

  return null;
}
