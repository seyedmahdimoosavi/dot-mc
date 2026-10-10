import { useCoinMetadata, useCoinPrice } from './usePricingApi';
import { decimalNumber } from '@/lib/pricecatcher';

export interface CoinMarketData {
  name: string;
  symbol: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number | null;
  total_supply: number | null;
  max_supply: number | null;
  circulating_supply: number | null;
  market_cap: number | null;
  current_price: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  ath: number | null;
  atl: number | null;
  asset_platform_id?: string | null;
  genesis_date?: string | null;
  last_updated?: string | null;
  block_time_in_minutes?: number | null;
  contract_address?: string | null;
  decimal_place?: number | null;
  market_cap_change_24h?: number | null;
  market_cap_change_percentage_24h?: number | null;
  price_change_24h_in_currency?: number | null;
  market_cap_change_24h_in_currency?: number | null;
  ath_date?: string | null;
  atl_date?: string | null;
  links?: {
    homepage?: string[];
    whitepaper?: string | null;
    blockchain_site?: string[];
    official_forum_url?: string[];
    chat_url?: string[];
    announcement_url?: string[];
    snapshot_url?: string | null;
    twitter_screen_name?: string | null;
    facebook_username?: string | null;
    bitcointalk_thread_identifier?: number | null;
    telegram_channel_identifier?: string | null;
    subreddit_url?: string | null;
    repos_url?: { github?: string[]; bitbucket?: string[] };
  };
}

export default function useCoinMarketData(identifier: string | undefined) {
  const priceQuery = useCoinPrice(identifier);
  const metadataQuery = useCoinMetadata(identifier);
  const price = priceQuery.data;
  const metadata = metadataQuery.data;
  const data: CoinMarketData | undefined = price ? {
    name: price.base.name, symbol: price.base.symbol,
    image: { thumb: "", small: "", large: "" },
    market_cap_rank: price.base.rank,
    total_supply: metadata ? decimalNumber(metadata.total_supply) : null,
    max_supply: metadata?.max_supply == null ? null : decimalNumber(metadata.max_supply),
    circulating_supply: metadata ? decimalNumber(metadata.circulating_supply) : null,
    market_cap: decimalNumber(price.market_cap), current_price: decimalNumber(price.price),
    fully_diluted_valuation: null, total_volume: decimalNumber(price.volume_24h),
    high_24h: decimalNumber(price.high_24h), low_24h: decimalNumber(price.low_24h),
    price_change_24h: null, price_change_percentage_24h: price.percent_change["24h"] ?? null,
    ath: metadata ? decimalNumber(metadata.ath) : null,
    atl: metadata ? decimalNumber(metadata.atl) : null,
    last_updated: price.fetched_at,
  } : undefined;
  return { ...priceQuery, data, metadata, priceData: price, isLoading: priceQuery.isLoading, error: priceQuery.error ?? metadataQuery.error };
}
