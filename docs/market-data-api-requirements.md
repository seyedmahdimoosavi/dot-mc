# DotMarket API Contract

## 1. StatsBar

Method: GET  
Path: /market/stats

This endpoint provides the compact global market summary at the top of the page. The reference asset in this section is DOTO.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| referenceSymbol | query | string | No | DOTO | DOTO |
| quote | query | string | No | USD | USD |
| feePair | query | string | No | USDT, TMN | USDT |

Response:

~~~json
{
  "data": {
    "cryptoCount": 12548,
    "exchangeCount": 178,
    "marketCap": 145200000,
    "marketCapChange24h": 3.81,
    "volume24h": 8240000,
    "fee": {
      "min": 0.03,
      "max": 0.35,
      "pair": "USDT"
    },
    "referenceAsset": {
      "id": "doto",
      "slug": "dotone",
      "name": "DotOne",
      "symbol": "DOTO",
      "price": 0.1452
    },
    "updatedAt": "2026-09-28T10:15:30.000Z",
    "dataStatus": "live",
    "staleAfterSeconds": 120
  }
}
~~~

Field requirements:

| Field | Unit | Type | Precision | Notes |
| --- | --- | --- | --- | --- |
| cryptoCount | count | integer | 0 | Total tracked assets. |
| exchangeCount | count | integer | 0 | Total supported active exchanges. |
| marketCap | USD | number or null | 2 decimal places | DOTO market capitalization. |
| marketCapChange24h | percent | number or null | 4 decimal places | DOTO 24-hour market-cap or price change. |
| volume24h | USD | number or null | 2 decimal places | DOTO 24-hour trading volume. |
| fee.min, fee.max | percent | number or null | 4 decimal places | Minimum and maximum DOTO trading fee for the requested pair. |
| updatedAt | UTC timestamp | string | milliseconds | Time at which the data was last updated. |

If any numeric value is unavailable, return null. If the last available value is older than staleAfterSeconds, return it with dataStatus set to stale.

## 2. Hero

Method: GET  
Path: /market/hero

This endpoint provides the DOTO information and historical market-cap chart displayed in the Hero section.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| symbol | query | string | No | DOTO | DOTO |
| quote | query | string | No | USD | USD |
| range | query | string | No | 30d | 30d |

Response:

~~~json
{
  "data": {
    "asset": {
      "id": "doto",
      "slug": "dotone",
      "name": "DotOne",
      "symbol": "DOTO",
      "logo": "/assets/doto.png",
      "price": 0.1452,
      "change24h": 3.81,
      "marketCap": 145200000,
      "volume24h": 8240000,
      "updatedAt": "2026-09-28T10:15:30.000Z",
      "dataStatus": "live",
      "staleAfterSeconds": 120
    },
    "chart": {
      "type": "prices",
      "range": "30d",
      "quote": "USD",
      "points": [
        {
          "timestamp": 1756512000000,
          "value": 129700000
        },
        {
          "timestamp": 1759017600000,
          "value": 145200000
        }
      ],
      "updatedAt": "2026-09-28T10:15:30.000Z",
      "dataStatus": "live",
      "staleAfterSeconds": 3600
    }
  }
}
~~~

Hero chart rules:

| Field | Requirement |
| --- | --- |
| type | prices |
| range | 30d |
| quote | USD |
| timestamp | Unix time in milliseconds, ascending order |
| value | DOTO market-cap value in USD |
| minimum points | At least 2 when data is available |

If historical data is unavailable, return an empty points array and chart.dataStatus as unavailable. Do not return synthetic or zero-valued points.

## 3. TrendingPanel

Method: GET  
Path: /market/discovery

This endpoint provides the six cards (minimum) shown in each discovery tab: Trending, Gainers, Losers, and Recently Added.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| tab | query | string | Yes | trending, gainers, losers, recentlyAdded | — |
| quote | query | string | No | USD | USD |
| limit | query | integer | No | 1 to 100 | 6 |

