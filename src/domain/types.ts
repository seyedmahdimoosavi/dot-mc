export type Address = `0x${string}`;
export interface TokenInfo { address: Address; symbol: string; name?: string; decimals: number; logoUrl?: string; }
export interface Pool { address: Address; token0: TokenInfo; token1: TokenInfo; reserve0: bigint; reserve1: bigint; totalSupply: bigint; }
export interface V3PoolInfo { address: Address; token0: TokenInfo; token1: TokenInfo; sqrtPriceX96: bigint; liquidity: bigint; fee: number; tick: number; }
/** A read-only pool on a LI.FI-routed chain (BNB Chain, Ethereum, Polygon,
 * Arbitrum), sourced from DeFiLlama's public yields API
 * (data/pools/defiLlamaPools.ts) — market data only, not something this app
 * provides liquidity into. */
export interface BscPool { id: string; symbol: string; token0: TokenInfo; token1: TokenInfo; tvlUsd: number; apy: number | null; }
export interface V2PoolSelection { token0: TokenInfo; token1: TokenInfo; nonce: number; }
export interface V3PoolSelection { token0: TokenInfo; token1: TokenInfo; fee: number; nonce: number; }
export interface V3PoolsResponse { pools: V3PoolInfo[]; scanComplete: boolean; }
