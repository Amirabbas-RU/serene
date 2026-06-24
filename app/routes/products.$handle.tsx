import { useState, useMemo, useEffect, useRef } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
  Check,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Star,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import { getStorefrontClient } from '~/lib/storefront';
import { useCart } from '~/lib/cart-context';

/* ─── GraphQL Queries ─── */

const PRODUCT_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      availableForSale
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
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
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
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
  }
`;

const RELATED_PRODUCTS_QUERY = `#graphql
  query RelatedProducts($first: Int) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
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
        availableForSale
      }
    }
  }
`;

/* ─── Loader ─── */

export async function loader({ params }: LoaderFunctionArgs) {
  const storefront = getStorefrontClient();
  const { handle } = params;

  if (!handle) {
    return { product: null, relatedProducts: [] };
  }

  try {
    const [productData, relatedData] = await Promise.all([
      storefront.query(PRODUCT_QUERY, {
        variables: { handle },
        cache: storefront.CacheShort(),
      }),
      storefront.query(RELATED_PRODUCTS_QUERY, {
        variables: { first: 4 },
        cache: storefront.CacheLong(),
      }),
    ]);

    const product = productData?.productByHandle ?? null;
    const relatedProducts = relatedData?.products?.nodes ?? [];

    return { product, relatedProducts };
  } catch {
    return { product: null, relatedProducts: [] };
  }
}

/* ─── Types ─── */

interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

interface SelectedOption {
  name: string;
  value: string;
}

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: ProductImage | null;
}

interface ProductPrice {
  amount: string;
  currencyCode: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  descriptionHtml?: string | null;
  vendor?: string | null;
  availableForSale: boolean;
  tags: string[];
  priceRange: {
    minVariantPrice: ProductPrice;
    maxVariantPrice: ProductPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ProductPrice;
    maxVariantPrice: ProductPrice;
  } | null;
  featuredImage?: ProductImage | null;
  images?: {
    nodes: ProductImage[];
  } | null;
  variants?: {
    nodes: Variant[];
  } | null;
}

/* ─── Helpers ─── */

function formatPrice(amount: string, currencyCode = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

function isOnSale(product: Product): boolean {
  if (!product.compareAtPriceRange?.minVariantPrice?.amount) return false;
  const current = parseFloat(product.priceRange.minVariantPrice.amount);
  const compare = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  return compare > current && compare > 0;
}

function getBadges(product: Product): Array<{ label: string; variant: 'default' | 'secondary' | 'outline' }> {
  const tags = product.tags ?? [];
  const badges: Array<{ label: string; variant: 'default' | 'secondary' | 'outline' }> = [];

  if (isOnSale(product) || tags.some((t) => t.toLowerCase() === 'sale')) {
    badges.push({ label: 'Sale', variant: 'default' });
  }

  if (tags.some((t) => t.toLowerCase() === 'new' || t.toLowerCase() === 'new-arrival')) {
    badges.push({ label: 'New', variant: 'secondary' });
  }

  if (!product.availableForSale || tags.some((t) => t.toLowerCase() === 'sold-out')) {
    badges.push({ label: 'Sold Out', variant: 'outline' });
  }

  return badges;
}

function getUniqueOptions(variants: Variant[]): Record<string, string[]> {
  const optionMap: Record<string, Set<string>> = {};
  for (const variant of variants) {
    for (const option of variant.selectedOptions) {
      if (!optionMap[option.name]) optionMap[option.name] = new Set();
      optionMap[option.name].add(option.value);
    }
  }
  const result: Record<string, string[]> = {};
  for (const [name, values] of Object.entries(optionMap)) {
    result[name] = Array.from(values);
  }
  return result;
}

function findMatchingVariant(
  variants: Variant[],
  selectedOptions: Record<string, string>,
): Variant | undefined {
  return variants.find((v) =>
    v.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value,
    ),
  );
}

/* ─── Animation presets ─── */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-40px' } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const fadeUpDelayed = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-40px' } as const,
  transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
});

/* ─── Gallery Sub-component ─── */

function ImageGallery({
  images,
  featuredImage,
  productTitle,
}: {
  images: ProductImage[];
  featuredImage?: ProductImage | null;
  productTitle: string;
}) {
  const allImages = featuredImage
    ? [
        featuredImage,
        ...images.filter(
          (img) => img.url !== featuredImage.url,
        ),
      ]
    : images;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = allImages[selectedIndex] ?? null;

  const MAX_VISIBLE = 5;
  const hasMore = allImages.length > MAX_VISIBLE;

  return (
    <div className="space-y-4">
      {/* Main hero image */}
      <motion.div
        key={selectedIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark/40"
      >
        {currentImage ? (
          <img
            src={currentImage.url}
            alt={currentImage.altText ?? productTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-cream-dark/60 flex items-center justify-center">
                <Star className="h-6 w-6 text-forest/30" />
              </div>
              <p className="text-sm text-forest/40">No image available</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Thumbnail strip — max 5 visible, scrollable for overflow */}
      {allImages.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2.5 overflow-x-auto pb-1.5 scrollbar-none snap-x">
          {allImages.slice(0, MAX_VISIBLE).map((img, i) => (
            <button
              key={img.id ?? i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'relative shrink-0 snap-start w-12 sm:w-[72px] h-12 sm:h-[72px] rounded-lg overflow-hidden border-2 transition-all duration-200',
                i === selectedIndex
                  ? 'border-clay ring-1 ring-clay/30'
                  : 'border-transparent opacity-60 hover:opacity-90 hover:border-forest/20',
              )}
            >
              <img
                src={img.url}
                alt={img.altText ?? `${productTitle} thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}

          {/* "+N more" indicator — not a button, just visual */}
          {hasMore && (
            <span className="shrink-0 w-12 sm:w-[72px] h-12 sm:h-[72px] rounded-lg border-2 border-dashed border-forest/12 bg-cream-dark/20 flex items-center justify-center text-[11px] font-heading font-bold text-forest/25">
              +{allImages.length - MAX_VISIBLE}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Variant Picker Sub-component ─── */

function VariantPicker({
  variants,
  selectedOptions,
  onChange,
}: {
  variants: Variant[];
  selectedOptions: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  const options = useMemo(() => getUniqueOptions(variants), [variants]);

  if (Object.keys(options).length === 0) return null;

  return (
    <div className="space-y-4">
      {Object.entries(options).map(([optionName, optionValues]) => (
        <div key={optionName}>
          <p className="text-xs font-medium text-forest/70 uppercase tracking-wider mb-2">
            {optionName}
          </p>
          <div className="flex flex-wrap gap-2">
            {optionValues.map((value) => {
              const isSelected = selectedOptions[optionName] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange(optionName, value)}
                  className={cn(
                    'px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isSelected
                      ? 'bg-forest text-cream shadow-sm'
                      : 'bg-cream-dark/40 text-forest/70 hover:bg-cream-dark/70 border border-forest/10',
                  )}
                >
                  {isSelected && <Check className="inline-block w-3 h-3 mr-1.5 -mt-0.5" />}
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Quantity Selector Sub-component ─── */

function QuantitySelector({
  quantity,
  onChange,
  max,
}: {
  quantity: number;
  onChange: (q: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200',
          quantity <= 1
            ? 'text-forest/20 cursor-not-allowed'
            : 'text-forest/60 hover:bg-cream-dark/50 hover:text-forest',
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-12 text-center text-sm font-medium text-forest tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => {
          if (max && quantity >= max) return;
          onChange(quantity + 1);
        }}
        disabled={!!(max && quantity >= max)}
        className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200',
          max && quantity >= max
            ? 'text-forest/20 cursor-not-allowed'
            : 'text-forest/60 hover:bg-cream-dark/50 hover:text-forest',
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Main Page Component ─── */

export default function ProductDetailPage() {
  const data = useLoaderData<typeof loader>();
  const product: Product | null = data?.product ?? null;
  const relatedProducts: any[] = data?.relatedProducts ?? [];

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  // Initialize selected options from first available variant
  const variants = product?.variants?.nodes ?? [];
  const optionsInitialized = useRef(false);
  useEffect(() => {
    if (optionsInitialized.current) return;
    if (variants.length > 0 && Object.keys(selectedOptions).length === 0) {
      const initial: Record<string, string> = {};
      for (const variant of variants) {
        if (variant.availableForSale) {
          for (const opt of variant.selectedOptions) {
            if (!initial[opt.name]) initial[opt.name] = opt.value;
          }
          break;
        }
      }
      // If no available variant, just use the first variant's options
      if (Object.keys(initial).length === 0 && variants[0]) {
        for (const opt of variants[0].selectedOptions) {
          initial[opt.name] = opt.value;
        }
      }
      if (Object.keys(initial).length > 0) {
        setSelectedOptions(initial);
        optionsInitialized.current = true;
      }
    }
  }, [variants, selectedOptions]);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const matchingVariant = findMatchingVariant(variants, selectedOptions);
  const currentPrice = matchingVariant
    ? matchingVariant.price
    : product?.priceRange?.minVariantPrice ?? null;
  const compareAtPrice = product?.compareAtPriceRange?.minVariantPrice ?? null;
  const saleActive = product ? isOnSale(product) : false;
  const badges = product ? getBadges(product) : [];
  const productImages = product?.images?.nodes ?? [];
  const imagesExist = productImages.length > 0 || product?.featuredImage;

  // If no product, show not-found state
  if (!product) {
    return (
      <div className="min-h-screen bg-cream">
        {/* Page header */}
        <section className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 bg-gradient-to-b from-cream-dark/30 to-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <Badge variant="secondary" className="mb-4">Oops</Badge>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl text-forest mb-4">
                Product Not Found
              </h1>
              <p className="text-forest/60 max-w-xl text-lg leading-relaxed mb-8">
                The product you are looking for does not exist or may have been removed.
              </p>
              <Button variant="primary" href="/collections/all">
                <ChevronLeft className="w-4 h-4" />
                Back to Collections
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* ─── Page Header / Breadcrumb ─── */}
      <section className="pt-24 sm:pt-28 pb-6 sm:pb-8 px-4 sm:px-6 bg-gradient-to-b from-cream-dark/20 to-cream">
        <div className="max-w-7xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex items-center gap-2 text-xs text-forest/50 mb-4"
          >
            <Link to="/" className="hover:text-clay transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/collections/all" className="hover:text-clay transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-forest/80 font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </motion.nav>

          {/* Back link (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:hidden mb-3"
          >
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-forest/60 hover:text-clay transition-colors py-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Collections
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Product Content ─── */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* ── LEFT: Image Gallery ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <ImageGallery
                images={productImages}
                featuredImage={product.featuredImage}
                productTitle={product.title}
              />
            </motion.div>

            {/* ── RIGHT: Product Details ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex flex-col gap-4 sm:gap-6"
            >
              {/* Vendor */}
              {product.vendor && (
                <p className="text-xs uppercase tracking-widest text-clay/70">
                  {product.vendor}
                </p>
              )}

              {/* Title + Wishlist/Share actions */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-forest leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => setWishlisted((prev) => !prev)}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={wishlisted}
                    className={cn(
                      'h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200',
                      wishlisted
                        ? 'bg-red-50 text-red-500'
                        : 'text-forest/40 hover:text-red-400 hover:bg-red-50/50',
                    )}
                  >
                    <Heart
                      className={cn('h-4 w-4', wishlisted && 'fill-current')}
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Share"
                    className="h-9 w-9 rounded-full flex items-center justify-center text-forest/40 hover:text-clay hover:bg-clay/10 transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl sm:text-3xl text-forest">
                  {currentPrice
                    ? formatPrice(currentPrice.amount, currentPrice.currencyCode)
                    : '-'}
                </span>
                {saleActive && compareAtPrice && (
                  <>
                    <span className="font-heading text-xl text-forest/30 line-through">
                      {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                    </span>
                    <span className="text-xs font-medium text-white bg-clay px-2.5 py-0.5 rounded-full">
                      Sale
                    </span>
                  </>
                )}
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <Badge key={badge.label} variant={badge.variant}>
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-divider" />

              {/* Description */}
              {product.descriptionHtml ? (
                <div
                  className="text-forest/60 leading-relaxed text-sm max-w-full overflow-hidden [&_table]:block [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_*]:max-w-full prose-a:text-clay prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : product.description ? (
                <p className="text-forest/60 leading-relaxed text-sm">
                  {product.description}
                </p>
              ) : null}

              {/* Variant Picker */}
              {variants.length > 0 && (
                <VariantPicker
                  variants={variants}
                  selectedOptions={selectedOptions}
                  onChange={handleOptionChange}
                />
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <div className="flex justify-center sm:justify-start">
                  <QuantitySelector quantity={quantity} onChange={setQuantity} />
                </div>
                <Button
                  variant="primary"
                  size="xl"
                  className="flex-1 h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg"
                  disabled={!product.availableForSale || (matchingVariant ? !matchingVariant.availableForSale : false) || addedToCart}
                  onClick={() => {
                    if (!matchingVariant) return;
                    addItem({
                      variantId: matchingVariant.id,
                      title: product.title,
                      handle: product.handle,
                      variantTitle: matchingVariant.title,
                      price: matchingVariant.price,
                      quantity,
                      imageUrl: product.featuredImage?.url ?? product.images?.nodes?.[0]?.url ?? null,
                      imageAlt: product.featuredImage?.altText ?? product.title,
                    });
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 1500);
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {!product.availableForSale
                    ? 'Sold Out'
                    : matchingVariant && !matchingVariant.availableForSale
                      ? 'Unavailable'
                      : addedToCart
                        ? '✓ Added!'
                        : 'Add to Cart'}
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="flex items-center gap-3 rounded-xl bg-cream-dark/30 px-4 py-3">
                  <Truck className="h-4 w-4 text-clay shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-forest">Free Shipping</p>
                    <p className="text-[10px] text-forest/50">On orders over $75</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-cream-dark/30 px-4 py-3">
                  <RotateCcw className="h-4 w-4 text-clay shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-forest">Easy Returns</p>
                    <p className="text-[10px] text-forest/50">30-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-cream-dark/30 px-4 py-3">
                  <Shield className="h-4 w-4 text-clay shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-forest">Secure Checkout</p>
                    <p className="text-[10px] text-forest/50">SSL encrypted</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-cream-dark/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              {...fadeUp}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
            >
              <div>
                <Badge variant="secondary" className="mb-4">
                  You May Also Like
                </Badge>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-forest">
                  Related Products
                </h2>
              </div>
              <Link
                to="/collections/all"
                className="text-forest/60 hover:text-clay text-sm font-medium inline-flex items-center gap-1 transition-colors group shrink-0"
              >
                View All
                <ChevronLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rel: any, i: number) => (
                <motion.a
                  key={rel.id}
                  href={`/products/${rel.handle}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className="group"
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-forest/5 mb-3 relative">
                    {rel.featuredImage ? (
                      <img
                        src={rel.featuredImage.url}
                        alt={rel.featuredImage.altText || rel.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cream-dark/40 to-forest/10 flex items-center justify-center">
                        <span className="font-heading text-forest/15 text-5xl">
                          {rel.title?.[0] || 'P'}
                        </span>
                      </div>
                    )}
                    {!rel.availableForSale && (
                      <span className="absolute top-3 left-3 bg-forest-dark text-cream/70 text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
                        Sold Out
                      </span>
                    )}
                    {rel.tags?.includes('sale') && rel.availableForSale && (
                      <span className="absolute top-3 left-3 bg-clay text-white text-[10px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                  </div>
                  {rel.vendor && (
                    <p className="text-[11px] uppercase tracking-widest text-clay/70 mb-0.5">
                      {rel.vendor}
                    </p>
                  )}
                  <h3 className="font-medium text-forest text-sm line-clamp-2 group-hover:text-clay transition-colors">
                    {rel.title}
                  </h3>
                  <p className="text-forest/60 text-sm mt-1">
                    {formatPrice(rel.priceRange.minVariantPrice.amount, rel.priceRange.minVariantPrice.currencyCode)}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Bottom CTA ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-t from-cream-dark/30 to-cream">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-forest mb-4">
              Complete Your Look
            </h2>
            <p className="text-forest/60 max-w-md mx-auto mb-8 leading-relaxed">
              Explore our full collection of thoughtfully curated pieces designed
              to bring serenity to your everyday.
            </p>
            <Button variant="primary" size="lg" href="/collections/all" className="rounded-full">
              Browse All Products
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
