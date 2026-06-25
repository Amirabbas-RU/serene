/**
 * Account Order Detail — Single order view from Customer Account API.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useParams, useRouteError, isRouteErrorResponse } from 'react-router';
import { motion } from 'framer-motion';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ErrorPage } from '~/components/ErrorPage';
import { requireCustomer, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const customer = await requireCustomer({ request } as LoaderFunctionArgs);
    const data = await customer.query(CUSTOMER_QUERIES.CUSTOMER_WITH_ORDERS, {
      variables: { first: 50 },
    });
    const customerData = (data as any)?.data?.customer ?? null;
    return { orders: customerData?.orders?.nodes ?? [] };
  } catch (err) {
    if (err instanceof Response) throw err;
    throw new Response('Failed to load order', { status: 400 });
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status >= 300 && error.status < 400) throw error;
    return <ErrorPage status={error.status} message={error.data?.message || 'Something went wrong.'} />;
  }
  return <ErrorPage status={400} message="An unexpected error occurred." />;
}

export default function AccountOrderDetail() {
  const { orders } = useLoaderData<typeof loader>();
  const { id } = useParams();
  const order = orders.find((o: any) => String(o.number) === id);

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-forest/50">Order #{id} not found.</p>
        <a href="/account/orders" className="text-clay hover:underline mt-4 inline-block">Back to Orders</a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-forest/50 hover:text-forest mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </a>

      <h2 className="font-heading text-2xl text-forest mb-6">Order #{order.number}</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-cream-light/80 border border-cream-dark/30">
          <h3 className="font-heading text-sm text-forest/70 mb-3">Order Details</h3>
          <p className="text-sm text-forest/50">
            Placed: {new Date(order.processedAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-forest/50">
            Status: {order.fulfillmentStatus}
          </p>
          <p className="text-sm text-forest/50">
            Payment: {order.financialStatus}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-cream-light/80 border border-cream-dark/30">
          <h3 className="font-heading text-sm text-forest/70 mb-3">Total</h3>
          <p className="font-heading text-xl text-forest">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: order.totalPrice?.currencyCode ?? 'USD',
            }).format(parseFloat(order.totalPrice?.amount ?? '0'))}
          </p>
        </div>
      </div>

      {order.lineItems?.nodes?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-heading text-lg text-forest mb-4">Items</h3>
          <div className="space-y-3">
            {order.lineItems.nodes.map((item: any) => (
              <div key={item.title} className="flex items-center gap-4 p-3 rounded-xl bg-cream-light/80 border border-cream-dark/20">
                <div>
                  <p className="text-sm font-medium text-forest">{item.title}</p>
                  <p className="text-xs text-forest/50">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
