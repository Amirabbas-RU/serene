/**
 * Customer Account API helper.
 * Creates the Customer Account client for OAuth-based login/register.
 */
import { createCustomerAccountClient } from '@shopify/hydrogen';
import { createCookieSessionStorage, redirect, type LoaderFunctionArgs } from 'react-router';

/** HydrogenSession type expected by createCustomerAccountClient */
type HydrogenSession = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  unset: (key: string) => Promise<void>;
  commit: () => Promise<string>;
  destroy: () => Promise<string>;
};

let sessionStorage: ReturnType<typeof createCookieSessionStorage> | null = null;

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

async function createHydrogenSession(request: Request): Promise<HydrogenSession> {
  const secret = process.env.SESSION_SECRET || '';
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

export async function getCustomerAccount(request: Request) {
  const session = await createHydrogenSession(request);
  return createCustomerAccountClient({
    session,
    customerAccountId: process.env.PUBLIC_CUSTOMER_ACCOUNT_CLIENT_ID || '',
    shopId: process.env.PUBLIC_STORE_ID || '',
    customerApiVersion: '2026-04',
    request,
    loginPath: '/account/login',
    authorizePath: '/account/authorize',
    defaultRedirectPath: '/account',
  });
}

/** Auth guard for account routes — throws redirect to login if not authenticated */
export async function requireCustomer(
  args: LoaderFunctionArgs | { request: Request },
) {
  const customer = await getCustomerAccount(args.request);
  // handleAuthStatus() throws a redirect Response if not logged in
  // React Router catches it and follows the redirect
  await customer.handleAuthStatus();
  return customer;
}

/** Customer Account API GraphQL queries */
export const CUSTOMER_QUERIES = {
  CUSTOMER_INFO: `#graphql
    query CustomerInfo {
      customer {
        firstName
        lastName
        emailAddress {
          emailAddress
        }
      }
    }
  `,
  ORDERS: `#graphql
    query Orders {
      customer {
        orders(first: 20) {
          nodes {
            id
            name
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            fulfillmentStatus
            lineItems(first: 5) {
              nodes {
                title
                quantity
              }
            }
          }
        }
      }
    }
  `,
  ADDRESSES: `#graphql
    query Addresses {
      customer {
        addresses(first: 10) {
          nodes {
            id
            address1
            address2
            city
            province
            country
            zip
            firstName
            lastName
            phone
          }
        }
        defaultAddress {
          id
        }
      }
    }
  `,
};
