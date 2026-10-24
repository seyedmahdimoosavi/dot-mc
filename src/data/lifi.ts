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

// LI.FI's API sits behind Cloudflare, which refuses some networks outright:
// every path (including /v1/chains) answers 403 with an HTML block page and no
// Access-Control-Allow-Origin header, which a browser reports as a CORS error.
// An API key doesn't change that — the refusal happens before the API sees the
// request. Retrying on every poll would only spam the console and the network,
// so after a failure we back off and let callers fall back
// (see data/pools/defiLlamaPools.ts) until the window expires.
const UNAVAILABLE_BACKOFF_MS = 10 * 60_000;
let unavailableUntil = 0;
let warned = false;

/** False while LI.FI is in its post-failure backoff window, so callers can
 * skip the request entirely instead of collecting another rejection. */
export function isLifiAvailable(): boolean {
  return Date.now() >= unavailableUntil;
}

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
  if (!isLifiAvailable()) {
    throw new Error("LI.FI token index is in its post-failure backoff window");
  }
  try {
    const res = await getTokens(lifi, { chains: [chainId], orderBy: "volumeUSD24H", limit });
    unavailableUntil = 0;
    warned = false;
    const tokens = res.tokens[chainId] ?? [];
    return tokens.map((t) => ({
      address: t.address as Address,
      symbol: t.symbol,
      decimals: t.decimals,
      name: t.name,
      logoUrl: t.logoURI ?? undefined,
    }));
  } catch (error) {
    unavailableUntil = Date.now() + UNAVAILABLE_BACKOFF_MS;
    if (!warned) {
      warned = true;
      console.warn(
        `[lifi] token index unreachable (${(error as Error)?.message ?? error}); ` +
          `backing off for ${UNAVAILABLE_BACKOFF_MS / 60_000}min and using DeFiLlama's own token fields to vet pools meanwhile.`,
      );
    }
    throw error;
  }
}
