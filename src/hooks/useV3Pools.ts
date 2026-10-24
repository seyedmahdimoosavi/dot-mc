import { useQuery } from "@tanstack/react-query";

import { TTL } from "@/config/ttl";
import { getAllV3Pools } from "@/data/pools/v3Pools";
import type { V3PoolsResponse } from "@/domain/types";

/** V3 pools discovered on DotOne chain by the checkpointed factory-log scan
 * (data/pools/v3Pools.ts) — called directly in the browser now, instead of
 * through the old `/api/v3/pools` fetch. */
export function useV3Pools() {
  return useQuery<V3PoolsResponse>({
    queryKey: ["v3-pools"],
    queryFn: getAllV3Pools,
    staleTime: TTL.v3Pools,
    // While the pool-discovery checkpoint hasn't caught up yet, keep polling
    // so the list fills in without the user manually refreshing — see
    // data/pools/v3Pools.ts's checkpointed scan.
    refetchInterval: (query) => (query.state.data?.scanComplete ? TTL.v3Pools : 5_000),
  });
}
