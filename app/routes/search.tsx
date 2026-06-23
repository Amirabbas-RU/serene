import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link, Form, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Search, X, ArrowRight, Package, SlidersHorizontal } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import { getStorefrontClient } from '~/lib/storefront';

const SEARCH_PRODUCTS_QUERY = `#graphql
  query SearchProducts($first: Int, $query: String) {
    products(first: $first, query: $query) {
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
    }
  }
`;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('q')?.trim() || '';

  const storefront = getStorefrontClient();

  if (!searchQuery) {
    return { products: null, searchQuery: '' };
  }

  const data = await storefront.query(SEARCH_PRODUCTS_QUERY, {
    variables: { first: 24, query: searchQuery },
    cache: storefront.CacheShort(),
  });

  return { products: data, searchQuery };
}

const POPULAR_SEARCHES = [
  'Bags',
  'Hats',
  'Apparel',
  'Accessories',
  'Home',
  'Gift',
  'New',
  'Sale',
];

export default function SearchPage() {
  const { products, searchQuery } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  const productNodes = products?.products?.nodes ?? [];
  const hasSearched = searchQuery.length > 0;

  return (
    <div>
      {/* ─── PAGE HEADER ─── */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-forest via-forest-light to-forest overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-forest-dark/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[24rem] h-[24rem] bg-forest-dark/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-cream mb-4">
              Search
            </h1>
            <p className="text-cream/60 max-w-xl mx-auto text-lg leading-relaxed">
              Find exactly what you're looking for in our curated collection.
            </p>
          </motion.div>

          {/* Search input bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-10"
          >
            <Form method="get" action="/search" className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-5 h-5 text-cream/40 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  defaultValue={currentQuery}
                  placeholder="Search products..."
                  className="w-full h-14 pl-14 pr-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-cream placeholder:text-cream/30 text-lg font-body focus:outline-none focus:ring-2 focus:ring-clay/50 focus:border-clay/50 transition-all"
                  autoComplete="off"
                />
                {currentQuery && (
                  <Link
                    to="/search"
                    className="absolute right-4 p-2 text-cream/40 hover:text-cream transition-colors rounded-full hover:bg-white/10"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </Form>
          </motion.div>
        </div>
      </section>

      {/* ─── RESULTS / PLACEHOLDER ─── */}
      <section className="px-6 pb-24 pt-12">
        <div className="max-w-7xl mx-auto">
          {hasSearched ? (
            <>
              {/* Results count */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-10"
              >
                <SlidersHorizontal className="w-4 h-4 text-forest/50" />
                <span className="text-sm text-forest/60">
                  {productNodes.length === 0
                    ? 'No results'
                    : `${productNodes.length} ${productNodes.length === 1 ? 'result' : 'results'} for "${searchQuery}"`}
                </span>
              </motion.div>

              {productNodes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {productNodes.map((product: any, i: number) => (
                    <motion.a
                      key={product.id}
                      href={`/products/${product.handle}`}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                      className="group"
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
                    </motion.a>
                  ))}
                </div>
              ) : (
                /* No results state */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-cream-dark/30 flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-forest/30" />
                  </div>
                  <h2 className="font-heading text-2xl text-forest mb-2">No results found</h2>
                  <p className="text-forest/50 max-w-md mx-auto mb-8">
                    We couldn't find any products matching "<strong>{searchQuery}</strong>".
                    Try adjusting your search terms or browse our full collection.
                  </p>
                  <Button variant="primary" size="lg" href="/collections/all" className="rounded-full">
                    Browse All Products <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            /* Placeholder — no search query, show suggestions */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-forest/5 flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-forest/30" />
              </div>
              <h2 className="font-heading text-2xl text-forest mb-2">What are you looking for?</h2>
              <p className="text-forest/50 max-w-md mx-auto mb-10">
                Type a keyword above or choose from one of our popular search terms.
              </p>

              <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    to={`/search?q=${encodeURIComponent(term)}`}
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-cream-dark/40 text-forest/70 hover:bg-clay hover:text-white transition-all duration-200"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      {hasSearched && productNodes.length > 0 && (
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
      )}
    </div>
  );
}
