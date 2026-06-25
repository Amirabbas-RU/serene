/**
 * Account/Login — Login page with Shopify Customer Account API OAuth link.
 * Clicking "Sign in with Shopify" navigates to /account/authorize.
 */
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link, useSearchParams, redirect } from 'react-router';
import { motion } from 'framer-motion';
import { LogIn, Sparkles } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { getCustomerAccount } from '~/lib/customer';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const customer = await getCustomerAccount(request);
    if (await customer.isLoggedIn()) {
      const redirectTo = new URL(request.url).searchParams.get('redirect') || '/account';
      return redirect(redirectTo);
    }
    return {
      redirectTo: new URL(request.url).searchParams.get('redirect') || '/account',
      error: new URL(request.url).searchParams.get('error') || null,
    };
  } catch (err) {
    return {
      redirectTo: '/account',
      error: `Auth client error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export default function LoginPage() {
  const { redirectTo, error } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const queryError = error || searchParams.get('error');

  const stagger = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-forest via-forest-light to-forest relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[28rem] h-[28rem] bg-clay/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-[20rem] h-[20rem] bg-sage/8 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-lg mx-auto text-center"
        >
          <Badge variant="secondary" className="mb-4 text-cream/60 border-cream/10 bg-cream/5">
            Welcome Back
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">
            Sign In
          </h1>
          <p className="text-cream/60 leading-relaxed">
            Access your account to view orders, manage your profile, and more.
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-6 bg-cream">
        <div className="max-w-md mx-auto">
          {queryError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {queryError}
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="bg-cream-light/80 backdrop-blur-sm rounded-2xl border border-cream-dark/30 p-8 shadow-sm"
          >
            <motion.div variants={stagger}>
              <Button
                variant="primary"
                size="lg"
                className="w-full rounded-xl"
                as="a"
                href={`/account/authorize?redirect=${encodeURIComponent(redirectTo)}`}
              >
                <LogIn className="w-4 h-4" />
                Sign in with Shopify
              </Button>
            </motion.div>

            <motion.div variants={stagger} className="mt-4">
              <p className="text-xs text-forest/50 text-center leading-relaxed">
                You'll be redirected to Shopify's secure login page.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-dark/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-cream-light/80 px-3 text-forest/40">New to SERENE?</span>
              </div>
            </motion.div>

            <motion.div variants={stagger}>
              <Button
                variant="secondary"
                size="lg"
                className="w-full rounded-xl"
                as="a"
                href={`/account/authorize?redirect=${encodeURIComponent(redirectTo)}`}
              >
                <Sparkles className="w-4 h-4" />
                Create an Account
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-forest/40 mt-6"
          >
            By signing in, you agree to our{' '}
            <Link to="/policies/privacy-policy" className="text-clay hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/policies/terms-of-service" className="text-clay hover:underline">
              Terms of Service
            </Link>.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
