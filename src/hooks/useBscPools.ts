import { useQuery } from "@tanstack/react-query";
import type { BscPool } from "@/domain/types";
import { apiGet } from "./api";
export function useBscPools() {
  return useQuery({ queryKey: ["bsc-pools"], queryFn: async () => (await apiGet<{ pools: BscPool[] }>("/api/bsc/pools")).pools, staleTime: 60_000, refetchInterval: 60_000 });
}
