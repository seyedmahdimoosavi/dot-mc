import { useQuery } from "@tanstack/react-query";
import { COIN_API_BASE_URL } from "../lib/api";

export type ChartType = "prices" | "total_volumes" | "market_caps";
export type ChartDays = "1d" | "7d" | "30d" | "90d" | "365d";

export interface ChartPoint {
  timestamp: number;
  value: number;
}

function parseChart(data: unknown, type: ChartType): ChartPoint[] {
  const series = Array.isArray(data)
    ? data
    : data && typeof data === "object" && type in data
      ? (data as Record<ChartType, unknown>)[type]
      : null;

  if (!Array.isArray(series)) throw new Error("Unexpected chart data format");

  const points = series.flatMap((point): ChartPoint[] => {
    const timestamp = Array.isArray(point) ? point[0] : point?.timestamp;
    const value = Array.isArray(point) ? point[1] : point?.value;
    return typeof timestamp === "number" && Number.isFinite(timestamp) &&
      typeof value === "number" && Number.isFinite(value)
      ? [{ timestamp, value }]
      : [];
  });

  if (series.length > 0 && points.length === 0) {
    throw new Error("Unexpected chart point format");
  }
  return points.sort((a, b) => a.timestamp - b.timestamp);
}

export function useCoinChart(
  address: string | null | undefined,
  type: ChartType,
  days: ChartDays,
) {
  return useQuery<ChartPoint[]>({
    queryKey: ["coin-chart", COIN_API_BASE_URL, address?.toLowerCase(), type, days],
    enabled: Boolean(address),
    // Keep populated series for the session; an empty cache response can be retried.
    staleTime: (query) => query.state.data?.length ? Infinity : 0,
    gcTime: Infinity,
    retry: false,
    queryFn: async ({ signal }) => {
      const url = `${COIN_API_BASE_URL}/charts/${encodeURIComponent(address!.toLowerCase())}/${type}/${days.slice(0, -1)}`;
      const response = await fetch(url, { signal, cache: "no-store" });
      if (!response.ok) throw new Error(`Chart request failed (${response.status})`);
      return parseChart(await response.json(), type);
    },
  });
}
