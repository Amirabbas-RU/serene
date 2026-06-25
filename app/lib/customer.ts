/**
 * Customer Account API client.
 * Wraps Hydrogen's createCustomerAccountClient for OAuth-based login/register.
 *
 * Key difference from old implementation: uses `isLoggedIn()` instead of
 * `handleAuthStatus()` — avoids 400 Bad Request on stale/expired tokens.
 */
import { createCustomerAccountClient } from '@shopify/hydrogen';
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { createHydrogenSession } from './session';
import type { CustomerAccountResponse } from './shopify-types';

export async function createCustomerAccountClientWithSession(request: Request) {
  const session = await createHydrogenSession(
    request,
    process.env.SESSION_SECRET!,
  );
  const customer = createCustomerAccountClient({
    session,
    customerAccountId: process.env.PUBLIC_CUSTOMER_ACCOUNT_CLIENT_ID!,
    shopId: process.env.PUBLIC_STORE_ID!,
    request,
    customerApiVersion: '2026-04',
    loginPath: '/account/login',
    authorizePath: '/account/authorize',
    defaultRedirectPath: '/account',
  });
  return { customer, session };
}

export async function getCustomerAccount(request: Request) {
  const { customer } = await createCustomerAccountClientWithSession(request);
  return customer;
}

/**
 * Auth guard for account routes.
 * Checks isLoggedIn() and redirects to login if not authenticated.
 * Uses isLoggedIn() NOT handleAuthStatus() — avoids 400 errors.
 */
export async function requireCustomer(
  args: LoaderFunctionArgs,
): Promise<Awaited<ReturnType<typeof getCustomerAccount>>> {
  const customer = await getCustomerAccount(args.request);
  const isLoggedIn = await customer.isLoggedIn();
  if (!isLoggedIn) {
    const url = new URL(args.request.url);
    throw redirect(`/account/login?redirect=${encodeURIComponent(url.pathname)}`);
  }
  return customer;
}

/** Typed helper: queries Customer Account API and returns the customer data or null. */
export async function queryCustomerData<T>(
  request: Request,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  const customer = await requireCustomer({ request } as LoaderFunctionArgs);
  const raw = await customer.query(query, { variables });
  return ((raw as CustomerAccountResponse<T>)?.data?.customer ?? null) as T | null;
}

/** Customer Account API GraphQL queries */
export const CUSTOMER_QUERIES = {
  CUSTOMER_INFO: `#graphql
    query CustomerInfo {
      customer {
        id
        displayName
        firstName
        lastName
        emailAddress { emailAddress }
        phoneNumber { phoneNumber }
      }
    }
  `,
  CUSTOMER_WITH_ORDERS: `#graphql
    query CustomerWithOrders($first: Int!) {
      customer {
        id
        firstName
        lastName
        emailAddress { emailAddress }
        orders(first: $first) {
          nodes {
            id
            number
            processedAt
            totalPrice { amount currencyCode }
            fulfillmentStatus
            financialStatus
            lineItems(first: 10) {
              nodes { title quantity }
            }
          }
        }
      }
    }
  `,
  CUSTOMER_ADDRESSES: `#graphql
    query CustomerAddresses {
      customer {
        id
        defaultAddress {
          id address1 address2 city province zip country firstName lastName phone
        }
        addresses(first: 20) {
          nodes {
            id address1 address2 city province zip country firstName lastName phone
          }
        }
      }
    }
  `,
};
