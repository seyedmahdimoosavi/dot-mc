import { TTL } from "@/config/ttl";
import type { TokenInfo } from "@/domain/types";

import { getOrFetch } from "../pools/cache";
import { getLifiTokens } from "../lifi";

/** Cached wrapper around data/lifi.ts's getLifiTokens — one LI.FI API call
 * per chain per TTL window, shared by every caller (the pool-listing filter
 * in data/pools/defiLlamaPools.ts, and any future swap token picker) instead
 * of each hitting LI.FI directly. Ported from dotoneswap's
 * data/lifi/tokens.ts. */
export function getCachedLifiTokens(chainId: number): Promise<TokenInfo[]> {
  return getOrFetch(`lifi:tokens:${chainId}`, TTL.lifiTokens, () => getLifiTokens(chainId));
}
