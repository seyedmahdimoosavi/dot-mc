import { useQuery } from '@tanstack/react-query';

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
}

const API_BASE = 'https://coin-prices-lyart.vercel.app/api/coins';
const POLL_INTERVAL = 30_000;

export default function useCoinMarketData(address: string | undefined) {
  return useQuery<CoinMarketData>({
    queryKey: ['coin-market-data', address?.toLowerCase()],
    enabled: Boolean(address),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/${address}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch coin market data for ${address}`);
      }

      return res.json() as Promise<CoinMarketData>;
    },
  });
}
