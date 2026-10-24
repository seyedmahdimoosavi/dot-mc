import { useQuery } from "@tanstack/react-query";

import { getLifiNetwork } from "@/config/networks";
import { TTL } from "@/config/ttl";
import { getPoolsForNetwork } from "@/data/pools/defiLlamaPools";

/** Read-only pool listing (TVL/APY) for a LI.FI network other than BNB Chain
 * (which keeps its own dedicated hooks/useBscPools.ts) — Ethereum, Polygon,
 * Arbitrum. Sourced from DeFiLlama's public yields API
 * (data/pools/defiLlamaPools.ts), fetched directly in the browser now instead
 * of through `/api/pools/[network]`. */
export type ExternalPoolNetwork = "ethereum" | "polygon" | "arbitrum";

export function useNetworkPools(network: ExternalPoolNetwork) {
  return useQuery({
    queryKey: ["network-pools", network],
    queryFn: () => {
      const config = getLifiNetwork(network);
      if (!config) throw new Error(`Unknown LI.FI network: ${network}`);
      return getPoolsForNetwork(config);
    },
    staleTime: TTL.networkPools,
    refetchInterval: TTL.networkPools,
  });
}
