import { useQuery } from "@tanstack/react-query";
import type { V3PoolsResponse } from "@/domain/types";
import { apiGet, reviveBigInts } from "./api";
export function useV3Pools() {
  return useQuery({ queryKey: ["v3-pools"], queryFn: async () => {
    const result = await apiGet<{ pools: unknown[]; scanComplete?: boolean }>("/api/v3/pools");
    return { ...result, pools: reviveBigInts(result.pools) } as V3PoolsResponse;
  }, refetchInterval: (query) => query.state.data?.scanComplete === false ? 5_000 : 30_000 });
}
