import type { LoaderFunctionArgs } from 'react-router';
import { getStorefrontClient } from '~/lib/storefront';

export async function loader({}: LoaderFunctionArgs) {
    const storefront = getStorefrontClient();
  return {};
}

export default function StubRoute() {
  return null;
}
