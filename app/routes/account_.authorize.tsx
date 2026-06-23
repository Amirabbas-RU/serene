import type { ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = (formData.get('redirect') as string) || '/account';

  if (!email || !password) {
    return redirect(`/account/login?error=required`);
  }

  // In a real store, this would authenticate against Shopify's Customer API.
  // For now, redirect to account as a logged-in view simulation.
  // TODO: Implement real customer authentication
  return redirect(redirectTo);
}

export default function AuthorizePage() {
  return null;
}
