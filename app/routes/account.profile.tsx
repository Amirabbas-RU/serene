/**
 * Account Profile — Customer profile from Customer Account API.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useRouteError, isRouteErrorResponse } from 'react-router';
import { motion } from 'framer-motion';
import { Mail, Phone, User, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ErrorPage } from '~/components/ErrorPage';
import { requireCustomer, CUSTOMER_QUERIES } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const customer = await requireCustomer({ request } as LoaderFunctionArgs);
    const data = await customer.query(CUSTOMER_QUERIES.CUSTOMER_INFO);
    const profile = (data as any)?.customer ?? null;
    console.log('[profile] Raw API response:', JSON.stringify(data));

    return {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.emailAddress?.emailAddress || '',
      phone: profile?.phoneNumber?.phoneNumber || '',
      displayName: profile?.displayName || '',
      raw: JSON.stringify(data),
    };
  } catch (err) {
    if (err instanceof Response) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[profile] Error:', msg);
    throw new Response(msg, { status: 400 });
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

function getInitials(first: string, last: string, displayName: string): string {
  if (first?.[0] || last?.[0]) return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase();
  if (displayName?.[0]) return displayName[0].toUpperCase();
  return '?';
}

export default function AccountProfile() {
  const { firstName, lastName, email, phone, displayName, raw } = useLoaderData<typeof loader>();
  const initials = getInitials(firstName, lastName, displayName);
  const name = displayName || `${firstName} ${lastName}`.trim() || 'You';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Debug raw data */}
      <details className="text-xs text-forest/30">
        <summary>Debug: Raw API data</summary>
        <pre className="mt-2 p-2 bg-forest/5 rounded overflow-auto max-h-40">{raw}</pre>
      </details>

      {/* Avatar + Name Header */}
      <Card>
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-clay to-clay-dark flex items-center justify-center mb-4 shadow-lg"
            >
              <span className="text-cream font-heading text-2xl font-semibold tracking-wide">
                {initials}
              </span>
            </motion.div>
            <h2 className="font-heading text-2xl text-forest mb-1">{name}</h2>
            <p className="text-sm text-forest/50">{email || 'No email on file'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-4 h-4 text-clay" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-cream-dark/20">
          <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="w-10 h-10 rounded-lg bg-clay/8 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-clay" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-forest/50 font-medium uppercase tracking-wider">Email</p>
              <p className="text-sm text-forest mt-0.5 truncate">{email || <span className="italic text-forest/30">Not provided</span>}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="w-10 h-10 rounded-lg bg-clay/8 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-clay" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-forest/50 font-medium uppercase tracking-wider">Phone</p>
              <p className="text-sm text-forest mt-0.5">{phone || <span className="italic text-forest/30">Not provided</span>}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="w-10 h-10 rounded-lg bg-clay/8 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-clay" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-forest/50 font-medium uppercase tracking-wider">Account Status</p>
              <p className="text-sm text-forest mt-0.5">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Active
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <a
          href="/account/orders"
          className="group p-4 rounded-xl bg-cream-light/60 border border-cream-dark/30 hover:border-clay/30 hover:shadow-sm transition-all duration-300 text-center"
        >
          <p className="font-heading text-sm text-forest group-hover:text-clay transition-colors">View Orders</p>
          <p className="text-xs text-forest/40 mt-1">Track your purchases</p>
        </a>
        <a
          href="/account/addresses"
          className="group p-4 rounded-xl bg-cream-light/60 border border-cream-dark/30 hover:border-clay/30 hover:shadow-sm transition-all duration-300 text-center"
        >
          <p className="font-heading text-sm text-forest group-hover:text-clay transition-colors">Addresses</p>
          <p className="text-xs text-forest/40 mt-1">Manage shipping</p>
        </a>
      </div>
    </motion.div>
  );
}
