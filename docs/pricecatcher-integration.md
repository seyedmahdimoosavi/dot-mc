Pricecatcher integration

1. Configuration

The default base URL is https://pricecatcher.dotone.online. Set VITE_PRICECATCHER_API_BASE_URL in .env.local to override it, including for a server proxy. This is the root URL, without /v1 or /api at the end.

All consumer endpoints require X-API-Key. VITE_PRICECATCHER_PUBLIC_API_KEY is supported for a browser-public consumer key restricted by the operator to the intended origins. Vite variables are visible to users; private consumer keys and all admin keys must stay on a backend proxy. No key was provided with the specification, so authenticated live verification is pending. Direct browser requests also require CORS approval for the application origin and X-API-Key header. Restart Vite after changing environment variables.

The supplied contract is preserved in pricecatcher.openapi.json.

2. Endpoint mapping

| Section | Method and path | Request | Data used |
| --- | --- | --- | --- |
| Coin table | GET /v1/markets | search, rank_max, min_market_cap, min_volume_24h, min_change_24h, max_change_24h, stale, sort, order, page, page_size, quote, sparkline=true | Identity, rank, price, percentage changes, market cap, volume, sparkline, freshness and pagination |
| Row supply | GET /v1/coins/{CMC id} | None | circulating_supply; cached for ten minutes |
| Coin count | GET /v1/coins | page=1, page_size=1 | meta.total |
| Header search | GET /v1/coins | search, page=1, page_size=6 | Metadata and canonical slug for links |
| Gainers / losers | GET /v1/markets | sort=change_24h, order=desc/asc, page_size=6, quote=USD | Live cards with prices and sparklines |
| Hero / BTC stats | GET /v1/prices/bitcoin | quote=USD, sparkline=true | BTC market cap, 24h change, volume, seven-day price chart |
| Coin detail pricing | GET /v1/prices/{slug} | quote=USD, sparkline=true | Price, percentage change, volume, market cap, 24h high/low, updated timestamp |
| Coin detail metadata | GET /v1/coins/{slug} | None | Supply, ATH, ATL, dominance and turnover |
| Coin history | GET /v1/history/{slug} | from/to Unix seconds, interval, quote=USD | Timestamped price chart |
| Coin quote prices | GET /v1/pairs | pairs=id:{CMC id}/USD,id:{CMC id}/BTC,id:{CMC id}/ETH,id:{CMC id}/IRR; sparkline=false | Quote-specific prices, toman equivalent when returned, per-pair errors |

Canonical CMC IDs and API slugs replace local seed identifiers. Market prices are requested once for the whole page. Circulating supply is not in MarketItem, so its column currently needs one cached metadata request per displayed coin. Adding circulating_supply to MarketItem would remove these requests.

3. Filtering and pagination

Search is debounced. Search, filters, sorting and pagination operate on the server. Pagination uses meta.total_pages. Supported sort fields are rank, name, price, change_1h, change_24h, change_7d, volume_24h and market_cap; both directions are supported. Rank, minimum market cap, minimum volume, minimum/maximum 24h change and freshness filters are exposed in advanced filters.

USD, BTC, ETH and IRR are supported. IRR only permits search, rank_max and sorting by rank/name/price. Changing to IRR clears unsupported filters and disables unsupported choices. IRR values are labelled as rial, never silently treated as USD or toman.

4. Charts, numbers and freshness

Decimal strings remain unchanged in the cached API response. Conversion to JavaScript numbers occurs at the display/chart boundary; financial arithmetic using exact decimals is not implemented. Sparkline point timestamps are (start + index * interval_seconds) * 1000 in the chart. Null sparkline prices remain gaps. History timestamps use ts * 1000, retain their actual timestamps and introduce gaps for missing intervals. No forward filling or synthetic history is used.

| Range | Interval |
| --- | --- |
| 1 day | 5m |
| 7 days | 1h |
| 30 days | 1h |
| 90 days | 1d |
| 365 days | 1d |

Historical availability and maximum ranges depend on server configuration. Empty data and unavailable ranges are shown as empty/error states.

Price/list/history queries refresh every two minutes. Metadata and coin catalog requests cache for ten minutes without periodic polling. A failed refresh retains successful data for that exact query; prices from a different symbol, quote or filter are not substituted. stale is displayed using a notice or row tooltip. fetched_at is used for the detail update timestamp.

401, 403 and 429 have distinct bilingual messages. The API error code, request ID and status are preserved. Retry-After temporarily suppresses additional requests to the new API. Requests support cancellation. The existing exchange-order-book polling and Bitbank row are unchanged.

5. Contract gaps

| Required feature | Contract limitation | Current behavior |
| --- | --- | --- |
| Logos | No logo field | Existing CoinMarketCap image convention is derived from CMC ID; letter fallback if the image fails |
| Contract address/network/categories | No fields | No fabricated address/category data; unavailable detail fields |
| Trending / recently added / most visited | No matching metric, timestamp or endpoint | Unsupported choices are disabled/omitted; rank is not represented as recency and volume is not represented as visits |
| Volume / market-cap history | History only returns price | These chart modes are disabled |
| Description and external links | Not returned | Existing unavailable states |
| ATH/ATL dates, FDV, market-cap changes, absolute price changes | Not returned | Unavailable; no estimated substitutes |
| Individual exchange order books | Pairs are aggregated rates, not exchange prices | Existing pricing.dotone.online exchange API remains separate |
| Market-wide totals | No global summary endpoint | Existing BTC-specific stats remain BTC-specific; no fabricated global total |

The contract supports the implemented consumer data, but it does not supply all fields used by the original page design. Backend additions are needed to populate the unavailable features above.

6. Verification

Run node scripts/verify-pricecatcher.mjs to check the supplied examples, mapping, null handling, chart timestamps/gaps, requests, pagination, API errors, Retry-After and cached data retention with a failed refresh. Also run npx tsc --noEmit -p tsconfig.app.json, npm run lint and npm run build. Live authenticated and browser-origin verification requires a valid consumer key or configured proxy.
