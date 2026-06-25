/**
 * Account/Logout — Clears session and logs out from Shopify Customer Account API.
 * v8_middleware: must `return` the Response, never `throw`.
 */
import { type LoaderFunctionArgs } from 'react-router';
import { getCustomerAccount } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  const customer = await getCustomerAccount(request);
  return customer.logout();
}

export default function LogoutPage() {
  return null;
}
