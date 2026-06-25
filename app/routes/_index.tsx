import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Form } from 'react-router';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Truck, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import ProductCard from '~/components/ProductCard';
import { getStorefrontClient } from '~/lib/storefront';

const HERO_QUERY = `#graphql
  query HeroContent {
    collections(first: 3) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          id
          url
          altText
          width
          height
        }
        tags
      }
    }
  }
`;

export async function loader({}: LoaderFunctionArgs) {
  const storefront = getStorefrontClient();

  const [featuredCollection, recommendedProducts] = await Promise.all([
    storefront.query(HERO_QUERY),
    storefront.query(RECOMMENDED_PRODUCTS_QUERY),
  ]);

  return { featuredCollection, recommendedProducts };
}

const staggerItem = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HomePage() {
  const data = useLoaderData<typeof loader>();
  const featuredCollection = data?.featuredCollection;
  const recommendedProducts = data?.recommendedProducts;
  const products = recommendedProducts?.products?.nodes ?? [];
  const collections = featuredCollection?.collections?.nodes ?? [];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${10 + Math.random() * 8}s`,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div>
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-forest via-[#1e4a3a] to-forest-dark">
        {/* Ambient Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-clay/20 rounded-full blur-3xl animate-blob1" />
          <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-sage/15 rounded-full blur-3xl animate-blob2" />
          <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] bg-cream/7 rounded-full blur-3xl animate-blob3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] h-[24rem] bg-clay-light/15 rounded-full blur-3xl animate-blob1" style={{ animationDelay: '-10s' }} />
          <div className="absolute bottom-1/4 right-1/3 w-[18rem] h-[18rem] bg-forest-dark/30 rounded-full blur-3xl animate-blob2" style={{ animationDelay: '-6s' }} />
        </div>

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Concentric Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[90vh] h-[90vh] rounded-full border border-white/5 animate-spin-slow" />
          <div className="absolute inset-[10%] rounded-full border border-white/[0.04] animate-spin-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-[25%] rounded-full border border-white/[0.03] animate-spin-slow" />
          <div className="absolute inset-[42%] rounded-full border border-white/[0.02] animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* Floating Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-particle-drift"
            style={{
              left: p.left,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div {...staggerItem(0)} className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 border border-white/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-clay" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-clay-light" />
                <span className="text-xs tracking-widest uppercase text-clay-light font-medium">
                  Summer 2026 Collection
                </span>
              </motion.div>

              <motion.h1 {...staggerItem(0.12)} className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white">
                Discover Your{' '}
                <span className="bg-gradient-to-r from-clay via-clay-light to-clay bg-clip-text text-transparent">
                  Serene
                </span>
              </motion.h1>

              <motion.p {...staggerItem(0.24)} className="text-lg text-white/60 leading-relaxed max-w-md">
                Where timeless elegance meets modern simplicity. Curated pieces
                designed to bring calm and beauty to every moment of your day.
              </motion.p>

              <motion.div {...staggerItem(0.36)} className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" className="rounded-full" href="/collections/all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline-light" size="lg" className="rounded-full" href="/collections">
                  Explore Collections
                </Button>
              </motion.div>

              {/* Trust Bar */}
              <motion.div {...staggerItem(0.48)} className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: Shield, label: 'Premium Quality', stat: '12K+' },
                  { icon: Sparkles, label: 'Ethical Craft', stat: '98%' },
                  { icon: Truck, label: 'Free Shipping', stat: '4.9' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-white/50">
                    <item.icon className="w-4 h-4 text-clay" />
                    <span className="text-xs tracking-wide">{item.label}</span>
                    <span className="text-xs font-semibold text-white/80 ml-1">
                      {item.stat}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Floating Product Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="hidden lg:block relative w-[320px] h-[560px]"
            >
              {/* Card 1 — Primary Product (top-right) */}
              {products[0] && (
                <motion.a
                  href={`/products/${products[0].handle}`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="group/card absolute top-0 right-2 w-64 rounded-2xl overflow-hidden border border-white/[0.10] bg-white/[0.04] backdrop-blur-2xl hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-500 shadow-2xl shadow-black/20 z-20"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {products[0].featuredImage ? (
                      <img
                        src={products[0].featuredImage.url}
                        alt={products[0].featuredImage.altText || products[0].title}
                        className="w-full h-full object-cover transition duration-700 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-clay/20 to-forest-light/20 flex items-center justify-center">
                        <span className="text-cream/20 font-heading text-2xl">{products[0].title[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-4">
                    {products[0].vendor && (
                      <p className="text-[10px] uppercase tracking-[0.2em] text-clay-light/80 mb-1">
                        {products[0].vendor}
                      </p>
                    )}
                    <h3 className="font-heading text-sm text-white leading-tight group-hover/card:text-clay-light transition-colors duration-300">
                      {products[0].title}
                    </h3>
                    <p className="text-xs text-cream/50 mt-1.5 font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: products[0].priceRange.minVariantPrice.currencyCode,
                      }).format(parseFloat(products[0].priceRange.minVariantPrice.amount))}
                    </p>
                  </div>
                </motion.a>
              )}

              {/* Card 2 — Secondary Product (lower-left) */}
              {products[1] && (
                <motion.a
                  href={`/products/${products[1].handle}`}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="group/card absolute top-60 left-0 w-56 rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-500 shadow-xl shadow-black/10 z-10"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {products[1].featuredImage ? (
                      <img
                        src={products[1].featuredImage.url}
                        alt={products[1].featuredImage.altText || products[1].title}
                        className="w-full h-full object-cover transition duration-700 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-sage/20 to-clay/20 flex items-center justify-center">
                        <span className="text-cream/20 font-heading text-2xl">{products[1].title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-heading text-sm text-white leading-tight group-hover/card:text-clay-light transition-colors duration-300">
                      {products[1].title}
                    </h3>
                    <p className="text-xs text-cream/50 mt-1 font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: products[1].priceRange.minVariantPrice.currencyCode,
                      }).format(parseFloat(products[1].priceRange.minVariantPrice.amount))}
                    </p>
                  </div>
                </motion.a>
              )}

              {/* Floating Trust Badge (bottom right) */}
              <motion.div
                animate={{ y: [0, -3, 0], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-4 right-4 flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
              >
                <div className="flex -space-x-1.5">
                  {['bg-clay', 'bg-sage', 'bg-cream'].map((bg, i) => (
                    <div key={i} className={`w-5 h-5 rounded-full ${bg} border border-white/15`} />
                  ))}
                </div>
                <span className="text-[11px] text-cream/60 font-medium tracking-wide">
                  2,400+ Happy Customers
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-clay/60 to-transparent" />
        </motion.div>
      </section>

      {/* ─── FEATURED COLLECTION ─── */}
      <section className="py-24 md:py-32 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">Curated Selections</Badge>
            <h2 className="font-heading text-4xl md:text-5xl text-forest mb-4">
              Featured Collections
            </h2>
            <p className="text-forest/60 max-w-lg mx-auto">
              Handpicked ensembles designed to transform your everyday.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {collections.length > 0 ? (
              collections.map((col: any, i: number) => (
                <motion.a
                  key={col.id}
                  href={`/collections/${col.handle}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-forest"
                >
                  {col.image ? (
                    <img
                      src={col.image.url}
                      alt={col.image.altText || col.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-forest-light to-forest flex items-center justify-center">
                      <span className="font-heading text-cream/30 text-4xl">{col.title[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-xl text-white mb-1">{col.title}</h3>
                    <span className="text-white/60 text-sm inline-flex items-center gap-1">
                      Explore <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.a>
              ))
            ) : (
              <>
                {['Summer Essentials', 'Home & Living', 'Artisan Craft'].map((title, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-forest-light to-forest"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading text-cream/20 text-6xl">{title[0]}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-heading text-xl text-white mb-1">{title}</h3>
                      <span className="text-white/60 text-sm inline-flex items-center gap-1">
                        Explore <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ─── RECOMMENDED PRODUCTS ─── */}
      <section className="py-24 md:py-32 px-6 bg-cream-dark/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
          >
            <div>
              <Badge variant="default" className="mb-4">New Arrivals</Badge>
              <h2 className="font-heading text-4xl md:text-5xl text-forest">
                Recommended for You
              </h2>
            </div>
            <a
              href="/collections/all"
              className="text-forest/60 hover:text-clay text-sm font-medium inline-flex items-center gap-1 transition-colors group"
            >
              View All Products
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: any, i: number) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    vendor: product.vendor,
                    price: product.priceRange.minVariantPrice,
                    compareAtPrice: product.compareAtPriceRange?.minVariantPrice ?? null,
                    featuredImage: product.featuredImage,
                    tags: product.tags,
                    available: product.availableForSale,
                  }}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-forest/50">
              <p>Products will appear here once added to your store.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── BRAND VALUES ─── */}
      <section className="py-24 md:py-32 px-6 bg-forest">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 text-cream/60 border-cream/10 bg-cream/5">
              Our Philosophy
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl text-cream mb-4">
              Crafted with Intention
            </h2>
            <p className="text-cream/50 max-w-lg mx-auto">
              Every piece tells a story of thoughtful design and enduring quality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Sustainable Materials', desc: 'We source only organic, renewable, and ethically harvested materials for every product.', icon: '🌿' },
              { title: 'Artisan Craftsmanship', desc: 'Each piece is hand-finished by skilled artisans using techniques passed down through generations.', icon: '🤲' },
              { title: 'Timeless Design', desc: 'Clean lines, neutral palettes, and enduring silhouettes that transcend seasonal trends.', icon: '⏳' },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                className="group p-8 rounded-2xl border border-cream/10 bg-cream/[0.03] hover:bg-cream/[0.06] transition-all duration-500"
              >
                <span className="text-3xl mb-4 block">{value.icon}</span>
                <h3 className="font-heading text-xl text-cream mb-3">{value.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-24 md:py-32 px-6 bg-cream relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[60vh] h-[60vh] rounded-full border border-clay/10" />
          <div className="absolute inset-[15%] rounded-full border border-clay/5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative z-10 max-w-lg mx-auto text-center"
        >
          <Badge variant="default" className="mb-4">Stay Connected</Badge>
          <h2 className="font-heading text-4xl md:text-5xl text-forest mb-4">
            Join Our World
          </h2>
          <p className="text-forest/60 mb-8 leading-relaxed">
            Be the first to discover new collections, receive exclusive offers,
            and find inspiration for your serene lifestyle.
          </p>
          <Form method="post" action="/contact" className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 h-12 px-5 rounded-xl border border-cream-dark/40 bg-white/60 backdrop-blur-sm text-forest placeholder:text-forest/30 text-sm focus:outline-none focus:border-clay/60 focus:ring-2 focus:ring-clay/20 transition-all"
            />
            <Button type="submit" variant="primary" size="lg" className="rounded-xl shrink-0">
              Subscribe <ArrowRight className="w-4 h-4" />
            </Button>
          </Form>
          <p className="text-xs text-forest/40 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