Response:

~~~json
{
  "data": [
    {
      "id": "doto",
      "rank": 1,
      "name": "DotOne",
      "symbol": "DOTO",
      "slug": "dotone",
      "price": 0.1452,
      "change24h": 3.81,
      "marketCap": 145200000,
      "volume24h": 8240000,
      "sparkline": [0.121, 0.124, 0.119, 0.131, 0.138, 0.1452],
      "color": "#365C74",
      "logo": "/assets/doto.png",
      "address": "0x0000000000000000000000000000000000000000",
      "categories": ["defi", "layer1"],
      "updatedAt": "2026-09-28T10:15:30.000Z",
      "dataStatus": "live",
      "staleAfterSeconds": 120
    }
  ]
}
~~~

The returned array must be ordered according to the requested tab:

| tab | Required order |
| --- | --- |
| trending | Provider trending/activity ranking, highest first. |
| gainers | Highest positive 24-hour percentage change first. |
| losers | Lowest negative 24-hour percentage change first. |
| recentlyAdded | Most recent listing/tracking date first. |

The same category filter used on the cryptocurrency page must be accepted for this endpoint.

## 4. All Cryptocurrencies

Method: GET  
Path: /assets

This is the complete data source for the cryptocurrency table. Each returned item must contain all data needed for one table row. No per-row API request is required after this response.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| category | query | string | No | all, defi, nft, layer1 | all |
| search | query | string | No | Coin name or symbol | null |
| sort | query | string | No | top, trending, gainersLosers, recentlyAdded, mostVisited | top |
| page | query | integer | No | 1 or greater | 1 |
| pageSize | query | integer | No | 10, 20, 50, 100 | 20 |
| quote | query | string | No | USD/TMN | USD |

Response:

