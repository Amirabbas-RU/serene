/**
 * Shopify Admin API helper.
 * Uses OAuth client_credentials to get a short-lived (24h) access token.
 * Automatically caches and refreshes the token.
 */

interface TokenCache {
  token: string;
  expiresAt: number;
}

let cache: TokenCache | null = null;

const TOKEN_EXPIRY_MS = 23 * 60 * 60 * 1000; // refresh 1h before expiry

/**
 * Get a valid Admin API access token, auto-refreshing if expired.
 */
export async function getAdminToken(): Promise<string> {
  if (cache && Date.now() < cache.expiresAt) {
    return cache.token;
  }

  const domain = process.env.PUBLIC_STORE_DOMAIN;
  const clientId = process.env.APP_CLIENT_ID;
  const clientSecret = process.env.APP_SECRET;

  if (!domain || !clientId || !clientSecret) {
    throw new Error(
      'Admin API credentials not configured. Set PUBLIC_STORE_DOMAIN, APP_CLIENT_ID, and APP_SECRET in .env',
    );
  }

  const res = await fetch(
    `https://${domain}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Admin API token request failed (${res.status}): ${body}`,
    );
  }

  const data = (await res.json()) as { access_token: string };

  cache = {
    token: data.access_token,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  };

  return data.access_token;
}

/**
 * Execute a GraphQL query against the Shopify Admin API.
 * Uses the public Admin API endpoint.
 */
export async function adminQuery<T = any>(
  query: string,
  options?: { variables?: Record<string, any> },
): Promise<T> {
  const domain = process.env.PUBLIC_STORE_DOMAIN;
  if (!domain) throw new Error('PUBLIC_STORE_DOMAIN not set');

  const token = await getAdminToken();

  const res = await fetch(
    `https://${domain}/admin/api/2026-04/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query,
        variables: options?.variables,
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Admin API query failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(
      `Admin API errors: ${json.errors.map((e: any) => e.message).join(', ')}`,
    );
  }

  return json.data as T;
}

/**
 * Clear the cached token (forces re-auth on next call).
 */
export function clearAdminToken(): void {
  cache = null;
}
