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
    // customer.login()/authorize() can throw a Response
    if (typeof Response !== 'undefined' && err instanceof Response) {
      // Pass through redirects (3xx) — they move the user to the right place
      if (err.status >= 300 && err.status < 400) return err;
      // Extract error body for 4xx/5xx from Shopify and surface to login page
      try {
        const body = await err.clone().text();
        console.error('[authorize] Shopify error:', err.status, body);
        const parsed = JSON.parse(body);
        const msg = parsed?.error_description || parsed?.error || parsed?.message || `Customer Account API error (${err.status})`;
        return redirect(`/account/login?error=${encodeURIComponent(msg)}`);
      } catch {
        return redirect(`/account/login?error=${encodeURIComponent(`Customer Account API error (${err.status})`)}`);
      }
    }
    console.error('[authorize] Error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return redirect(`/account/login?error=${encodeURIComponent(message)}`);
  }
}

export default function AuthorizePage() {
  return null;
}