~~~json
{
  "data": [
    {
      "id": "doto",
      "rank": 125,
      "name": "DotOne",
      "symbol": "DOTO",
      "slug": "dotone",
      "price": 0.1452,
      "change1h": 0.42,
      "change24h": 3.81,
      "change7d": 12.64,
      "marketCap": 145200000,
      "volume24h": 8240000,
      "circulatingSupply": 1000000000,
      "maxSupply": 2000000000,
      "fully_diluted_valuation": 290400000,
      "allTimeHigh": 0.64,
      "allTimeLow": 0.031,
      "sparkline": [0.121, 0.124, 0.119, 0.131, 0.138, 0.1452],
      "color": "#365C74",
      "logo": "/assets/doto.png",
      "address": "0x0000000000000000000000000000000000000000",
      "categories": ["defi", "layer1"],
      "listedAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-09-28T10:15:30.000Z",
      "dataStatus": "live",
      "staleAfterSeconds": 120
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 12548,
    "totalPages": 628
  }
}
~~~

Each asset item has the following role in the table:

| Field | Table use | Unit / precision |
| --- | --- | --- |
| rank | Rank column | Integer |
| name, symbol, logo, address | Coin identity column | Symbol is uppercase; address may be null only for native coins |
| slug | Link to coin-detail page | Stable URL-safe identifier |
| price | Price column | USD, up to 12 fractional digits |
| change1h, change24h, change7d | Percentage change columns | Percent, up to 4 fractional digits |
| marketCap | Market Cap column | USD, up to 2 fractional digits |
| volume24h | Volume 24h column | USD, up to 2 fractional digits |
| circulatingSupply | Circulating Supply column | Token units, up to 8 fractional digits |
| sparkline | Last 7 Days chart | Numeric price values, oldest to newest |
| categories | Category filters | Lowercase canonical values |
| listedAt | Recently Added ordering | ISO 8601 UTC timestamp |

List behavior:

- category, search, and sort are applied before pagination.
- search matches name and symbol case-insensitively.
- top is market-cap order, highest first.
- trending uses the provider trending/activity ranking.
- gainersLosers orders by absolute change24h, highest first.
- recentlyAdded orders by listedAt, newest first.
- mostVisited uses a provider visit/interest ranking.
- Numeric values that are not available must be null. A valid zero stays zero.
- sparkline must be an empty array when history is unavailable, never an array of zero placeholders.

## 4.1 Header asset search

Method: GET  
Path: /assets/search

This endpoint provides compact asset results for the global search field.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| q | query | string | Yes | Minimum 1 character | — |
| limit | query | integer | No | 1 to 20 | 6 |

Response:

~~~json
{
  "data": [
    {
      "id": "doto",
      "slug": "dotone",
      "name": "DotOne",
      "symbol": "DOTO",
      "logo": "/assets/doto.png",
      "rank": 125
    }
  ]
}
~~~

Search matches asset name and symbol case-insensitively. Results are ordered by the provider relevance score, then by market-cap rank.

## 5. Exchanges

## 5.1 Supported symbols

Method: GET  
Path: /symbols

This endpoint provides the asset selector in the Exchanges section.

Request parameters: none.

Response:

~~~json
{
  "data": ["ETH", "BTC", "DOTO", "USDT", "BNB", "USDC", "DOGE"],
  "updatedAt": "2026-09-28T10:15:30.000Z",
  "dataStatus": "live",
  "staleAfterSeconds": 300
}
~~~

Each symbol must be uppercase, canonical, and unique. The selected market base is excluded by the client from this list.

## 5.2 Exchange price comparison

Method: GET  
Path: /orderbooks

This endpoint provides every row of the exchange comparison table for the selected symbol and market base.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| symbol | query | string | Yes | Any symbol returned by /symbols | — |
| pair | query | string | Yes | USDT, TMN | — |

Response:

~~~json
{
  "data": [
    {
      "exchange": "example-exchange",
      "buy": 84882.03,
      "sell": 84865,
      "updatedAt": "2026-09-28T10:15:30.000Z",
      "isBestSell": true,
      "isOld": false,
      "exchangeDetails": {
        "id": 36,
        "title": "نام صرافی",
        "logo": "/assets/example-exchange.png",
        "type": "P2P and OTC",
        "minMarketFeeForUSDT": 0.03,
        "maxMarketFeeForUSDT": 0.35,
        "minMarketFeeForTMN": 0.03,
        "maxMarketFeeForTMN": 0.35,
        "isActive": true
      },
      "dataStatus": "live",
      "staleAfterSeconds": 120
    }
  ]
}
~~~

Field requirements:

| Field | Table use | Unit / precision |
| --- | --- | --- |
| exchange | English exchange name | String |
| exchangeDetails.title | Persian exchange name | String |
| exchangeDetails.logo | Exchange logo | Relative image path |
| exchangeDetails.type | Exchange type | String |
| minMarketFeeForUSDT, maxMarketFeeForUSDT | USDT fee columns | Percent, up to 4 fractional digits |
| minMarketFeeForTMN, maxMarketFeeForTMN | TMN fee columns | Percent, up to 4 fractional digits |
| buy, sell | Buy and sell columns | Selected pair currency; up to 12 fractional digits |
| updatedAt, isOld | Freshness display | UTC timestamp and boolean |
| exchangeDetails.isActive | Exchange availability | Boolean |

Rules:

- buy and sell are null when an active price cannot be provided.
- Fee fields for the selected pair must be populated when available; otherwise return null.
- isOld is true when updatedAt is older than staleAfterSeconds.
- An unsupported symbol or pair returns 422 UNSUPPORTED_MARKET.
- A supported market with no exchange results returns an empty data array.

## 6. Coin Detail

## 6.1 Coin information and live market data

Method: GET  
Path: /coins/{address}

This endpoint provides all identity, pricing, statistics, supply, network, and link data shown on the coin-detail page.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| address | path | string | Yes | Asset lookup address | — |
| quote | query | string | No | USD | USD |
| language | query | string | No | en, fa | en |

Response:

~~~json
{
  "name": "DotOne",
  "symbol": "DOTO",
  "image": {
    "thumb": "/assets/doto-thumb.png",
    "small": "/assets/doto-small.png",
    "large": "/assets/doto.png"
  },
  "market_cap_rank": 125,
  "total_supply": 1500000000,
  "max_supply": 2000000000,
  "circulating_supply": 1000000000,
  "market_cap": 145200000,
  "current_price": 0.1452,
  "fully_diluted_valuation": 290400000,
  "total_volume": 8240000,
  "high_24h": 0.1481,
  "low_24h": 0.1374,
  "price_change_24h": 0.0053,
  "price_change_percentage_24h": 3.81,
  "price_change_24h_in_currency": 0.0053,
  "market_cap_change_24h": 5320000,
  "market_cap_change_24h_in_currency": 5320000,
  "market_cap_change_percentage_24h": 3.81,
  "ath": 0.64,
  "ath_date": "2026-05-09T08:00:00.000Z",
  "atl": 0.031,
  "atl_date": "2026-01-16T10:00:00.000Z",
  "asset_platform_id": "ethereum",
  "contract_address": "0x0000000000000000000000000000000000000000",
  "decimal_place": 18,
  "genesis_date": null,
  "block_time_in_minutes": null,
  "last_updated": "2026-09-28T10:15:30.000Z",
  "verified": true,
  "categories": ["defi", "layer1"],
  "description": {
    "en": "DotOne is a digital asset used in the DotOne ecosystem.",
    "fa": "دات‌وان یک دارایی دیجیتال در اکوسیستم دات‌وان است."
  },
  "links": {
    "homepage": ["https://dotone.example"],
    "whitepaper": "https://dotone.example/whitepaper",
    "blockchain_site": ["https://etherscan.io"],
    "official_forum_url": [],
    "chat_url": ["https://t.me/dotone"],
    "announcement_url": [],
    "snapshot_url": null,
    "twitter_screen_name": "dotone",
    "facebook_username": null,
    "telegram_channel_identifier": "dotone",
    "subreddit_url": null,
    "bitcointalk_thread_identifier": null,
    "repos_url": {
      "github": ["https://github.com/dotone"],
      "bitbucket": []
    }
  },
  "dataStatus": "live",
  "staleAfterSeconds": 120
}
~~~

Detail data requirements:

| Group | Required fields |
| --- | --- |
| Identity | name, symbol, image, verified, categories |
| Current market data | current_price, price_change_24h, price_change_percentage_24h, market_cap_rank, market_cap, total_volume |
| 24-hour statistics | high_24h, low_24h, market_cap_change_24h, market_cap_change_percentage_24h |
| Supply and valuation | circulating_supply, total_supply, max_supply, fully_diluted_valuation |
| Historical extremes | ath, ath_date, atl, atl_date |
| Technical data | asset_platform_id, contract_address, decimal_place, genesis_date, block_time_in_minutes |
| Descriptions and links | description and links |
| Freshness | last_updated, dataStatus, staleAfterSeconds |

All unavailable scalar values must be null. Unavailable link groups must be empty arrays or null, according to the example shape.

## 6.2 Coin charts

Method: GET  
Path: /charts/{address}/{type}/{days}

This endpoint provides the selected historical chart for a coin.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| address | path | string | Yes | Asset lookup address | — |
| type | path | string | Yes | prices, market_caps, total_volumes | — |
| days | path | integer | Yes | 1, 7, 30, 90, 365 | — |
| quote | query | string | No | USD | USD |

Response:

~~~json
[
  [1759017600000, 0.121],
  [1759021200000, 0.123],
  [1759024800000, 0.1452]
]
~~~

Chart requirements:

| days | Maximum point interval | Required use |
| --- | --- | --- |
| 1 | 5 minutes | One-day chart |
| 7 | 1 hour | Seven-day chart |
| 30 | 4 hours | Thirty-day chart |
| 90 | 12 hours | Ninety-day chart |
| 365 | 1 day | One-year chart |

| Array item | Meaning |
| --- | --- |
| First item | Unix timestamp in milliseconds |
| Second item | Numeric value for the requested type and quote |

Rules:

- Values are ordered from oldest to newest.
- prices values use USD price precision of up to 12 fractional digits.
- market_caps and total_volumes values use USD precision of up to 2 fractional digits.
- If there is no history for the selected type/range, return an empty array.
- Never use zero as a replacement for a missing chart point.

## 6.3 Coin Markets

Method: GET  
Path: /coins/{address}/markets

This endpoint provides exchange and pair data for the Markets tab on the coin-detail page.

Request parameters:

| Parameter | Location | Type | Required | Allowed values | Default |
| --- | --- | --- | --- | --- | --- |
| address | path | string | Yes | Asset lookup address | — |
| marketType | query | string | No | spot, derivatives, dex | spot |
| quote | query | string | No | Any supported quote symbol | null |
| search | query | string | No | Exchange name or pair | null |
| page | query | integer | No | 1 or greater | 1 |
| pageSize | query | integer | No | 10, 20, 50, 100 | 20 |

Response:

~~~json
{
  "data": [
    {
      "exchange": {
        "id": "example-exchange",
        "name": "Example Exchange",
        "localizedName": "نام صرافی",
        "logo": "/assets/example-exchange.png",
        "type": "spot",
        "marketUrl": "https://example-exchange.com",
        "isActive": true
      },
      "base": {
        "id": "doto",
        "symbol": "DOTO"
      },
      "quote": {
        "symbol": "USDT"
      },
      "pair": "DOTO/USDT",
      "marketType": "spot",
      "price": 0.1452,
      "priceUsd": 0.1452,
      "volume24h": 127500,
      "liquidityScore": 82.4,
      "updatedAt": "2026-09-28T10:15:30.000Z",
      "dataStatus": "live",
      "staleAfterSeconds": 120
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 18,
    "totalPages": 1
  }
}
~~~

Rules:

- One item represents one exchange and one trading pair.
- Pair price is in the quote currency. priceUsd is always USD.
- DEX markets must include network and pool identifiers when applicable.
- Inactive markets have exchange.isActive set to false and unavailable numeric values set to null.
- search matches exchange name, localized name, and pair.

## 7. Error response

All non-success responses use this format:

~~~json
{
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "No asset was found for the requested address.",
    "details": {
      "address": "0x0000000000000000000000000000000000000000"
    },
    "requestId": "req_01J8M6H2X4"
  }
}
~~~

| HTTP status | Error code | Usage |
| --- | --- | --- |
| 400 | INVALID_REQUEST | Missing or invalid request parameter. |
| 404 | ASSET_NOT_FOUND | Asset, address, or slug does not exist. |
| 404 | MARKET_NOT_FOUND | Requested market or chart does not exist. |
| 422 | UNSUPPORTED_MARKET | Symbol, pair, quote, chart type, or range is not supported. |
| 429 | RATE_LIMITED | Request limit exceeded. |
| 500 | INTERNAL_ERROR | Unexpected server error. |
| 503 | DATA_PROVIDER_UNAVAILABLE | Upstream data source is unavailable. |

## 8. Endpoint summary

| Page or feature | Method | Path |
| --- | --- | --- |
| StatsBar | GET | /market/stats |
| Hero | GET | /market/hero |
| Trending, Gainers, Losers, Recently Added | GET | /market/discovery |
| All Cryptocurrencies table | GET | /assets |
| Header asset search | GET | /assets/search |
| Exchange currency selector | GET | /symbols |
| Exchange comparison table | GET | /orderbooks |
| Coin detail | GET | /coins/{address} |
| Coin price, market-cap, and volume charts | GET | /charts/{address}/{type}/{days} |
| Coin Markets tab | GET | /coins/{address}/markets |
