/**
 * Account Addresses — Shows real addresses from Customer Account API.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { requireCustomer, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  const customer = await requireCustomer({ request } as LoaderFunctionArgs);

  const data = await customer.query(CUSTOMER_QUERIES.CUSTOMER_ADDRESSES);
  const customerData = (data as any)?.customer ?? null;

  return {
    defaultAddress: customerData?.defaultAddress ?? null,
    addresses: customerData?.addresses?.nodes ?? [],
  };
}

export default function AccountAddresses() {
  const { defaultAddress, addresses } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl text-forest">Addresses</h2>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr: any, i: number) => {
            const isDefault = defaultAddress?.id === addr.id;
            return (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={isDefault ? 'border-clay/50' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="w-4 h-4 text-clay" />
                      {addr.firstName || addr.lastName
                        ? `${addr.firstName ?? ''} ${addr.lastName ?? ''}`
                        : 'Address'}
                      {isDefault && (
                        <span className="text-xs bg-clay/10 text-clay px-2 py-0.5 rounded-full ml-auto">
                          Default
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-forest/70">
                      {addr.address1}
                      {addr.address2 ? <>, {addr.address2}</> : ''}
                      <br />
                      {addr.city}, {addr.province} {addr.zip}
                      <br />
                      {addr.country}
                      {addr.phone ? <><br />{addr.phone}</> : ''}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-cream-dark/30 flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-7 h-7 text-forest/30" />
          </div>
          <h3 className="font-heading text-xl text-forest mb-2">No addresses saved</h3>
          <p className="text-forest/50 text-sm mb-6 max-w-sm mx-auto">
            Add a shipping address to make checkout faster.
          </p>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </div>
      )}
    </motion.div>
  );
}
