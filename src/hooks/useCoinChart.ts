import { useQuery } from "@tanstack/react-query";
import { COIN_API_BASE_URL, pricingRequest } from "@/lib/api";
import { historyToPoints, type HistoryResponse } from "@/lib/pricecatcher";

export type ChartType = "prices" | "total_volumes" | "market_caps";
export type ChartDays = "1d" | "7d" | "30d" | "90d" | "365d";
export interface ChartPoint { timestamp: number; value: number | null }

export function useCoinChart(coin: string | null | undefined, type: ChartType, days: ChartDays) {
  return useQuery<ChartPoint[]>({
    queryKey: ["pricecatcher-history", COIN_API_BASE_URL, coin, type, days],
    enabled: Boolean(coin) && type === "prices",
    staleTime: 60_000, gcTime: 30 * 60_000, refetchInterval: 120_000, retry: false,
    queryFn: async ({ signal }) => {
      const to = Math.floor(Date.now() / 1000);
      const from = to - Number(days.slice(0, -1)) * 86400;
      const interval = days === "1d" ? "5m" : days === "7d" || days === "30d" ? "1h" : "1d";
      const response = await pricingRequest<HistoryResponse>(`/v1/history/${encodeURIComponent(coin!)}`, { from, to, interval, quote: "USD" }, signal);
      return historyToPoints(response);
    },
  });
}
