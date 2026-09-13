import type { Coin } from '@/lib/types';
import useCoinMarketData from './useCoinMarketData';

export function useLiveCoin(coin: Coin): { coin: Coin; isLoading: boolean };
export function useLiveCoin(
  coin: Coin | undefined,
): { coin: Coin | undefined; isLoading: boolean };
export function useLiveCoin(coin: Coin | undefined) {
  const { data, isLoading } = useCoinMarketData(coin?.address);

  if (!coin || !data) {
    return { coin, isLoading };
  }

  const merged: Coin = {
    ...coin,
    name: data.name || coin.name,
    symbol: data.symbol ? data.symbol.toUpperCase() : coin.symbol,
    logo: data.image?.large || coin.logo,
    rank: data.market_cap_rank ?? coin.rank,
    price: data.current_price ?? coin.price,
    change24h: data.price_change_percentage_24h ?? coin.change24h,
    marketCap: data.market_cap ?? coin.price * coin.circulatingSupply,
    volume24h: data.total_volume ?? coin.volume24h,
    circulatingSupply: data.circulating_supply ?? coin.circulatingSupply,
    maxSupply: data.max_supply ?? coin.maxSupply,
    fully_diluted_valuation: data.fully_diluted_valuation ?? coin.fully_diluted_valuation,
    allTimeHigh: data.ath ?? coin.allTimeHigh,
    allTimeLow: data.atl ?? coin.allTimeLow,
  };

  return { coin: merged, isLoading };
}
