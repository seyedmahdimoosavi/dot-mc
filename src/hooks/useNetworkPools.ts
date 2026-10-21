import { useQuery } from "@tanstack/react-query";
import type { BscPool } from "@/domain/types";
import { apiGet } from "./api";
export type ExternalPoolNetwork = "ethereum" | "polygon" | "arbitrum";
export function useNetworkPools(network: ExternalPoolNetwork) {
  return useQuery({ queryKey: ["network-pools", network], queryFn: async () => (await apiGet<{ pools: BscPool[] }>(`/api/pools/${network}`)).pools, staleTime: 60_000, refetchInterval: 60_000 });
}
