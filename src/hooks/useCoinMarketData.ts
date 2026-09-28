import { useQuery } from '@tanstack/react-query';
import { COIN_API_BASE_URL } from '../lib/api';

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

const POLL_INTERVAL = 30_000;

export default function useCoinMarketData(address: string | undefined) {
  return useQuery<CoinMarketData>({
    queryKey: ['coin-market-data', address?.toLowerCase()],
    enabled: Boolean(address),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL,
    gcTime: Infinity,
    placeholderData: (previousData) => previousData,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`${COIN_API_BASE_URL}/coins/${address}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch coin market data for ${address}`);
      }

      return res.json() as Promise<CoinMarketData>;
    },
  });
}
