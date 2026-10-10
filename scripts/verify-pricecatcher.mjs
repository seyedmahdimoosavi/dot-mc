import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { QueryClient } from '@tanstack/react-query';

async function loadTs(path, transform = value => value) {
  const source = transform(await readFile(new URL(path, import.meta.url), 'utf8'));
  const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}
const spec = JSON.parse(await readFile(new URL('../docs/pricecatcher.openapi.json', import.meta.url), 'utf8'));
const { priceToCoin, decimalNumber, historyToPoints } = await loadTs('../src/lib/pricecatcher.ts');
const sample = spec.components.schemas.PriceItem.examples[0];
const coin = priceToCoin(sample);
assert.equal(coin.id, '1');
assert.equal(coin.slug, 'bitcoin');
assert.equal(coin.price, Number(sample.price));
assert.equal(coin.change24h, sample.percent_change['24h']);
assert.equal(coin.sparkline[2], null);
assert.equal(coin.sparklineTimestamps[1], (sample.sparkline.start + sample.sparkline.interval_seconds) * 1000);
assert.ok(Number.isNaN(coin.circulatingSupply));
assert.ok(Number.isNaN(decimalNumber(null)));
assert.ok(Number.isNaN(decimalNumber(undefined)));
assert.equal(decimalNumber('0'), 0);
assert.ok(Number.isNaN(decimalNumber('invalid')));
assert.ok(Number.isNaN(priceToCoin({ ...sample, market_cap: null }).marketCap));
assert.equal(priceToCoin({ ...sample, stale: true }).stale, true);
assert.equal(priceToCoin(sample, { circulating_supply: '19823456.125', max_supply: '21000000', ath: '120000', atl: '0.05' }).circulatingSupply, 19823456.125);
const series = historyToPoints({ interval_seconds: 60, points: [{ ts: 181, price: '4' }, { ts: 61, price: '2' }] });
assert.deepEqual(series, [{ timestamp: 61000, value: 2 }, { timestamp: 121000, value: null }, { timestamp: 181000, value: 4 }]);
assert.deepEqual(historyToPoints({ interval_seconds: 60, points: [] }), []);
assert.throws(() => historyToPoints({ interval_seconds: 0, points: [] }));

const { pricingRequest, PricingApiError } = await loadTs('../src/lib/api.ts', source => source.replaceAll('import.meta.env', '({ VITE_PRICECATCHER_PUBLIC_API_KEY: "browser-test-key" })'));
const originalFetch = globalThis.fetch;
let captured;
try {
  globalThis.fetch = async (url, options) => {
    captured = { url: new URL(url), options };
    return new Response(JSON.stringify({ data: [sample], meta: { page: 2, page_size: 20, total: 42, total_pages: 3, quote: 'USD' } }), { status: 200 });
  };
  const signal = new AbortController().signal;
  const filters = { search: 'Bitcoin & ETH', sort: 'change_24h', order: 'desc', page: 2, page_size: 20, quote: 'USD', sparkline: true, rank_max: undefined };
  const response = await pricingRequest('/v1/markets', filters, signal);
  assert.equal(captured.url.origin, 'https://pricecatcher.dotone.online');
  assert.equal(captured.url.pathname, '/v1/markets');
  assert.equal(captured.url.searchParams.get('search'), filters.search);
  assert.equal(captured.url.searchParams.get('page'), '2');
  assert.equal(captured.url.searchParams.get('sparkline'), 'true');
  assert.equal(captured.url.searchParams.has('rank_max'), false);
  assert.equal(captured.options.signal, signal);
  assert.equal(captured.options.headers['X-API-Key'], 'browser-test-key');
  assert.equal(response.meta.total_pages, 3);
  for (const name of Object.keys(filters)) assert.ok(spec.paths['/v1/markets'].get.parameters.some(parameter => parameter.name === name));

  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const queryKey = ['markets', filters];
  await client.fetchQuery({ queryKey, queryFn: () => pricingRequest('/v1/markets', filters) });
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { code: 'invalid_api_key', message: 'Invalid API key', request_id: 'test-request' } }), { status: 401 });
  await assert.rejects(client.fetchQuery({ queryKey, queryFn: () => pricingRequest('/v1/markets', filters) }), error => error instanceof PricingApiError && error.status === 401 && error.code === 'invalid_api_key' && error.requestId === 'test-request');
  assert.deepEqual(client.getQueryData(queryKey).data, [sample]);
  client.clear();

  globalThis.fetch = async () => new Response(JSON.stringify({ error: { code: 'origin_not_allowed', message: 'Not allowed' } }), { status: 403 });
  await assert.rejects(pricingRequest('/v1/coins/bitcoin'), error => error.status === 403);
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ error: { code: 'rate_limited', message: 'Rate limit exceeded' } }), { status: 429, headers: { 'Retry-After': '30' } });
  };
  await assert.rejects(pricingRequest('/v1/markets'), error => error.status === 429 && error.retryAfter === 30);
  await assert.rejects(pricingRequest('/v1/markets'), error => error.status === 429);
  assert.equal(calls, 1);
} finally {
  globalThis.fetch = originalFetch;
}
console.log('Pricecatcher contract checks passed: mappings, nulls, timestamp/gap handling, request parameters, pagination, authentication, rate limits and retained cached data.');
