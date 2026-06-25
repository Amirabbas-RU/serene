/**
 * Account Orders — Displays real order history from Customer Account API.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { requireCustomer, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  const customer = await requireCustomer({ request } as LoaderFunctionArgs);

  const data = await customer.query(CUSTOMER_QUERIES.CUSTOMER_WITH_ORDERS, {
    variables: { first: 20 },
  });
  const customerData = (data as any)?.customer ?? null;

  return {
    orders: customerData?.orders?.nodes ?? [],
  };
}

export default function AccountOrders() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl text-forest">Order History</h2>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any, i: number) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/account/orders/${order.orderNumber}`}
                className="block p-5 rounded-xl bg-cream-light/80 border border-cream-dark/30 hover:border-clay/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center">
                      <Package className="w-5 h-5 text-clay" />
                    </div>
                    <div>
                      <p className="font-medium text-forest text-sm">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-forest/50">
                        {new Date(order.processedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-forest text-sm">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: order.totalPrice?.currencyCode ?? 'USD',
                      }).format(parseFloat(order.totalPrice?.amount ?? '0'))}
                    </p>
                    <p className="text-xs text-forest/50">
                      {order.fulfillmentStatus}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-cream-dark/30 flex items-center justify-center mx-auto mb-5">
            <Package className="w-7 h-7 text-forest/30" />
          </div>
          <h3 className="font-heading text-xl text-forest mb-2">No orders yet</h3>
          <p className="text-forest/50 text-sm mb-8 max-w-sm mx-auto">
            You haven't placed any orders yet. Start shopping to see your order history here.
          </p>
          <Button variant="primary" as="a" href="/collections/all">
            <ShoppingBag className="w-4 h-4" />
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
