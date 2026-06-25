import type {LoaderFunctionArgs} from 'react-router';
import {useLoaderData, Link} from 'react-router';
import {getStorefrontClient} from '~/lib/storefront';

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts {
    products(first: 20, sortKey: TITLE) {
      nodes {
        id
        title
        handle
        description
        vendor
        productType
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
        totalInventory
        availableForSale
        tags
        createdAt
        updatedAt
      }
    }
  }
`;

export async function loader({}: LoaderFunctionArgs) {
  const storefront = getStorefrontClient();

  let data, error;
  try {
    data = await storefront.query(ALL_PRODUCTS_QUERY);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error querying Storefront API';
  }

  return {
    success: !error,
    error,
    products: data?.products?.nodes ?? [],
    storeDomain: process.env.PUBLIC_STORE_DOMAIN ?? 'mock.shop',
  };
}

export default function DebugProducts() {
  const data = useLoaderData<typeof loader>();
  const products = data.products;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            🛠️ Storefront API Debug
          </h1>
          <p className="text-gray-400 text-sm">
            Store: <code className="text-cyan-400">{data.storeDomain}</code>
            {' | '}
            Status:{' '}
            <span className={data.success ? 'text-green-400' : 'text-red-400'}>
              {data.success ? '✓ Connected' : '✗ Error'}
            </span>
            {' | '}
            Products returned: <strong>{products.length}</strong>
          </p>
          {data.error && (
            <pre className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm overflow-auto">
              {data.error}
            </pre>
          )}
          <Link
            to="/"
            className="inline-block mt-4 text-sm text-cyan-400 hover:text-cyan-300 underline"
          >
            ← Back to storefront
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid gap-6">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="flex gap-6 bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                {/* Image */}
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                  {product.featuredImage ? (
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      No image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white truncate">
                        {product.title}
                      </h2>
                      {product.vendor && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          by {product.vendor}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-green-400">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: product.priceRange.minVariantPrice.currencyCode,
                        }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                      </p>
                      {product.compareAtPriceRange?.minVariantPrice?.amount &&
                        parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
                          parseFloat(product.priceRange.minVariantPrice.amount) && (
                          <p className="text-xs text-gray-500 line-through">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: product.compareAtPriceRange.minVariantPrice.currencyCode,
                            }).format(
                              parseFloat(product.compareAtPriceRange.minVariantPrice.amount),
                            )}
                          </p>
                        )}
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {product.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta info row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                    <span>Type: {product.productType || '—'}</span>
                    <span>
                      Inventory:{' '}
                      <span
                        className={
                          product.totalInventory > 0
                            ? 'text-green-500'
                            : product.availableForSale
                              ? 'text-yellow-500'
                              : 'text-red-500'
                        }
                      >
                        {product.totalInventory > 0
                          ? product.totalInventory
                          : product.availableForSale
                            ? 'Tracking off'
                            : 'Out of stock'}
                      </span>
                    </span>
                    <span>ID: {product.id.split('/').pop()}</span>
                    <a
                      href={`/products/${product.handle}`}
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      View → /products/{product.handle}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            {data.success
              ? 'No products found in store.'
              : 'Could not fetch products — check the error above.'}
          </div>
        )}

        {/* Raw data */}
        <details className="mt-12">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-300">
            Show raw JSON data
          </summary>
          <pre className="mt-4 p-4 bg-gray-900 rounded-lg text-xs text-gray-400 overflow-auto max-h-96 border border-gray-800">
            {JSON.stringify(data.products, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
