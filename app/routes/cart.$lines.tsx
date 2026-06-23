import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────

interface CartLinesLoaderData {
  linesParam: string;
}

// ──────────────────────────────────────────────
// LOADER
// ──────────────────────────────────────────────

export async function loader({ params }: LoaderFunctionArgs) {
  const { lines } = params;
  return { linesParam: lines ?? '' } satisfies CartLinesLoaderData;
}

// ──────────────────────────────────────────────
// ANIMATION VARIANTS
// ──────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

// ──────────────────────────────────────────────
// PAGE COMPONENT
// ──────────────────────────────────────────────

export default function CartLinesPage() {
  const { linesParam } = useLoaderData<typeof loader>();

  // Decode and clean up the lines param for display
  const decodedLines = decodeURIComponent(linesParam).replace(/[_-]/g, ' ');
  const displayLabel = decodedLines || 'selected items';

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
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-cream/50 mb-6">
              <Link to="/" className="hover:text-clay-light transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link
                to="/cart"
                className="hover:text-clay-light transition-colors"
              >
                Cart
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-cream/80 capitalize">{displayLabel}</span>
            </div>

            {/* Back link */}
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-cream/60 hover:text-clay-light text-sm font-medium transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cream/10 backdrop-blur-sm border border-cream/10">
                <Package className="w-6 h-6 text-cream" />
              </div>
              <div>
                <h1 className="font-heading text-5xl md:text-6xl text-cream leading-[1.1] capitalize">
                  {displayLabel}
                </h1>
                <p className="text-cream/50 text-sm mt-2">Cart line details</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — EMPTY STATE
          ═══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp}
            className="text-center max-w-lg mx-auto"
          >
            {/* Icon */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cream-dark/40 to-forest/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Package className="w-10 h-10 text-forest/30" />
            </div>

            <Badge variant="secondary" className="mb-4 capitalize">
              {displayLabel}
            </Badge>

            <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">
              Specific Cart Lines
            </h2>

            <p className="text-forest/60 leading-relaxed mb-6">
              You&apos;re viewing a dedicated view for{' '}
              <strong className="text-forest capitalize">{displayLabel}</strong>.
              This page displays details about specific cart line items selected
              from your cart.
            </p>

            <p className="text-forest/50 text-sm leading-relaxed mb-10">
              Cart line details will be available once items are added to your
              cart and this view is properly configured with the Storefront API.
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
                href="/cart"
                className="rounded-full"
              >
                View Full Cart
              </Button>
            </div>

            {/* Placeholder for future line items */}
            <div className="mt-16 pt-8 border-t border-cream-dark/20">
              <p className="text-xs text-forest/40 uppercase tracking-widest mb-6">
                Line items preview
              </p>
              <div className="grid gap-4 max-w-md mx-auto text-left">
                {[
                  {
                    label: 'Product title & variant',
                    desc: 'Linked product handle for navigation',
                  },
                  {
                    label: 'Quantity & price',
                    desc: 'Adjustable count with line total',
                  },
                  {
                    label: 'Remove action',
                    desc: 'Trash2 icon to delete from cart',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-cream-light/60 border border-cream-dark/20 border-dashed"
                  >
                    <div className="w-12 h-12 rounded-lg bg-forest/5 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-forest/20" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-forest">
                        {item.label}
                      </p>
                      <p className="text-xs text-forest/50">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — BOTTOM CTA
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
              Ready to Complete Your Purchase?
            </h2>
            <p className="text-forest/60 max-w-md mx-auto mb-8 leading-relaxed">
              Head back to your full cart to review all items and proceed to
              checkout.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                href="/cart"
                className="rounded-full"
              >
                Return to Cart
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/collections/all"
                className="rounded-full"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
