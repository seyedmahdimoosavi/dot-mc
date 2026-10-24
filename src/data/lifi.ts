import { createClient, getTokens } from "@lifi/sdk";
import type { Address } from "viem";

import { arbitrumChain, bscChain, mainnetChain, polygonChain } from "@/config/chain";
import {
  ARBITRUM_RPC_URL,
  BSC_RPC_URL,
  ETH_RPC_URL,
  LIFI_API_KEY,
  LIFI_INTEGRATOR,
  POLYGON_RPC_URL,
} from "@/config/env";
import type { TokenInfo } from "@/domain/types";

// Pseudo-address convention every major DEX aggregator (LI.FI, 0x, 1inch)
// uses for a chain's native coin (BNB, ETH, MATIC, …) instead of an ERC-20
// address — same convention on every EVM chain LI.FI supports.
export const NATIVE_TOKEN_ADDRESS: Address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

// One shared client for every LI.FI-routed chain (BNB Chain, Ethereum,
// Polygon, Arbitrum — see config/networks.ts) — getTokens takes the target
// chain per call, so a single client with all four RPC overrides registered
// is all that's needed. Ported from dotoneswap's data/lifi.ts; it runs in the
// browser here, which LI.FI's API allows (CORS-enabled).
const lifi = createClient({
  integrator: LIFI_INTEGRATOR,
  apiKey: LIFI_API_KEY,
  rpcUrls: {
    [bscChain.id]: [BSC_RPC_URL],
    [mainnetChain.id]: [ETH_RPC_URL],
    [polygonChain.id]: [POLYGON_RPC_URL],
    [arbitrumChain.id]: [ARBITRUM_RPC_URL],
  },
});

/**
 * Top tokens by real 24h trading volume on `chainId`, straight from LI.FI's
 * own token index — used instead of a hand-typed address list for every
 * LI.FI network, so there's no risk of a mistyped mainnet contract address.
 * Ordered by volume rather than `marketCapUSD`: verified live against LI.FI's
 * public API — market-cap ordering surfaces scam tokens with a
 * manipulated/self-reported price (e.g. one priced at $1.5e14) at the very
 * top, since market cap is just price × supply and either side can be faked;
 * 24h volume reflects real trades LI.FI's own liquidity sources observed,
 * which is far harder to fake. Callers should cache this (see
 * data/lifi/tokens.ts) since it's one HTTP call per chain.
 */
export async function getLifiTokens(chainId: number, limit = 30): Promise<TokenInfo[]> {
  const res = await getTokens(lifi, { chains: [chainId], orderBy: "volumeUSD24H", limit });
  const tokens = res.tokens[chainId] ?? [];
  return tokens.map((t) => ({
    address: t.address as Address,
    symbol: t.symbol,
    decimals: t.decimals,
    name: t.name,
    logoUrl: t.logoURI ?? undefined,
  }));
}
