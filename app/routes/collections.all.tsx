import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { Grid3X3, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {storefrontQuery} from '~/lib/storefront';
import type { ShopifyProduct } from '~/lib/shopify-types';

interface CollectionsQueryResult {
  collections: { nodes: { id: string; title: string; handle: string }[] };
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts($first: Int) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        vendor
        description
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
        availableForSale
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const COLLECTIONS_QUERY = `#graphql
  query CollectionsForNav {
    collections(first: 10) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

export async function loader({}: LoaderFunctionArgs) {
  const [products, collections] = await Promise.all([
    storefrontQuery<{ products: { nodes: ShopifyProduct[] } }>(ALL_PRODUCTS_QUERY, { variables: { first: 24 } }),
    storefrontQuery<CollectionsQueryResult>(COLLECTIONS_QUERY),
  ]);

  return { products, collections };
}

export default function ShopPage() {
  const { products, collections } = useLoaderData<typeof loader>();
  const productNodes: ShopifyProduct[] = products?.products?.nodes ?? [];
  const collectionNodes = collections?.collections?.nodes ?? [];

  return (
    <div>
      {/* ─── PAGE HEADER ─── */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-cream-dark/30 to-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <Badge variant="secondary" className="mb-4">Our Collection</Badge>
            <h1 className="font-heading text-5xl md:text-6xl text-forest mb-4">
              Shop All Products
            </h1>
            <p className="text-forest/60 max-w-xl text-lg leading-relaxed">
              Discover our complete range of thoughtfully designed pieces,
              crafted to bring serenity into your everyday life.
            </p>
          </motion.div>

          {/* Filters bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-8 border-t border-cream-dark/30"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-forest/50" />
              <div className="flex gap-2 flex-wrap">
                <button className="text-xs font-medium px-3 py-1.5 rounded-full bg-forest text-cream transition-all">
                  All
                </button>
                {collectionNodes.map((col, i) => (
                  <a
                    key={col.id}
                    href={`/collections/${col.handle}`}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-cream-dark/30 text-forest/60 hover:bg-forest hover:text-cream transition-all"
                  >
                    {col.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-forest/50">
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{productNodes.length} Products</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRODUCT GRID ─── */}
      {productNodes.length > 0 ? (
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8"
            >
              {productNodes.map((product, i) => (
                <a
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${(i % 12) * 60}ms` }}
                >
                  {/* Image */}
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-forest/5 mb-3 relative">
                    {product.featuredImage ? (
                      <img
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cream-dark/40 to-forest/10 flex items-center justify-center">
                        <span className="font-heading text-forest/15 text-5xl">
                          {product.title?.[0] || 'P'}
                        </span>
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                      <span className="text-white text-xs font-medium bg-clay px-4 py-2 rounded-full backdrop-blur-sm">
                        Quick View
                      </span>
                    </div>

                    {/* Badges */}
                    {!product.availableForSale && (
                      <span className="absolute top-3 left-3 bg-forest-dark text-cream/70 text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
                        Sold Out
                      </span>
                    )}
                    {product.tags?.includes('sale') && product.availableForSale && (
                      <span className="absolute top-3 left-3 bg-clay text-white text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                    {product.tags?.includes('new') && product.availableForSale && (
                      <span className="absolute top-3 right-3 bg-forest text-cream text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  {product.vendor && (
                    <p className="text-[11px] uppercase tracking-widest text-clay/70 mb-0.5">
                      {product.vendor}
                    </p>
                  )}
                  <h3 className="font-medium text-forest text-sm line-clamp-2 group-hover:text-clay transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {product.compareAtPriceRange?.minVariantPrice?.amount &&
                    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
                      parseFloat(product.priceRange.minVariantPrice.amount) ? (
                      <>
                        <p className="text-clay font-medium text-sm">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: product.priceRange.minVariantPrice.currencyCode,
                          }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                        </p>
                        <p className="text-forest/30 text-xs line-through">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: product.compareAtPriceRange.minVariantPrice.currencyCode,
                          }).format(parseFloat(product.compareAtPriceRange.minVariantPrice.amount))}
                        </p>
                      </>
                    ) : (
                      <p className="text-forest/60 text-sm">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: product.priceRange.minVariantPrice.currencyCode,
                        }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full bg-cream-dark/30 flex items-center justify-center mx-auto mb-6">
              <Grid3X3 className="w-8 h-8 text-forest/30" />
            </div>
            <h2 className="font-heading text-2xl text-forest mb-2">No products yet</h2>
            <p className="text-forest/50 mb-8">
              Products will appear here once they're added to your store.
            </p>
            <Button variant="secondary" href="/">
              Back to Home
            </Button>
          </div>
        </section>
      )}

      {/* ─── BOTTOM CTA ─── */}
      <section className="py-20 px-6 bg-gradient-to-t from-cream-dark/40 to-cream">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-forest/60 max-w-md mx-auto mb-8">
              Browse our curated collections for a more tailored shopping experience.
            </p>
            <Button variant="primary" size="lg" href="/collections" className="rounded-full">
              Explore Collections <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
