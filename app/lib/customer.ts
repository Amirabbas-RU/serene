/**
 * Customer Account API helper.
 * Creates the Customer Account client for OAuth-based login/register.
 */
import { createCustomerAccountClient } from '@shopify/hydrogen';
import { redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from 'react-router';
import { createHydrogenSession } from './session';

/** Create a customer account client from a request (use in loaders/actions) */
export async function getCustomerAccount(request: Request) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');

  const session = await createHydrogenSession(request, secret);
  const customerAccountId = process.env.PUBLIC_CUSTOMER_ACCOUNT_CLIENT_ID;
  const shopId = process.env.PUBLIC_STORE_ID;

  if (!customerAccountId || !shopId) {
    throw new Error('Customer Account API credentials not configured in .env');
  }

  return createCustomerAccountClient({
    session,
    customerAccountId,
    shopId,
    request,
    // Use the SDK's default API version (omitted to let Hydrogen decide)
    loginPath: '/account/login',
    authorizePath: '/account/authorize',
    defaultRedirectPath: '/account',
  });
}

/**
 * Guard for loaders: redirects to /account/login if user is NOT authenticated.
 * Use this in account route loaders that require login.
 */
export async function requireCustomer(
  args: LoaderFunctionArgs | ActionFunctionArgs,
) {
  const customer = await getCustomerAccount(args.request);
  const isLoggedIn = await customer.isLoggedIn();
  if (!isLoggedIn) {
    const url = new URL(args.request.url);
    const redirectTo = encodeURIComponent(url.pathname);
    throw redirect(`/account/login?redirect=${redirectTo}`);
  }
  return customer;
}

/** Customer Account API GraphQL queries */
export const CUSTOMER_QUERIES = {
  /** Fetch customer profile details */
  CUSTOMER_INFO: `#graphql
    query CustomerInfo {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
      }
    }
  `,

  /** Fetch customer with orders */
  CUSTOMER_WITH_ORDERS: `#graphql
    query CustomerWithOrders($first: Int!) {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        numberOfOrders
        orders(first: $first) {
          nodes {
            id
            orderNumber
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            fulfillmentStatus
            financialStatus
            lineItems(first: 10) {
              nodes {
                title
                quantity
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `,

  /** Fetch customer addresses */
  CUSTOMER_ADDRESSES: `#graphql
    query CustomerAddresses {
      customer {
        id
        defaultAddress {
          id
          address1
          address2
          city
          province
          zip
          country
          firstName
          lastName
          phone
        }
        addresses(first: 20) {
          nodes {
            id
            address1
            address2
            city
            province
            zip
            country
            firstName
            lastName
            phone
          }
        }
      }
    }
  `,
};
