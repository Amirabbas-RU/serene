/**
 * Account Index — Dashboard with customer data from Customer Account API.
 * Uses requireCustomer() which checks isLoggedIn() and redirects if unauthenticated.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link, useRouteError, isRouteErrorResponse } from 'react-router';
import { motion } from 'framer-motion';
import { Package, MapPin, User, ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ErrorPage } from '~/components/ErrorPage';
import { requireCustomer, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const customer = await requireCustomer({ request } as LoaderFunctionArgs);
    const data = await customer.query(CUSTOMER_QUERIES.CUSTOMER_WITH_ORDERS, {
      variables: { first: 5 },
    });
    const customerData = (data as any)?.data?.customer ?? null;

    const profile = customerData
      ? {
          firstName: customerData.firstName || '',
          lastName: customerData.lastName || '',
          email: customerData.emailAddress?.emailAddress || '',
        }
      : null;

    return {
      customer: profile,
      recentOrders: customerData?.orders?.nodes ?? [],
    };
  } catch (err) {
    if (err instanceof Response) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new Response(msg, { status: 400 });
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status >= 300 && error.status < 400) throw error;
    let message = 'Something went wrong.';
    if (error.data?.message) message = error.data.message;
    else if (typeof error.data === 'string') message = error.data;
    return <ErrorPage status={error.status} message={message} />;
  }
  return <ErrorPage status={400} message="An unexpected error occurred." />;
}

export default function AccountIndex() {
  const { customer, recentOrders } = useLoaderData<typeof loader>();
  const initials = customer
    ? ((customer.firstName?.[0] || '') + (customer.lastName?.[0] || '')).toUpperCase() || '?'
    : '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome */}
      <Card>
        <CardContent className="pt-8 pb-6">
          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-forest to-forest-light flex items-center justify-center shrink-0 shadow-md"
            >
              <span className="text-cream font-heading text-lg font-semibold">{initials}</span>
            </motion.div>
            <div className="min-w-0">
              <h2 className="font-heading text-xl text-forest">
                Welcome back{customer?.firstName ? `, ${customer.firstName}` : ''}
              </h2>
              <p className="text-sm text-forest/50 mt-0.5 truncate">
                {customer?.email || 'Manage your account'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
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
          { icon: Package, title: 'Orders', desc: 'Track, return, or buy again', href: '/account/orders', count: recentOrders.length },
          { icon: MapPin, title: 'Addresses', desc: 'Manage shipping addresses', href: '/account/addresses' },
          { icon: User, title: 'Profile', desc: 'Name, email, and password', href: '/account/profile' },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Link
              to={item.href}
              className="group block p-6 rounded-2xl bg-cream-light/80 border border-cream-dark/30 hover:border-clay/30 hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {(item as any).count !== undefined && (
                <span className="absolute top-3 right-3 text-xs bg-clay/10 text-clay px-2 py-0.5 rounded-full font-medium">
                  {(item as any).count}
                </span>
              )}
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

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-clay" />
                Recent Orders
              </span>
              <Link to="/account/orders" className="text-xs text-clay hover:text-clay-dark font-medium flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-cream-dark/20">
            {recentOrders.slice(0, 3).map((order: any) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.number}`}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group"
              >
                <div>
                  <p className="text-sm font-medium text-forest group-hover:text-clay transition-colors">
                    #{order.number}
                  </p>
                  <p className="text-xs text-forest/40">
                    {order.processedAt
                      ? new Date(order.processedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })
                      : 'Processing'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-forest">
                    {order.totalPrice?.amount
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: order.totalPrice?.currencyCode ?? 'USD',
                        }).format(parseFloat(order.totalPrice.amount))
                      : ''}
                  </p>
                  <p className="text-xs text-forest/50 capitalize">{order.fulfillmentStatus?.toLowerCase()}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {recentOrders.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-cream-dark/20 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-5 h-5 text-forest/30" />
            </div>
            <p className="text-sm text-forest/50">No orders yet — start shopping!</p>
            <Button variant="primary" size="sm" as="a" href="/collections/all" className="mt-4">
              Shop Now
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
