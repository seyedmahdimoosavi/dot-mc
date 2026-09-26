## 1. Coverage and asset identity

We need broad coverage of native coins and tokens, including assets on multiple networks and wrapped or bridged versions. For each asset, we need a persistent unique identifier, a stable page identifier, name, ticker symbol, logo, global market-cap rank, category memberships, and the date it was first listed or tracked. Ticker symbols alone are not unique identifiers. Please define what your listing date means.

We also need the supported network or networks and, for tokens, each network's contract address. Native coins may have no contract address. Please explain how you distinguish native, wrapped, bridged, and chain-specific assets and how you avoid duplicates. An English description is needed for the coin detail page; a Persian description, official website, and verified official links are useful if available. The current UI displays a verified badge, so we need an authenticity indicator only if it has a defensible source.

Asset identity must remain consistent across lists, search, detail pages, and users' locally saved watchlists. Please describe how you handle asset renames, removals, network deployments, and changes to page identifiers.

## 2. Global market data: header and landing page

The header statistics bar and landing-page hero need:

- Total number of tracked cryptocurrencies and exchanges.
- Total crypto market capitalization, its change over the previous 24 hours, and total 24-hour trading volume.
- Bitcoin and Ethereum shares of total crypto market capitalization.
- A historical total-market-capitalization series for the most recent **30 days**.
- A network-specific gas-price estimate for the header, including the relevant network, if you cover network gas data.

The landing announcement also refers to the daily market movement. We need to select the display currency (USD initially), the chart period, and the network for a gas estimate. Please state how these aggregate figures are calculated, what markets they cover, and when they are updated.

## 3. Landing-page discovery tabs

The landing page shows **six assets per tab** under Trending, Gainers, Losers, and Recently Added. Each card needs the asset's name, symbol, logo, current USD price, 24-hour percentage change, and recent price trend chart. We need an ordered selection for each tab:

| Tab | Data or selection rule needed |
| --- | --- |
| Trending | A genuine, documented measure of interest or activity and its observation period. Please distinguish searches/views from trading-based popularity. |
| Gainers | Largest positive 24-hour price changes among eligible, sufficiently liquid assets. |
| Losers | Largest negative 24-hour price changes among eligible, sufficiently liquid assets. |
| Recently Added | Most recently listed or tracked assets, ordered by actual listing date. |

We need to select the tab, result count, observation period where relevant, and display currency. Please explain liquidity thresholds, exclusions, stale-price handling, and whether stable coins are eligible. Trending currently uses a volume-to-market-cap approximation in the demo, and Recently Added uses rank as a placeholder; neither represents the intended final data.

## 4. All Cryptocurrencies: categories, search, sorting, and pages

The landing page has an **All Cryptocurrencies** table. Its visible data for each asset is:

- Global rank; name, ticker symbol, logo, and contract address when applicable.
- Current USD price and percentage price changes over **1 hour, 24 hours, and 7 days**.
- Market capitalization, 24-hour trading volume, and circulating supply.
- A **7-day price trend** for the small chart in each row.

The table allows **10, 20, 50, or 100 rows per page**. We need the total matching asset count and access to the complete matching list. Filtering and sorting must work across all matching assets, not only the currently visible page.

Users filter by **All, DeFi, NFT, and Layer 1**. An asset may belong to multiple categories. Please supply maintained category definitions and membership; other available categories, such as stablecoin, meme, exchange token, and smart contracts, are useful. Here NFT means cryptocurrency tokens associated with the NFT sector; individual NFT collections are outside the current table.

Users search by coin name or symbol. The header shows up to **six matches**, each needing a name, symbol, logo, and linkable asset identifier. Searching by network and contract address would be useful. Category, search phrase, sorting, and page size should be usable together.

| Table view | Selection or ordering needed |
| --- | --- |
| Top | Market-cap ranking. |
| Trending | The same documented popularity/activity definition used in discovery, if possible. |
| Gainers & Losers | Largest absolute 24-hour percentage moves, in either direction. |
| Recently Added | Most recent actual listing/tracking dates. |
| Most Visited | Real view or interest ranking with an observation period. If unavailable, we will rename this view to a metric you do provide. |

For the coin list, we therefore need to specify the category, search phrase, desired ordering, page and page size, and display currency. Please confirm which combinations you support. A dataset limited to a few leading coins would not provide accurate filtering, rankings, or pagination.

## 5. Coin detail: identity, price, statistics, and content

Users reach a coin detail page using the asset's page identifier. It needs the same identity and current market data as the table, plus:

- Market-cap rank, categories, supported networks, and the appropriate contract address or addresses for tokens. Each address must be attributable to its network; native coins must be distinguishable from tokens.
- Current USD price and 24-hour percentage change, market capitalization, and 24-hour trading volume.
- Circulating supply, total supply if available, maximum supply or a distinction between unknown and uncapped supply, and fully diluted valuation.
- All-time-high and all-time-low prices, preferably with their dates. The 24-hour high and low are useful additional statistics.
- An accurate coin description or about text, preferably with a source, and any supported authenticity/verification status.
- The time at which prices and statistics were last updated.

To select an asset, we need its stable identifier or page identifier. If your service identifies tokens by contract, the network must also be selectable. We initially need USD prices. Please explain the treatment and calculation of missing supply, valuation, and historical-high/low figures.

### Price chart

The detail page offers **1 hour, 1 day, 1 week, 1 month, 1 year, and all available history**. Each period needs a real historical USD price series with enough observations for a useful chart. We need to select the coin, period, and display currency. Please describe historical coverage, sampling frequency, earliest available date, and limits. The demo currently shows the same generated trend regardless of the selected period.

### Markets tab

For each coin, we need genuine trading markets: **one entry per exchange and trading pair**, rather than the coin's aggregate market statistics. Useful information for each entry includes:

- Exchange or venue name and identity; centralized exchange or DEX classification; venue logo or market link if available.
- Base and quote assets and the trading pair; relevant network and pool for DEX markets.
- Pair price with a USD equivalent, pair-level 24-hour trading volume, and last update time.
- Whether the market is active; liquidity or trust/quality information if available.

We need to select the coin, market type (spot initially, derivatives if offered later), and page/page size when there are many pairs. Please describe exchange and DEX coverage, inactive or duplicate pair treatment, and how pair volume differs from an asset's total volume. The current Markets tab contains only a placeholder row.

## 6. Data quality and provider information requested

Please indicate which requirements you can supply now, which are planned, and which are unavailable. For our assessment, please provide:

- Coverage by asset, network, exchange, and market type; methods for price aggregation, market cap, volume, category assignment, and discovery rankings.
- Typical update intervals and delays for prices, changes, global figures, rankings, markets, and historical charts. A partial live-data integration currently refreshes some coin quotes every **30 seconds**; please indicate whether this cadence is feasible.
- Historical retention, accuracy, availability, and how unavailable or stale data is distinguished from genuine zero values.
- Capacity and usage limits for lists of up to **100 coins with 7-day trends** and coin detail pages, plus pricing.
- Rights to display and cache quotes, charts, descriptions, and logos on a public English/Persian website, including attribution requirements.

Today much of the site uses generated sample data, while a separate address-based service updates some per-coin fields. We seek coherent real data across the sections above. Watchlist membership is saved locally in the user's browser and does not require a provider write service. The exchange directory, spot/derivatives/DEX discovery pages, portfolio, NFT collections, and trading actions are placeholder or future features; please describe and price any related data separately if available.
