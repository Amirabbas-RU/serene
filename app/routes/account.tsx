import { Outlet, NavLink, Link } from 'react-router';
import { motion } from 'framer-motion';
import { User, Package, MapPin, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

const ACCOUNT_LINKS = [
  { label: 'Overview', to: '/account', icon: User },
  { label: 'Orders', to: '/account/orders', icon: Package },
  { label: 'Profile', to: '/account/profile', icon: User },
  { label: 'Addresses', to: '/account/addresses', icon: MapPin },
];

export default function AccountLayout() {
  return (
    <div>
      {/* ─── HEADER ─── */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-forest via-forest-light to-forest relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-clay/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[20rem] h-[20rem] bg-sage/8 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl text-cream">My Account</h1>
              <p className="text-cream/60 mt-2">Manage your profile, orders, and preferences.</p>
            </div>
            <Link to="/collections/all">
              <Button variant="outline-light" size="sm">
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="py-12 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-1"
            >
              <nav className="flex flex-col gap-1 rounded-2xl bg-cream-light/80 border border-cream-dark/30 p-2 shadow-sm">
                {ACCOUNT_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/account'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-forest text-cream shadow-sm'
                          : 'text-forest/60 hover:text-forest hover:bg-forest/5',
                      )
                    }
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                  </NavLink>
                ))}
                <div className="border-t border-cream-dark/20 my-1" />
                <Link
                  to="/account/logout"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-forest/50 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Link>
              </nav>

              {/* Quick stats card */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-forest/5 to-clay/5 border border-cream-dark/30 p-5">
                <h3 className="font-heading text-sm text-forest/70 mb-2">Need Help?</h3>
                <p className="text-xs text-forest/50 leading-relaxed mb-3">
                  Contact our support team for assistance with orders, returns, or account issues.
                </p>
                <Link to="/pages/contact" className="text-xs text-clay hover:text-clay-dark font-medium inline-flex items-center gap-1">
                  Contact Support <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3"
            >
              <Outlet />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
