import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Form, Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { getStorefrontClient } from '~/lib/storefront';

export async function loader({ request }: LoaderFunctionArgs) {
  const storefront = getStorefrontClient();
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/account';

  return {
    shopName: 'SERENE',
    redirectTo,
  };
}

export default function LoginPage() {
  const { redirectTo } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const [showPassword, setShowPassword] = useState(false);

  const stagger = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* ─── HEADER ─── */}
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

      {/* ─── LOGIN FORM ─── */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-md mx-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error === 'invalid_credentials'
                ? 'Invalid email or password. Please try again.'
                : error === 'required'
                  ? 'Please fill in all required fields.'
                  : 'An error occurred. Please try again.'}
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="bg-cream-light/80 backdrop-blur-sm rounded-2xl border border-cream-dark/30 p-8 shadow-sm"
          >
            <Form method="POST" action="/account/authorize" className="space-y-5">
              <input type="hidden" name="redirect" value={redirectTo} />

              {/* Email */}
              <motion.div variants={stagger}>
                <label htmlFor="email" className="block text-sm font-medium text-forest/80 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-cream-dark/40 bg-white/60 text-forest placeholder:text-forest/30 text-sm focus:outline-none focus:border-clay/60 focus:ring-2 focus:ring-clay/20 transition-all"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={stagger}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-forest/80">
                    Password
                  </label>
                  <Link
                    to="/account/login?lost=password"
                    className="text-xs text-clay hover:text-clay-dark transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full h-12 pl-10 pr-10 rounded-xl border border-cream-dark/40 bg-white/60 text-forest placeholder:text-forest/30 text-sm focus:outline-none focus:border-clay/60 focus:ring-2 focus:ring-clay/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={stagger}>
                <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </motion.div>
            </Form>

            {/* Divider */}
            <motion.div variants={stagger} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-dark/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-cream-light/80 px-3 text-forest/40">New to SERENE?</span>
              </div>
            </motion.div>

            {/* Register */}
            <motion.div variants={stagger}>
              <Button variant="secondary" size="lg" className="w-full rounded-xl" as="a" href="/account/register">
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
