import {type RouteConfig, route, index, prefix} from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),

  /* ─── Collections ─── */
  route('collections', 'routes/collections._index.tsx'),
  route('collections/all', 'routes/collections.all.tsx'),
  route('collections/:handle', 'routes/collections.$handle.tsx'),

  /* ─── Products ─── */
  route('products/:handle', 'routes/products.$handle.tsx'),

  /* ─── Cart ─── */
  route('cart', 'routes/cart.tsx'),
  route('cart/:lines', 'routes/cart.$lines.tsx'),

  /* ─── Search ─── */
  route('search', 'routes/search.tsx'),

  /* ─── Account ─── */
  ...prefix('account', [
    route('login', 'routes/account_.login.tsx'),
    route('logout', 'routes/account_.logout.tsx'),
    route('authorize', 'routes/account_.authorize.tsx'),
    index('routes/account._index.tsx'),
    route('profile', 'routes/account.profile.tsx'),
    route('addresses', 'routes/account.addresses.tsx'),
    ...prefix('orders', [
      index('routes/account.orders._index.tsx'),
      route(':id', 'routes/account.orders.$id.tsx'),
    ]),
  ]),
  route('account', 'routes/account.tsx'),
  route('account/*?', 'routes/account.$.tsx'),

  /* ─── Pages ─── */
  route('pages/:handle', 'routes/pages.$handle.tsx'),
  route('pages/about', 'routes/pages.about.tsx'),

  /* ─── Blog ─── */
  route('blogs', 'routes/blogs._index.tsx'),
  route('blogs/:blogHandle', 'routes/blogs.$blogHandle._index.tsx'),
  route('blogs/:blogHandle/:articleHandle', 'routes/blogs.$blogHandle.$articleHandle.tsx'),

  /* ─── Policies ─── */
  route('policies', 'routes/policies._index.tsx'),
  route('policies/:handle', 'routes/policies.$handle.tsx'),

  /* ─── Discount ─── */
  route('discount/:code', 'routes/discount.$code.tsx'),

  /* ─── Debug ─── */
  route('debug/products', 'routes/debug.products.tsx'),
  route('debug/env', 'routes/debug.env.tsx'),

  /* ─── Sitemap & Robots ─── */
  route('robots.txt', 'routes/[robots.txt].tsx'),
  route('sitemap.xml', 'routes/[sitemap.xml].tsx'),
  route('sitemap/:type/:page.xml', 'routes/sitemap.$type.$page[.xml].tsx'),
] satisfies RouteConfig;
