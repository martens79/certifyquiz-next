// Test-only Sanity stub for the loopback SEO fixture; never load with production env.
if (process.env.API_BASE_URL !== 'http://127.0.0.1:8468/api' || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'e2edummy') {
  throw new Error('SEO_404_TEST_ISOLATION_REQUIRED');
}
const originalFetch = globalThis.fetch;
globalThis.fetch = function(input, init) {
  const value = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(value);
  if (['e2edummy.api.sanity.io', 'e2edummy.apicdn.sanity.io'].includes(url.hostname)) {
    return Promise.resolve(new Response(JSON.stringify({ result: [] }), { status: 200, headers: { 'content-type': 'application/json' } }));
  }
  return originalFetch.call(this, input, init);
};
