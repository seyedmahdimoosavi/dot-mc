// Per-resource cache TTLs (ms), used by both data/cache.ts server-side and
// matched 1:1 by each hooks/useX React Query staleTime client-side.
export const TTL = {
  v2Pools: 30_000,
  v2Reserves: 8_000,
  v3Quote: 5_000,
  v3Pools: 60_000,
  v3Positions: 15_000,
  v3LiquidityDistribution: 30_000,
  tokens: 5 * 60_000,
  transactions: 15_000,
  bscPools: 5 * 60_000,
  networkPools: 5 * 60_000,
} as const;
