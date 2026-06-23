import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Grid3X3, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { getStorefrontClient } from '~/lib/storefront';

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $first: Int) {
    collection(handle: $handle) {
      id
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      seo {
        title
        description
      }
      products(first: $first) {
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
  }
`;

export async function loader({ params, request }: LoaderFunctionArgs) {
  const storefront = getStorefrontClient();
  const { handle } = params;

  if (!handle) {
    throw new Response('No collection handle provided', { status: 404 });
  }

  const data = await storefront.query(COLLECTION_QUERY, {
    variables: { handle, first: 48 },
    cache: storefront.CacheLong(),
  });

  const collection = data?.collection;

  if (!collection) {
    throw new Response('Collection not found', { status: 404 });
  }

  return { collection };
}

export default function CollectionDetailPage() {
  const { collection } = useLoaderData<typeof loader>();
  const products = collection?.products?.nodes ?? [];

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-forest via-forest-light to-forest overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-clay/10 rounded-full blur-3xl animate-blob1" />
          <div className="absolute -bottom-32 -right-32 w-[24rem] h-[24rem] bg-sage/10 rounded-full blur-3xl animate-blob2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex items-center gap-2 text-sm text-cream/50 mb-6"
          >
            <Link to="/" className="hover:text-clay-light transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/collections" className="hover:text-clay-light transition-colors">Collections</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-cream/80">{collection?.title ?? 'Collection'}</span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <Badge variant="secondary" className="mb-4 text-cream/60 border-cream/10 bg-cream/5">
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </Badge>
              <h1 className="font-heading text-5xl md:text-6xl text-cream mb-4 leading-[1.1]">
                {collection?.title ?? 'Collection'}
              </h1>
              {collection?.description && (
                <p className="text-cream/60 text-lg leading-relaxed max-w-lg">
                  {collection.description}
                </p>
              )}
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative"
            >
              {collection?.image ? (
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-forest-dark via-forest to-forest-light flex items-center justify-center shadow-2xl">
                  <span className="font-heading text-cream/10 text-8xl">
                    {collection?.title?.[0] ?? 'C'}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT GRID ─── */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between mb-10"
              >
                <div className="flex items-center gap-2 text-sm text-forest/50">
                  <Grid3X3 className="w-4 h-4" />
                  <span>Showing {products.length} {products.length === 1 ? 'product' : 'products'}</span>
                </div>
                <Link
                  to="/collections"
                  className="text-sm text-forest/50 hover:text-clay flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  All Collections
                </Link>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product: any, i: number) => (
                  <motion.a
                    key={product.id}
                    href={`/products/${product.handle}`}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    className="group"
                  >
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

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                        <span className="text-white text-xs font-medium bg-clay px-4 py-2 rounded-full backdrop-blur-sm">
                          Quick View
                        </span>
                      </div>

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

              {collection?.products?.pageInfo?.hasNextPage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mt-14"
                >
                  <Button variant="secondary" size="lg" className="rounded-full">
                    Load More <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-cream-dark/30 flex items-center justify-center mx-auto mb-6">
                <Grid3X3 className="w-8 h-8 text-forest/30" />
              </div>
              <h2 className="font-heading text-2xl text-forest mb-2">No products in this collection</h2>
              <p className="text-forest/50 mb-8">
                This collection doesn't have any products yet.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="primary" href="/collections/all" as="a">
                  Browse All Products <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="secondary" href="/collections" as="a">
                  View Collections
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
