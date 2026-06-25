/**
 * Account/Logout — Clears the session and logs out from Shopify.
 */
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getCustomerAccount } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  const customer = await getCustomerAccount(request);
  return customer.logout();
}

export default function LogoutPage() {
  return null;
}
