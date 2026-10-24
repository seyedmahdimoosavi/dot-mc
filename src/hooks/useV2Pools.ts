import { useQuery } from "@tanstack/react-query";

import { TTL } from "@/config/ttl";
import { getAllV2Pools } from "@/data/pools/v2Pools";

/** V2 pairs registered in DotOne's own factory (data/pools/v2Pools.ts) —
 * read straight from the chain in the browser now, instead of through the old
 * `/api/v2/pools` fetch. */
export function useV2Pools() {
  return useQuery({
    queryKey: ["v2-pools"],
    queryFn: getAllV2Pools,
    staleTime: TTL.v2Pools,
    refetchInterval: TTL.v2Pools,
  });
}
