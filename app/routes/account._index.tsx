/**
 * Account Index — Shows a welcome page with real customer data from Customer Account API.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link, useRouteError, isRouteErrorResponse, redirect } from 'react-router';
import { motion } from 'framer-motion';
import { Package, MapPin, User, ShoppingBag } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { ErrorPage } from '~/components/ErrorPage';
import { getCustomerAccount, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  try {
    const customer = await getCustomerAccount(request);
    const isLoggedIn = await customer.isLoggedIn();

    if (!isLoggedIn) {
      // Auto-redirect to login page
      const redirectTo = encodeURIComponent(url.pathname);
      return redirect(`/account/login?redirect=${redirectTo}`);
    }

    const data = await customer.query(CUSTOMER_QUERIES.CUSTOMER_INFO);
    const profile = (data as any)?.customer ?? null;

    return {
      customer: profile
        ? {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.emailAddress?.emailAddress || '',
          }
        : null,
    };
  } catch (err) {
    console.error('[account] Customer API error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        title: 'Account Unavailable',
        message: `Could not load your account: ${message}`,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message = 'Something went wrong.';
    if (error.data?.message) {
      message = error.data.message;
    } else if (typeof error.data === 'string') {
      message = error.data;
    }
    return <ErrorPage status={error.status} message={message} />;
  }

  return <ErrorPage status={400} message="An unexpected error occurred." />;
}

export default function AccountIndex() {
  const { customer } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome */}
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome back{customer?.firstName ? `, ${customer.firstName}` : ''}
          </CardTitle>
          <CardDescription>
            {customer?.email
              ? `Signed in as ${customer.email}`
              : 'Manage your account, view orders, and update your information.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm" as="a" href="/account/orders">
              <Package className="w-4 h-4" />
              View Orders
            </Button>
            <Button variant="secondary" size="sm" as="a" href="/account/profile">
              <User className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" as="a" href="/collections/all">
              <ShoppingBag className="w-4 h-4" />
              Shop Products
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Package,
            title: 'Orders',
            desc: 'Track, return, or buy again',
            href: '/account/orders',
          },
          {
            icon: MapPin,
            title: 'Addresses',
            desc: 'Manage shipping addresses',
            href: '/account/addresses',
          },
          {
            icon: User,
            title: 'Profile',
            desc: 'Name, email, and password',
            href: '/account/profile',
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Link
              to={item.href}
              className="group block p-6 rounded-2xl bg-cream-light/80 border border-cream-dark/30 hover:border-clay/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-clay/10 flex items-center justify-center mb-4 group-hover:bg-clay/20 transition-colors">
                <item.icon className="w-5 h-5 text-clay" />
              </div>
              <h3 className="font-heading text-base text-forest mb-1 group-hover:text-clay transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-forest/50">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
