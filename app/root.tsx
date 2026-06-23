import {Links, Meta, Outlet, Scripts, ScrollRestoration} from 'react-router';
import type {LinksFunction, MetaFunction} from 'react-router';

import PageLayout from '~/components/PageLayout';
import '~/styles/app.css';

export const links: LinksFunction = () => [
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
  {title: 'SERENE — Timeless Home & Body'},
  {
    name: 'description',
    content:
      'Handcrafted goods for a calmer home — soy candles, linens, and ceramic vessels made with intention.',
  },
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <PageLayout>
          <Outlet />
        </PageLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
