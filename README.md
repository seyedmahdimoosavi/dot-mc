# dotmarket

A CoinMarketCap-style cryptocurrency market app built with React, TypeScript, and Vite.

## Features

- **Light/dark theme** using design tokens in [`src/theme/colors.ts`](src/theme/colors.ts), aligned with the dotscan.one brand palette.
- **English / Persian (RTL)** localization via [`src/i18n`](src/i18n).
- **Landing page** with header mega-menus, a global market stats bar, a market-cap hero chart, a trending/gainers/losers panel, a filterable and paginated coin table, and a CoinMarketCap-style footer — all backed by generated mock data ([`src/lib/mockCoins.ts`](src/lib/mockCoins.ts)).
- **Coin detail page** at `/currencies/:slug` with a price chart, range tabs, key stats, and overview/markets/about tabs.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build      # type-check and produce a production build
npm run lint        # run ESLint
```

## Market data server

Coin details and historical charts use the base URL configured in `src/lib/api.ts`. To override it for a local Express server, copy `.env.example` to `.env.local` and set `VITE_COIN_API_BASE_URL` to the server's base URL **including `/api`**, for example `http://127.0.0.1:3000/api`. Restart the Vite dev server after editing the environment file. The local server must allow requests from the Vite app's origin (typically `http://127.0.0.1:5173`).

The detail chart requests `/charts/:address/:type/:days` for `prices`, `total_volumes`, or `market_caps`. The UI keeps ranges as `1d`, `7d`, `30d`, `90d`, and `365d`, but sends `1`, `7`, `30`, `90`, or `365` in the URL. It accepts a series of `[timestampInMilliseconds, value]` pairs (or `{ timestamp, value }` points), either as the response itself or under the selected type's key. An empty array shows an empty state.

Charts use the address from the coin list (the lookup address), which can differ from the contract address returned by coin details. Nonempty chart results are retained in the React Query cache for the current session by address, type, and range. Empty results can be retried on a later visit. The chart request bypasses the browser HTTP cache so a conditional `304` response does not leave the chart without a response body.

## Project structure

```
src/
  theme/        # color tokens + ThemeProvider (light/dark)
  i18n/         # translations + I18nProvider (en/fa, RTL)
  lib/          # mock data, formatting, shared types, watchlist state
  components/   # layout (header/footer/stats bar) and market UI
  pages/        # MarketPage (landing) and CoinDetailPage
```
