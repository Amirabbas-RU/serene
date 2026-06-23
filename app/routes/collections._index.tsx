import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { getStorefrontClient } from '~/lib/storefront';

const COLLECTIONS_QUERY = `#graphql
  query Collections {
    collections(first: 20) {
      nodes {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
        productsCount {
          count
        }
      }
    }
  }
`;

export async function loader({}: LoaderFunctionArgs) {
    const storefront = getStorefrontClient();
  const collections = await storefront.query(COLLECTIONS_QUERY, {
    cache: storefront.CacheLong(),
  });
  return { collections };
}

export default function CollectionsPage() {
  const { collections } = useLoaderData<typeof loader>();
  const collectionNodes = collections?.collections?.nodes ?? [];

  return (
    <div>
      {/* ─── PAGE HEADER ─── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-forest via-forest-light to-forest relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-clay/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[24rem] h-[24rem] bg-sage/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <Badge variant="secondary" className="mb-4 text-cream/60 border-cream/10 bg-cream/5">
            Browse by Category
          </Badge>
          <h1 className="font-heading text-5xl md:text-6xl text-cream mb-4">
            Our Collections
          </h1>
          <p className="text-cream/50 max-w-xl text-lg leading-relaxed">
            Explore our thoughtfully curated collections, each designed to bring
            a sense of calm and beauty to your world.
          </p>
        </motion.div>
      </section>

      {/* ─── COLLECTIONS GRID ─── */}
      {collectionNodes.length > 0 ? (
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collectionNodes.map((collection: any, i: number) => (
                <motion.a
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                  className="group"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-forest/5 mb-5 relative">
                    {collection.image ? (
                      <img
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-forest-light to-forest flex items-center justify-center">
                        <span className="font-heading text-cream/20 text-6xl">
                          {collection.title[0]}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-heading text-xl text-forest group-hover:text-clay transition-colors mb-1.5">
                        {collection.title}
                      </h2>
                      {collection.description && (
                        <p className="text-forest/50 text-sm leading-relaxed line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-forest/30 group-hover:text-clay group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>

                  {collection.productsCount?.count != null && (
                    <p className="text-[11px] uppercase tracking-widest text-clay/60 mt-3">
                      {collection.productsCount.count}{' '}
                      {collection.productsCount.count === 1 ? 'Product' : 'Products'}
                    </p>
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full bg-cream-dark/30 flex items-center justify-center mx-auto mb-6">
              <span className="font-heading text-forest/30 text-3xl">C</span>
            </div>
            <h2 className="font-heading text-2xl text-forest mb-2">No collections yet</h2>
            <p className="text-forest/50 mb-8">
              Collections will appear here once you create them in your Shopify admin.
            </p>
            <Button variant="secondary" href="/">
              Back to Home
            </Button>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 bg-gradient-to-t from-cream to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">
              Ready to Explore All Products?
            </h2>
            <p className="text-forest/60 max-w-md mx-auto mb-8">
              Browse our full catalog of thoughtfully designed pieces.
            </p>
            <Button variant="primary" size="lg" href="/collections/all" className="rounded-full">
              Shop All Products <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
