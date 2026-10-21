export type Address = `0x${string}`;
export interface TokenInfo { address: Address; symbol: string; name?: string; decimals: number; logoUrl?: string; }
export interface Pool { address: Address; token0: TokenInfo; token1: TokenInfo; reserve0: bigint; reserve1: bigint; }
export interface V3PoolInfo { address: Address; token0: TokenInfo; token1: TokenInfo; sqrtPriceX96: bigint; liquidity: bigint; fee: number; }
export interface BscPool { id: string; token0: TokenInfo; token1: TokenInfo; tvlUsd: number; apy: number | null; }
export interface V2PoolSelection { token0: TokenInfo; token1: TokenInfo; nonce: number; }
export interface V3PoolSelection { token0: TokenInfo; token1: TokenInfo; fee: number; nonce: number; }
export interface V3PoolsResponse { pools: V3PoolInfo[]; scanComplete: boolean; }
