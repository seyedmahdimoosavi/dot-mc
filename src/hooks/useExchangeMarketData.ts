import { useQuery } from "@tanstack/react-query";

const PRICING_API_BASE_URL = "https://pricing.dotone.online/api";
const ORDER_BOOK_REFETCH_INTERVAL = 120_000;

export interface ExchangeDetails {
  title: string;
  logo: string | null;
  type: string | null;
  minMarketFeeForUSDT: number | null;
  maxMarketFeeForUSDT: number | null;
}

export interface OrderBook {
  exchange: string;
  buy: number | null;
  sell: number | null;
  exchangeDetails: ExchangeDetails;
}

export function usePricingSymbols() {
  return useQuery<string[]>({
    queryKey: ["pricing-symbols"],
    staleTime: 5 * 60_000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(`${PRICING_API_BASE_URL}/symbols`);
      if (!response.ok) throw new Error("Could not load symbols.");
      return response.json() as Promise<string[]>;
    },
  });
}

export function useOrderBooks(symbol: string, pair: string) {
  return useQuery<OrderBook[]>({
    queryKey: ["pricing-orderbooks", symbol, pair],
    enabled: Boolean(symbol && pair),
    staleTime: 30_000,
    refetchInterval: ORDER_BOOK_REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams({ symbol, pair });
      const response = await fetch(
        `${PRICING_API_BASE_URL}/orderbooks?${params}`,
      );
      if (!response.ok) throw new Error("Could not load exchange prices.");
      return response.json() as Promise<OrderBook[]>;
    },
  });
}
