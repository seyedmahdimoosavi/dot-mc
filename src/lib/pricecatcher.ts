import type { Coin } from "./types";

export type Quote = "USD" | "BTC" | "ETH" | "IRR";
export type MarketSort = "rank" | "name" | "price" | "change_1h" | "change_24h" | "change_7d" | "volume_24h" | "market_cap";
export interface MarketFilters {
  rank_max?: number;
  min_market_cap?: string;
  min_volume_24h?: string;
  min_change_24h?: string;
  max_change_24h?: string;
  stale?: "include" | "only" | "exclude";
  sort?: MarketSort;
  order?: "asc" | "desc";
  page?: number;
  page_size?: number;
  sparkline?: boolean;
  quote?: Quote;
}
export interface BaseCoin { id: number; symbol: string; slug: string; name: string; rank: number | null }
export interface ApiSparkline {
  range_hours: number; interval_seconds: number; start: number;
  prices: (number | null)[]; change_pct?: number | null;
  high?: number | null; low?: number | null; coverage: number; source: string;
}
export interface PriceItem {
  pair: string; base: BaseCoin; quote: Quote; derived: boolean; price: string;
  price_toman?: string | null; unit?: string | null;
  percent_change: Partial<Record<"1h" | "24h" | "7d" | "30d" | "60d" | "90d", number | null>>;
  volume_24h?: string | null; market_cap?: string | null;
  high_24h?: string | null; low_24h?: string | null;
  fetched_at: string; age_seconds: number; stale: boolean;
  sparkline?: ApiSparkline | null; pair_ref?: string;
}
export interface CoinMetadata extends BaseCoin {
  is_active: boolean; circulating_supply: string | null;
  total_supply: string | null; max_supply: string | null;
  ath: string | null; atl: string | null;
  dominance?: number | null; turnover?: number | null; pair_ref?: string;
}
export interface MarketsResponse {
  data: PriceItem[];
  meta: { page: number; page_size: number; total: number; total_pages: number; quote: Quote; generated_at: string };
}
export interface CoinsResponse { data: CoinMetadata[]; meta: { page: number; page_size: number; total: number } }
export interface PriceListResponse {
  data: PriceItem[];
  errors: { pair: string; code: string; message: string }[];
  meta: { requested: number; resolved: number; failed: number };
}
export interface HistoryResponse {
  coin: BaseCoin; quote: Quote; derived: boolean; interval: "5m" | "1h" | "1d";
  interval_seconds: number; from: number; to: number;
  points: { ts: number; price: string }[];
}
export function decimalNumber(value: string | number | null | undefined): number {
  if (value == null || value === "") return NaN;
  const result = Number(value);
  return Number.isFinite(result) ? result : NaN;
}
// Exact decimal strings stay on the API object; convert only for display/charts.
export function priceToCoin(item: PriceItem, metadata?: CoinMetadata): Coin {
  return {
    id: String(item.base.id), rank: item.base.rank ?? NaN,
    name: item.base.name, symbol: item.base.symbol, slug: item.base.slug,
    price: decimalNumber(item.price), change1h: decimalNumber(item.percent_change["1h"]),
    change24h: decimalNumber(item.percent_change["24h"]), change7d: decimalNumber(item.percent_change["7d"]),
    marketCap: decimalNumber(item.market_cap), volume24h: decimalNumber(item.volume_24h),
    circulatingSupply: decimalNumber(metadata?.circulating_supply),
    maxSupply: metadata?.max_supply == null ? null : decimalNumber(metadata.max_supply),
    fully_diluted_valuation: null,
    allTimeHigh: decimalNumber(metadata?.ath), allTimeLow: decimalNumber(metadata?.atl),
    sparkline: item.sparkline?.prices ?? [],
    sparklineTimestamps: item.sparkline?.prices.map((_, index) => (item.sparkline!.start + index * item.sparkline!.interval_seconds) * 1000),
    color: "#718096", logo: `https://s2.coinmarketcap.com/static/img/coins/200x200/${item.base.id}.png`, address: "", categories: [],
    stale: item.stale, fetchedAt: item.fetched_at,
  };
}

export function historyToPoints(response: HistoryResponse): { timestamp: number; value: number | null }[] {
  const step = response.interval_seconds;
  if (!Number.isFinite(step) || step <= 0) throw new Error("Invalid history interval");
  const samples = [...response.points].sort((a, b) => a.ts - b.ts);
  const result: { timestamp: number; value: number | null }[] = [];
  for (const point of samples) {
    const previous = result.at(-1);
    if (previous && point.ts * 1000 - previous.timestamp > step * 1000) {
      result.push({ timestamp: previous.timestamp + step * 1000, value: null });
    }
    const value = decimalNumber(point.price);
    result.push({ timestamp: point.ts * 1000, value: Number.isFinite(value) ? value : null });
  }
  return result;
}
