/**
 * Account/Authorize — OAuth callback from Shopify Customer Account API.
 * Two modes:
 *   1. No `code` param → calls `customer.login()` to initiate Shopify OAuth redirect.
 *   2. With `code` param → exchanges the authorization code for tokens.
 *
 * IMPORTANT: With v8_middleware=true, loaders must RETURN Responses, not throw them.
 */
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getCustomerAccount } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const customer = await getCustomerAccount(request);
    const url = new URL(request.url);
    const hasCode = url.searchParams.has('code');

    if (hasCode) {
      // OAuth callback — exchange the authorization code for tokens
      const result = await customer.authorize();
      // authorize() may return a redirect Response or nothing
      if (result instanceof Response) return result;
      return redirect(url.searchParams.get('redirect') || '/account');
    }

    // Initiate OAuth — customer.login() returns a redirect Response to Shopify
    return customer.login({
      redirectPath: url.searchParams.get('redirect') || '/account',
    });
  } catch (err) {
    // If authorize() throws a Response (redirect or error), return it as-is
    if (typeof Response !== 'undefined' && err instanceof Response) return err;
    console.error('[authorize] Error:', err);
    const message = err instanceof Error ? err.message : String(err);
    // Redirect to login with the error message so it's visible
    return redirect(`/account/login?error=${encodeURIComponent(message)}`);
  }
}

export default function AuthorizePage() {
  return null;
}
