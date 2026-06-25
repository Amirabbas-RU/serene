import {Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation} from 'react-router';
import type {LinksFunction, MetaFunction} from 'react-router';
import {useEffect} from 'react';

import {CartProvider} from '~/lib/cart-context';
import {loadKlaviyo} from '~/lib/klaviyo-client';
import { RootErrorBoundary } from '~/components/ErrorPage';
import PageLayout from '~/components/PageLayout';

export const ErrorBoundary = RootErrorBoundary;
import '~/styles/app.css';

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'apple-touch-icon', href: '/favicon.svg' },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap',
  },
];

export const meta: MetaFunction = () => [
  { title: 'SERENE — Timeless Home & Body' },
  {
    name: 'description',
    content:
      'Handcrafted goods for a calmer home — soy candles, linens, and ceramic vessels made with intention.',
  },
  { name: 'theme-color', content: '#1a3a30' },
  { property: 'og:title', content: 'SERENE — Timeless Home & Body' },
  { property: 'og:description', content: 'Handcrafted goods for a calmer home — thoughtfully designed, ethically made, built to last.' },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary' },
];

export default function Root() {
  const location = useLocation();

  // Load Klaviyo snippet once on mount
  useEffect(() => {
    loadKlaviyo('WkDKeF');
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <CartProvider>
          <PageLayout>
            <Outlet />
          </PageLayout>
        </CartProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
