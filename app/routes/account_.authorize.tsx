/**
 * Account/Authorize — OAuth callback from Shopify Customer Account API.
 * Handles both initiating the OAuth flow (no code) and exchanging the code.
 *
 * Per Hydrogen docs: authorize() and login() should be returned from the loader.
 */
import { type LoaderFunctionArgs } from 'react-router';
import { getCustomerAccount } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  const customer = await getCustomerAccount(request);
  const url = new URL(request.url);
  const hasCode = url.searchParams.has('code');

  if (hasCode) {
    // OAuth callback — exchanges code for tokens, returns redirect to /account
    return customer.authorize();
  }

  // Initiate OAuth — redirects to Shopify's hosted login
  return customer.login({
    redirectPath: url.searchParams.get('redirect') || '/account',
  });
}

export default function AuthorizePage() {
  return null;
}
