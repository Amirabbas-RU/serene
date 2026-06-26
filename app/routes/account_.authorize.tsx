import { redirect, type LoaderFunctionArgs } from 'react-router';
import { createCustomerAccountClientWithSession, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { customer, session } =
      await createCustomerAccountClientWithSession(request);
    const url = new URL(request.url);

    if (url.searchParams.has('code')) {
      const result = await customer.authorize();

      let target: string;
      if (result instanceof Response) {
        if (result.status < 300 || result.status >= 400) return result;
        target = result.headers.get('Location') || url.searchParams.get('redirect') || '/account';
      } else {
        target = url.searchParams.get('redirect') || '/account';
      }

      try {
        const raw = await customer.query(CUSTOMER_QUERIES.CUSTOMER_INFO);
        const email = (raw as { data?: { customer?: { emailAddress?: { emailAddress?: string } } } })?.data?.customer?.emailAddress?.emailAddress;
        if (email) {
          const sep = target.includes('?') ? '&' : '?';
          target += `${sep}klaviyo_email=${encodeURIComponent(email)}`;
        }
      } catch {}

      const cookieHeader = await session.commit();
      if (cookieHeader) {
        const headers = new Headers();
        headers.set('Location', target);
        headers.set('Set-Cookie', cookieHeader);
        return new Response(null, { status: 302, headers });
      }
      return redirect(target);
    }

    const loginResponse = await customer.login();

    const cookieHeader = await session.commit();
    if (cookieHeader) {
      const location = loginResponse.headers.get('Location');
      const headers = new Headers();
      if (location) headers.set('Location', location);
      headers.set('Set-Cookie', cookieHeader);
      return new Response(null, { status: 302, headers });
    }

    return loginResponse;
  } catch (err) {
    if (typeof Response !== 'undefined' && err instanceof Response) {
      if (err.status >= 300 && err.status < 400) return err;
      let msg = `Customer Account API error (${err.status})`;
      try {
        const body = await err.text();
        if (body) {
          try {
            const parsed = JSON.parse(body);
            msg = parsed?.error_description || parsed?.error || parsed?.message || msg;
          } catch {
            msg = body.slice(0, 200) || msg;
          }
        }
      } catch {}
      return redirect(`/account/login?error=${encodeURIComponent(msg)}`);
    }
    const message = err instanceof Error ? err.message : String(err);
    return redirect(`/account/login?error=${encodeURIComponent(message)}`);
  }
}

export default function AuthorizePage() {
  return null;
}
