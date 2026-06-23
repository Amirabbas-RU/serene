import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Package, MapPin, User, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';

export default function AccountIndex() {
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
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Manage your account, view orders, and update your information.
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
            count: '0',
          },
          {
            icon: MapPin,
            title: 'Addresses',
            desc: 'Manage shipping addresses',
            href: '/account/addresses',
            count: '0',
          },
          {
            icon: User,
            title: 'Profile',
            desc: 'Name, email, and password',
            href: '/account/profile',
            count: '',
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
              {item.count !== '' && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="w-3 h-3 text-forest/30" />
                  <span className="text-xs text-forest/40">{item.count} items</span>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
