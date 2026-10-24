# dotmarket

A CoinMarketCap-style cryptocurrency market app built with React, TypeScript, and Vite.

## Features

- **Gold/black theme** driven by the DotOneScan design system and semantic tokens in [`src/styles/theme.css`](src/styles/theme.css) (dark by default, light variant available).
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

## Theme

The interface follows the DotOneScan design system (semantic roles, 4 px spacing,
8 px controls, 1 px dividers, Inter + Poppins) retinted for a **gold/black**
brand. Dark is the default experience; the header toggle switches to the light
variant and the choice is persisted in `localStorage`.

- **Brand gold** `#F5BC27` (light text variant `#8A6516`), canvas `#101112`,
  cards `#17191B`, dividers `rgba(255,255,255,.08)`.
- The design system's blue ramp (`blue.300/400`, `#365C74`, `#2B6CB0`, `#90CDF4`)
  is deliberately **not** used: every accent, link, focus ring and chart line
  resolves to gold. Feedback colours stay semantic (`#38A169` success,
  `#F56565` error).
- Data charts use one series colour (gold), per the system's data-visualisation
  rule; direction is read from the percentage, not from a second hue.
- Persian text keeps IRANYekan; Latin headings use Poppins and body/data uses
  Inter, with Space Grotesk as a local fallback.

Tokens live in [`src/styles/theme.css`](src/styles/theme.css) and are mapped to
Tailwind utilities in [`src/styles/tailwind.css`](src/styles/tailwind.css);
[`src/theme/colors.ts`](src/theme/colors.ts) mirrors them for JS consumers
(coin brand colours). To rebrand, change `--accent`, `--accent-ink`,
`--accent-hover`, `--gold`, `--focus` and `--chart` in both theme blocks — never
hard-code a colour in a component. Components use only semantic classes
(`bg-canvas`, `bg-surface-2`, `text-ink`, `text-muted`, `border-line`,
`text-gold`, `bg-accent`, `text-accent-ink`).

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
