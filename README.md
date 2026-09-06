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

## Project structure

```
src/
  theme/        # color tokens + ThemeProvider (light/dark)
  i18n/         # translations + I18nProvider (en/fa, RTL)
  lib/          # mock data, formatting, shared types, watchlist state
  components/   # layout (header/footer/stats bar) and market UI
  pages/        # MarketPage (landing) and CoinDetailPage
```
