import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  ChevronRight,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { useCart } from '~/lib/cart-context';

// ──────────────────────────────────────────────
// LOADER (minimal — cart state lives in context)
// ──────────────────────────────────────────────

export async function loader({}: LoaderFunctionArgs) {
  return {};
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

function formatPrice(amount: string, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(parseFloat(amount));
}

// ──────────────────────────────────────────────
// ANIMATION VARIANTS
// ──────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.25, ease: [0.42, 0, 1, 1] as const },
  },
};

// ──────────────────────────────────────────────
// PAGE COMPONENT
// ──────────────────────────────────────────────

export default function CartPage() {
  const {} = useLoaderData<typeof loader>();
  const { items, totalQuantity, subtotal, updateQuantity, removeItem, clearCart, checkout } = useCart();
  const isEmpty = items.length === 0;

  return (
    <div>
      {/* ═══════════════════════════════════════
          SECTION 1 — PAGE HEADER
          ═══════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-forest via-forest-light to-forest-dark">
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-forest-light/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-clay/10 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-sage/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {/* Back link */}
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 text-cream/60 hover:text-clay-light text-sm font-medium transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cream/10 backdrop-blur-sm border border-cream/10">
                <ShoppingBag className="w-6 h-6 text-cream" />
              </div>
              <div>
                <h1 className="font-heading text-5xl md:text-6xl text-cream leading-[1.1]">
                  Your Cart
                </h1>
                {!isEmpty && (
                  <p className="text-cream/50 text-sm mt-2">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — CART WITH ITEMS
          ═══════════════════════════════════════ */}
      {!isEmpty ? (
        <section className="py-12 px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-forest/50" />
                <h2 className="font-heading text-2xl text-forest">
                  Cart Items
                </h2>
                <Badge variant="secondary">{totalQuantity}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm text-forest/40 hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  to="/collections/all"
                  className="text-sm text-forest/50 hover:text-clay flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Continue Shopping
                </Link>
              </div>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* ─── LEFT: LINE ITEMS (2/3) ─── */}
              <div className="lg:col-span-2">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  className="space-y-4"
                >
                  {items.map((item) => {
                    const lineTotal = (
                      parseFloat(item.price.amount) * item.quantity
                    ).toFixed(2);

                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                        className="group flex gap-4 p-4 rounded-xl bg-cream-light/80 border border-cream-dark/20 hover:border-cream-dark/40 hover:shadow-sm transition-all duration-200"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/products/${item.handle}`}
                          className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-forest/5"
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.imageAlt ?? item.title}
                              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-dark/40 to-forest/10">
                              <span className="font-heading text-forest/15 text-xl">
                                {item.title?.[0] || 'P'}
                              </span>
                            </div>
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                to={`/products/${item.handle}`}
                                className="font-medium text-forest text-sm hover:text-clay transition-colors line-clamp-1"
                              >
                                {item.title}
                              </Link>
                              {item.variantTitle !== 'Default Title' && (
                                <p className="text-forest/50 text-xs mt-1">
                                  {item.variantTitle}
                                </p>
                              )}
                            </div>

                            {/* Line total */}
                            <p className="text-forest font-medium text-sm whitespace-nowrap shrink-0">
                              {formatPrice(lineTotal, item.price.currencyCode)}
                            </p>
                          </div>

                          {/* Quantity controls + Remove */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-lg border border-cream-dark/30 bg-cream-light text-forest/60 hover:text-forest hover:border-cream-dark/50 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-medium text-forest tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-8 h-8 rounded-lg border border-cream-dark/30 bg-cream-light text-forest/60 hover:text-forest hover:border-cream-dark/50 flex items-center justify-center transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs text-forest/40">
                                {formatPrice(item.price.amount, item.price.currencyCode)} ea
                              </span>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="w-8 h-8 rounded-lg text-forest/30 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* ─── RIGHT: ORDER SUMMARY (1/3) ─── */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                  className="sticky top-24"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                      <CardDescription>
                        Review your items before checkout
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Subtotal */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-forest/60">Subtotal</span>
                        <span className="text-forest font-medium">
                          {formatPrice(subtotal.amount, subtotal.currencyCode)}
                        </span>
                      </div>

                      {/* Shipping */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-forest/60">Shipping</span>
                        <span className="text-forest/50 text-xs italic">
                          Calculated at checkout
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-cream-dark/20 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-forest font-medium">Total</span>
                          <span className="font-heading text-xl text-forest">
                            {formatPrice(subtotal.amount, subtotal.currencyCode)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full rounded-xl"
                        onClick={checkout}
                      >
                        Proceed to Checkout
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <p className="text-xs text-forest/40 text-center">
                        Taxes and shipping calculated at checkout
                      </p>
                    </CardFooter>
                  </Card>

                  {/* Continue shopping link below summary */}
                  <div className="mt-6 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      href="/collections/all"
                      className="text-xs"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Continue Shopping
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ═══════════════════════════════════════
            SECTION 3 — EMPTY STATE
            ═══════════════════════════════════════ */
        <section className="py-24 px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="text-center max-w-md mx-auto"
            >
              {/* Icon */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cream-dark/40 to-forest/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Package className="w-10 h-10 text-forest/30" />
              </div>

              <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">
                Your Cart is Empty
              </h2>

              <p className="text-forest/60 leading-relaxed mb-8">
                It looks like you haven&apos;t added anything yet. Explore our
                collection of thoughtfully designed pieces and find something
                serene for your life.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  href="/collections/all"
                  className="rounded-full"
                >
                  Shop Now
                  <ShoppingBag className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href="/collections"
                  className="rounded-full"
                >
                  Browse Collections
                </Button>
              </div>

              {/* Suggestions row */}
              <div className="mt-12 pt-8 border-t border-cream-dark/20">
                <p className="text-xs text-forest/40 uppercase tracking-widest mb-4">
                  Quick links
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['New Arrivals', 'Best Sellers', 'Sale', 'Gifts'].map(
                    (label) => (
                      <Link
                        key={label}
                        to="/collections/all"
                        className="text-sm text-forest/50 hover:text-clay transition-colors px-3 py-1.5 rounded-full bg-cream-dark/20 hover:bg-clay/10"
                      >
                        {label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          BOTTOM CTA (always visible)
          ═══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-t from-cream-dark/40 to-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">
              Need Inspiration?
            </h2>
            <p className="text-forest/60 max-w-md mx-auto mb-8">
              Discover our latest arrivals and curated collections.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" href="/collections/all" className="rounded-full">
                Shop All Products
                <ShoppingBag className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="lg" href="/collections" className="rounded-full">
                Browse Collections
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
