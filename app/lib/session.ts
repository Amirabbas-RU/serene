import { createCookieSessionStorage } from 'react-router';
import type { HydrogenSession } from '@shopify/hydrogen';

/**
 * Cookie-based session for Customer Account API OAuth tokens.
 */
export async function createHydrogenSession(
  request: Request,
  secret: string,
): Promise<HydrogenSession> {
  const storage = createCookieSessionStorage({
    cookie: {
      name: 'session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [secret],
      secure: process.env.NODE_ENV === 'production',
    },
  });
  const session = await storage.getSession(request.headers.get('Cookie'));

  return {
    get: session.get.bind(session),
    set: session.set.bind(session),
    unset: session.unset.bind(session),
    commit: () => storage.commitSession(session),
    destroy: () => storage.destroySession(session),
  };
}
