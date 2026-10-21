import { useQuery } from "@tanstack/react-query";
import type { Pool } from "@/domain/types";
import { apiGet, reviveBigInts } from "./api";
export function useV2Pools() {
  return useQuery({ queryKey: ["v2-pools"], queryFn: async () => {
    const result = await apiGet<{ pools: unknown[] }>("/api/v2/pools");
    return reviveBigInts(result.pools) as Pool[];
  }, refetchInterval: 30_000 });
}
