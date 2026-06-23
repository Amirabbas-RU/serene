import {type RouteConfig, route, index} from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('collections', 'routes/collections._index.tsx'),
  route('collections/all', 'routes/collections.all.tsx'),
  route('pages/about', 'routes/pages.about.tsx'),
] satisfies RouteConfig;
