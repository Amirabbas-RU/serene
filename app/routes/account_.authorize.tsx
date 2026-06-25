/**
 * Account/Authorize — OAuth callback + initiation for Customer Account API.
 * Handles both initiating the flow (no ?code) and exchanging the code (?code).
 *
 * v8_middleware: must `return` the Response, never `throw`.
 *
 * ⚠️ Hydrogen's login() stores the PKCE codeVerifier in the session but
 * NEVER calls session.commit() — the Set-Cookie header is missing from the
 * redirect response. This means the verifier is lost and authorize() fails
 * with "No code verifier found". We manually commit the session cookie
 * after login() and attach it to the redirect.
 */
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { createCustomerAccountClientWithSession } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { customer, session } =
      await createCustomerAccountClientWithSession(request);
    const url = new URL(request.url);

    if (url.searchParams.has('code')) {
      // OAuth callback — exchange code for tokens
      console.log('[authorize] Callback received:', {
        code: url.searchParams.get('code')?.slice(0, 10) + '...',
        redirect: url.searchParams.get('redirect'),
        hasState: url.searchParams.has('state'),
      });
      const result = await customer.authorize();
      if (result instanceof Response) return result;

      // ⚠️ Hydrogen's authorize() stores the access token in the session
      // but NEVER calls session.commit(). Commit manually so the cookie
      // with the auth tokens reaches the browser.
      const cookieHeader = await session.commit();
      const target = url.searchParams.get('redirect') || '/account';
      if (cookieHeader) {
        const headers = new Headers();
        headers.set('Location', target);
        headers.set('Set-Cookie', cookieHeader);
        return new Response(null, { status: 302, headers });
      }
      return redirect(target);
    }

    // Initiate OAuth — redirect to Shopify's hosted login
    const loginResponse = await customer.login();

    // ⚠️ Hydrogen's login() set the verifier in the session but never
    // committed it. Manually commit and attach the Set-Cookie header.
    const cookieHeader = await session.commit();
    if (cookieHeader) {
      // Response.headers is immutable after construction, so clone into
      // a new Response with the Set-Cookie header attached.
      const location = loginResponse.headers.get('Location');
      const headers = new Headers();
      if (location) headers.set('Location', location);
      headers.set('Set-Cookie', cookieHeader);
      return new Response(null, { status: 302, headers });
    }

    return loginResponse;
  } catch (err) {
    // customer.login()/authorize() can throw a Response
    if (typeof Response !== 'undefined' && err instanceof Response) {
      // Pass through redirects (3xx) — they move the user to the right place
      if (err.status >= 300 && err.status < 400) return err;
      // Extract error body for 4xx/5xx from Shopify and surface to login page
      let msg = `Customer Account API error (${err.status})`;
      try {
        // clone() may fail if body already consumed — try direct text()
        const body = await err.text();
        console.error('[authorize] Shopify error:', err.status, body);
        if (body) {
          try {
            const parsed = JSON.parse(body);
            msg = parsed?.error_description || parsed?.error || parsed?.message || msg;
          } catch {
            msg = body.slice(0, 200) || msg;
          }
        }
      } catch (e) {
        console.error('[authorize] Could not read error body:', e);
      }
      return redirect(`/account/login?error=${encodeURIComponent(msg)}`);
    }
    console.error('[authorize] Error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return redirect(`/account/login?error=${encodeURIComponent(message)}`);
  }
}

export default function AuthorizePage() {
  return null;
}
