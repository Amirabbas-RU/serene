import { createCookieSessionStorage } from 'react-router';
import type { HydrogenSession } from '@shopify/hydrogen';

/**
 * Cookie-based session storage for Customer Account API OAuth tokens.
 * The session data stores the access token, refresh token, and customer info.
 */
export let sessionStorage: ReturnType<typeof createCookieSessionStorage> | null = null;

function getSessionStorage(secret: string) {
  if (!sessionStorage) {
    sessionStorage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: [secret],
        secure: process.env.NODE_ENV === 'production',
      },
    });
  }
  return sessionStorage;
}

/**
 * Create a HydrogenSession-compatible object from a Request and env secret.
 * This is the session object that `createCustomerAccountClient` expects.
 */
export async function createHydrogenSession(
  request: Request,
  secret: string,
): Promise<HydrogenSession> {
  const storage = getSessionStorage(secret);
  const session = await storage.getSession(request.headers.get('Cookie'));

  return {
    get: session.get.bind(session),
    set: session.set.bind(session),
    unset: session.unset.bind(session),
    commit: () => storage.commitSession(session),
    destroy: () => storage.destroySession(session),
  };
}
