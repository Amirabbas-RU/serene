import type {LoaderFunctionArgs} from 'react-router';
import {useLoaderData} from 'react-router';

export async function loader({}: LoaderFunctionArgs) {
  const results: Record<string, any> = {};

  // Check process.env
  results.processEnv = {
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN ? '✓ set' : '✗ not set',
  };

  // Test storefront API
  try {
    const {getStorefrontClient} = await import('~/lib/storefront');
    const client = getStorefrontClient();
    const result = await client.query(`{ products(first: 2) { nodes { id title vendor } } }`);
    results.apiTest = {
      success: true,
      products: result?.products?.nodes ?? [],
    };
  } catch (e: any) {
    results.apiTest = {
      success: false,
      error: e?.message ?? String(e),
    };
  }

  return results;
}

export default function DebugEnv() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">🔍 Environment Debug</h1>
        {Object.entries(data).map(([section, values]) => (
          <div key={section} className="mb-6 bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold text-cyan-400 mb-3">{section}</h2>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
