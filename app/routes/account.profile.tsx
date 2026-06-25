/**
 * Account Profile — Shows and manages customer profile via Customer Account API.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { User, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { requireCustomer, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  const customer = await requireCustomer({ request } as LoaderFunctionArgs);

  const data = await customer.query(CUSTOMER_QUERIES.CUSTOMER_INFO);
  const profile = (data as any)?.customer ?? null;

  return {
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.emailAddress?.emailAddress || '',
    phone: profile?.phoneNumber?.phoneNumber || '',
  };
}

export default function AccountProfile() {
  const { firstName, lastName, email, phone } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl text-forest">Profile</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-clay" />
            {firstName || lastName
              ? `${firstName} ${lastName}`
              : 'Your Profile'}
          </CardTitle>
          <CardDescription>
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cream-light/60">
            <Mail className="w-4 h-4 text-clay shrink-0" />
            <div>
              <p className="text-xs text-forest/50">Email</p>
              <p className="text-sm text-forest font-medium">{email || 'Not provided'}</p>
            </div>
          </div>
          {phone && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cream-light/60">
              <Phone className="w-4 h-4 text-clay shrink-0" />
              <div>
                <p className="text-xs text-forest/50">Phone</p>
                <p className="text-sm text-forest font-medium">{phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
