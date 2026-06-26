import { useState } from 'react';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { useCart } from '~/lib/cart-context';
import type { CartItem } from '~/lib/cart-context';

interface ProductImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
  id?: string;
}

interface ProductPrice {
  amount: string;
  currencyCode?: string;
}

interface Product {
  title: string;
  vendor?: string | null;
  price?: string | number | ProductPrice;
  compareAtPrice?: string | number | ProductPrice | null;
  images?: ProductImage[];
  featuredImage?: ProductImage | null;
  tags?: string[];
  handle?: string;
  available?: boolean;
  id?: string;
  variantId?: string | null;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

function formatPrice(
  price: string | number | ProductPrice | undefined,
): string {
  if (price == null) return '';
  if (typeof price === 'object' && 'amount' in price) {
    const num = parseFloat(price.amount);
    return `$${num.toFixed(2)}`;
  }
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `$${(num as number).toFixed(2)}`;
}

function parsePrice(price: string | number | ProductPrice | undefined): number {
  if (price == null) return 0;
  if (typeof price === 'object' && 'amount' in price) {
    return parseFloat(price.amount);
  }
  return typeof price === 'string' ? parseFloat(price) : (price as number);
}

function getFeaturedImage(product: Product): ProductImage | null {
  return product.featuredImage ?? product.images?.[0] ?? null;
}

function isOnSale(product: Product): boolean {
  if (!product.compareAtPrice) return false;
  const current = parsePrice(product.price);
  const compare = parsePrice(product.compareAtPrice);
  return compare > current && compare > 0;
}

function getBadges(product: Product): Array<{ label: string; className: string }> {
  const tags = product.tags ?? [];
  const badges: Array<{ label: string; className: string }> = [];

  if (isOnSale(product) || tags.includes('sale') || tags.includes('Sale')) {
    badges.push({ label: 'Sale', className: 'bg-clay text-white' });
  }

  if (tags.includes('new') || tags.includes('New') || tags.includes('new-arrival')) {
    badges.push({ label: 'New', className: 'bg-forest text-white' });
  }

  if (!product.available || tags.includes('sold-out') || tags.includes('Sold Out')) {
    badges.push({ label: 'Sold Out', className: 'bg-forest-dark text-white/80' });
  }

  return badges;
}

function toCartPrice(price: string | number | ProductPrice | undefined): CartItem['price'] {
  if (price == null) return { amount: '0.00', currencyCode: 'USD' };
  if (typeof price === 'object' && 'amount' in price) {
    return { amount: price.amount, currencyCode: price.currencyCode ?? 'USD' };
  }
  const amount = (typeof price === 'string' ? parseFloat(price) : (price as number)).toFixed(2);
  return { amount, currencyCode: 'USD' };
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const image = getFeaturedImage(product);
  const currentPrice = formatPrice(product.price);
  const comparePrice = product.compareAtPrice ? formatPrice(product.compareAtPrice) : null;
  const saleActive = isOnSale(product);
  const badges = getBadges(product);

  const handleAddToCart = () => {
    if (!product.available) return;
    const vid = product.variantId || product.id;
    if (!vid) return;
    addItem({
      variantId: vid,
      productId: product.id ?? '',
      title: product.title,
      handle: product.handle ?? '',
      variantTitle: 'Default Title',
      price: toCartPrice(product.price),
      quantity: 1,
      imageUrl: image?.url ?? null,
      imageAlt: image?.altText ?? product.title,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <div
      className="group/card relative animate-fade-in-up"
      style={{ animationDelay: `${(index % 12) * 60}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-cream-dark/30">
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
            loading={index < 4 ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-forest/30">
            <span className="text-sm">No image</span>
          </div>
        )}

        <a
          href={product.handle ? `/products/${product.handle}` : '#'}
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover/card:opacity-100"
          onClick={(e) => {
            if (!product.handle) e.preventDefault();
          }}
        >
          <span className="translate-y-2 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 px-5 py-2 rounded-full bg-white/90 text-forest text-sm font-medium backdrop-blur-sm">
            Quick View
          </span>
        </a>

        {badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={cn(
                  'inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-xs',
                  badge.className,
                )}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((prev) => !prev)}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover/card:opacity-100 z-10',
            wishlisted
              ? 'bg-white/90 text-red-500'
              : 'bg-white/70 text-forest/60 hover:bg-white/90 hover:text-red-400',
          )}
        >
          <Heart
            className={cn('h-4 w-4 transition-transform', wishlisted && 'scale-110 fill-current')}
          />
        </button>
      </div>

      <div className="mt-3 space-y-1 px-0.5">
        {product.vendor && (
          <p className="text-[11px] uppercase tracking-widest text-clay/70">
            {product.vendor}
          </p>
        )}

        <h3 className="font-heading text-base font-semibold leading-tight text-forest line-clamp-2">
          {product.handle ? (
            <a href={`/products/${product.handle}`} className="hover:underline decoration-clay/30 underline-offset-2">
              {product.title}
            </a>
          ) : (
            product.title
          )}
        </h3>

        <div className="flex items-center gap-2">
          {saleActive && comparePrice ? (
            <>
              <span className="text-sm font-medium text-clay">{currentPrice}</span>
              <span className="text-sm text-forest/40 line-through">{comparePrice}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-forest">{currentPrice}</span>
          )}
        </div>
      </div>

      <div className="mt-3 translate-y-1 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
        <Button
          variant="primary"
          size="sm"
          className="w-full bg-clay text-white hover:bg-clay-dark"
          disabled={!product.available || addedToCart}
          onClick={handleAddToCart}
        >
          {addedToCart ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : product.available ? (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          ) : (
            'Sold Out'
          )}
        </Button>
      </div>
    </div>
  );
}
