import { useQuery } from "@tanstack/react-query";

import { TTL } from "@/config/ttl";
import { getBscPancakePools } from "@/data/pools/defiLlamaPools";

/** PancakeSwap pools on BNB Chain, from DeFiLlama's public yields API
 * (data/pools/defiLlamaPools.ts) — same source the swap app uses, fetched
 * directly in the browser now instead of through `/api/bsc/pools`. */
export function useBscPools() {
  return useQuery({
    queryKey: ["bsc-pools"],
    queryFn: getBscPancakePools,
    staleTime: TTL.bscPools,
    refetchInterval: TTL.bscPools,
  });
}
