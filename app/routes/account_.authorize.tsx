/**
 * Account/Authorize — OAuth callback + initiation for Customer Account API.
 * Handles both initiating the flow (no ?code) and exchanging the code (?code).
 *
 * v8_middleware: must `return` the Response, never `throw`.
 */
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getCustomerAccount } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const customer = await getCustomerAccount(request);
    const url = new URL(request.url);

    if (url.searchParams.has('code')) {
      // OAuth callback — exchange code for tokens
      const result = await customer.authorize();
      if (result instanceof Response) return result;
      return redirect(url.searchParams.get('redirect') || '/account');
    }

    // Initiate OAuth — redirect to Shopify's hosted login
    return customer.login();
  } catch (err) {
    // customer.login()/authorize() can throw a Response — pass it through
    if (typeof Response !== 'undefined' && err instanceof Response) return err;
    console.error('[authorize] Error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return redirect(`/account/login?error=${encodeURIComponent(message)}`);
  }
}

export default function AuthorizePage() {
  return null;
}
