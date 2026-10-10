import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { COIN_API_BASE_URL, pricingRequest } from "@/lib/api";
import type { CoinMetadata, CoinsResponse, MarketFilters, MarketsResponse, PriceItem, PriceListResponse } from "@/lib/pricecatcher";

const options = { staleTime: 30_000, gcTime: 30 * 60_000, refetchInterval: 120_000, retry: false } as const;
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]);
  return debounced;
}
export function useMarkets(filters: MarketFilters = {}, enabled = true) {
  return useQuery({ ...options,
    queryKey: ["pricecatcher-markets", COIN_API_BASE_URL, filters], enabled,
    queryFn: ({ signal }) => pricingRequest<MarketsResponse>("/v1/markets", { ...filters, quote: filters.quote ?? "USD", sparkline: filters.sparkline ?? true }, signal),
  });
}
export function useCoinPrice(coin?: string) {
  return useQuery({ ...options,
    queryKey: ["pricecatcher-price", COIN_API_BASE_URL, coin], enabled: Boolean(coin),
    queryFn: ({ signal }) => pricingRequest<PriceItem>(`/v1/prices/${encodeURIComponent(coin!)}`, { quote: "USD", sparkline: true }, signal),
  });
}
export function useCoinMetadata(coin?: string) {
  return useQuery({ ...options, staleTime: 10 * 60_000, refetchInterval: false,
    queryKey: ["pricecatcher-metadata", COIN_API_BASE_URL, coin], enabled: Boolean(coin),
    queryFn: ({ signal }) => pricingRequest<CoinMetadata>(`/v1/coins/${encodeURIComponent(coin!)}`, {}, signal),
  });
}
export function useCoins(search = "", page = 1, pageSize = 1, enabled = true) {
  return useQuery({ ...options, staleTime: 10 * 60_000, refetchInterval: false,
    queryKey: ["pricecatcher-coins", COIN_API_BASE_URL, search, page, pageSize], enabled,
    queryFn: ({ signal }) => pricingRequest<CoinsResponse>("/v1/coins", { search, page, page_size: pageSize }, signal),
  });
}

export function usePairs(pairs: string[], enabled = true) {
  return useQuery({ ...options,
    queryKey: ["pricecatcher-pairs", COIN_API_BASE_URL, pairs], enabled: enabled && pairs.length > 0,
    queryFn: ({ signal }) => pricingRequest<PriceListResponse>("/v1/pairs", { pairs: pairs.join(","), sparkline: false }, signal),
  });
}
