/* ═══════════════════════════════════════════════════════════════
 * Shared Shopify GraphQL response types for Storefront & Customer APIs.
 *
 * These reflect the actual query shapes used in the project.
 * ═══════════════════════════════════════════════════════════════ */

/* ─── Common primitives ─── */

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

/* ─── Storefront API — Product ─── */

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  image?: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  descriptionHtml?: string | null;
  vendor?: string | null;
  productType?: string | null;
  availableForSale: boolean;
  tags: string[];
  totalInventory?: number;
  createdAt?: string;
  updatedAt?: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney | null;
    maxVariantPrice: ShopifyMoney | null;
  } | null;
  featuredImage?: ShopifyImage | null;
  images?: { nodes: ShopifyImage[] } | null;
  variants?: { nodes: ShopifyProductVariant[] } | null;
  collections?: { nodes: Array<{ title: string }> } | null;
}

/* ─── Storefront API — Collection ─── */

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  image?: ShopifyImage | null;
}

export interface ShopifyCollectionWithProducts extends ShopifyCollection {
  products: { nodes: ShopifyProduct[] };
}

/* ─── Storefront API — Cart ─── */

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: Array<{ field: string; message: string }>;
  };
}

/* ─── Storefront API — Page Info (pagination) ─── */

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  endCursor?: string | null;
}

/* ─── Storefront API — Query wrappers ─── */

export interface ProductByHandleResponse {
  productByHandle: ShopifyProduct | null;
}

export interface ProductsListResponse {
  products: {
    nodes: ShopifyProduct[];
    pageInfo?: ShopifyPageInfo;
  };
}

export interface CollectionsListResponse {
  collections: {
    nodes: ShopifyCollection[];
  };
}

export interface CollectionByHandleResponse {
  collection: ShopifyCollectionWithProducts | null;
}

export interface SearchProductsResponse {
  products: {
    nodes: ShopifyProduct[];
    pageInfo?: ShopifyPageInfo;
  };
}

/* ─── Customer Account API ─── */

export interface CustomerEmail {
  emailAddress: string;
}

export interface CustomerPhone {
  phoneNumber: string;
}

export interface CustomerInfo {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: CustomerEmail | null;
  phoneNumber?: CustomerPhone | null;
}

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  number: number;
  processedAt: string;
  totalPrice: ShopifyMoney | null;
  fulfillmentStatus: string;
  financialStatus: string;
  lineItems: {
    nodes: CustomerOrderLineItem[];
  };
}

export interface CustomerAddress {
  id: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  zip?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface CustomerWithOrders {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: CustomerEmail | null;
  orders: { nodes: CustomerOrder[] };
}

export interface CustomerWithAddresses {
  id: string;
  defaultAddress: CustomerAddress | null;
  addresses: { nodes: CustomerAddress[] };
}

/** Generic wrapper for Customer Account API query responses */
export interface CustomerAccountResponse<T> {
  data?: {
    customer: T | null;
  } | null;
}
