import { DEFILLAMA_POOLS_URL } from "@/config/env";
import type { LifiNetworkConfig } from "@/config/networks";
import { TTL } from "@/config/ttl";
import { BSC_CURATED_TOKENS } from "@/domain/bscTokens";
import type { BscPool, TokenInfo } from "@/domain/types";

import { getOrFetch } from "./cache";

// DeFiLlama's public yields API (no key, no auth) — the only market-data
// source behind the read-only pool rows for LI.FI-routed chains. Ported from
// dotoneswap's data/bsc/pancakePools.ts and data/pools/lifiNetworkPools.ts,
// merged onto ONE cached download of the full payload: it's a ~10MB JSON
// response, so fetching it once per network per refresh cycle — four times
// over — would be needlessly heavy for a client.
//
// The swap app additionally vets these rows against LI.FI's token index
// (@lifi/sdk's getTokens, https://li.quest/v1/tokens). That call is gone from
// this app: it is blocked from the browser on some networks (Cloudflare 403
// with no CORS headers — an API key doesn't change it), the rows render fine
// from DeFiLlama alone, and it dragged a whole SDK into the bundle for what is
// only a quality filter. What's left of that intent is the dead-pool guard
// below.
interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  pool: string;
  underlyingTokens: string[] | null;
  volumeUsd1d?: number | null;
}

// No cap and no volume threshold on purpose. The swap app slices each network
// to its 30 largest pools after filtering them against LI.FI's token index, so
// any pool it happens to omit simply doesn't exist as far as its UI is
// concerned. Here every pool DeFiLlama lists for the chain/project (with a
// non-zero TVL) is returned, sorted by TVL; the table paginates client-side.
//
// A volume cutoff was tried as a replacement for that vetting and removed: it
// hid legitimate low-turnover pools (a UNI/WETH pool with $4.1M TVL and
// $138/day) while a wash-traded scam pool can easily clear any threshold. Only
// a token allowlist actually filters those, and DeFiLlama can't provide one.

const TOKEN_BY_ADDRESS = new Map(BSC_CURATED_TOKENS.map((t) => [t.address.toLowerCase(), t]));

/** One shared, TTL-cached copy of DeFiLlama's full pool index. */
function getDefiLlamaPools(): Promise<DefiLlamaPool[]> {
  return getOrFetch("defillama:pools:all", TTL.bscPools, async () => {
    const res = await fetch(DEFILLAMA_POOLS_URL);
    if (!res.ok) throw new Error(`DeFiLlama pools request failed (${res.status})`);
    const json = (await res.json()) as { data: DefiLlamaPool[] };
    return json.data;
  });
}

/** DeFiLlama names a pool "TOKEN0-TOKEN1" (e.g. "WETH-USDT"); split that into
 * per-side symbols. Decimals aren't published per token, so they default to
 * 18 — harmless here, because these rows only render symbols and no amount
 * math runs on them. */
function symbolsFromPoolSymbol(symbol: string, index: 0 | 1): string {
  const parts = symbol.split("-");
  const part = parts[index]?.trim();
  return part && part.length > 0 ? part : "?";
}

interface PoolFilter {
  chain: string;
  project: string;
  /** When provided (BNB Chain's hand-curated list), only pools whose BOTH
   * underlying tokens are in it survive, and its metadata is used verbatim.
   * Otherwise token metadata is derived from DeFiLlama's own row. */
  tokenByAddress?: Map<string, TokenInfo>;
}

function toPools(all: DefiLlamaPool[], { chain, project, tokenByAddress }: PoolFilter): BscPool[] {
  const pools: BscPool[] = [];
  for (const p of all) {
    if (p.chain !== chain || p.project !== project || !p.tvlUsd) continue;

    const [addr0, addr1] = p.underlyingTokens ?? [];
    let token0: TokenInfo | undefined;
    let token1: TokenInfo | undefined;
    if (tokenByAddress) {
      token0 = addr0 ? tokenByAddress.get(addr0.toLowerCase()) : undefined;
      token1 = addr1 ? tokenByAddress.get(addr1.toLowerCase()) : undefined;
    } else if (addr0 && addr1) {
      const symbol0 = symbolsFromPoolSymbol(p.symbol, 0);
      const symbol1 = symbolsFromPoolSymbol(p.symbol, 1);
      token0 = { address: addr0 as TokenInfo["address"], symbol: symbol0, decimals: 18, name: symbol0 };
      token1 = { address: addr1 as TokenInfo["address"], symbol: symbol1, decimals: 18, name: symbol1 };
    }
    if (!token0 || !token1) continue;

    pools.push({ id: p.pool, symbol: p.symbol, tvlUsd: p.tvlUsd, apy: p.apy, token0, token1 });
  }
  return pools.sort((a, b) => b.tvlUsd - a.tvlUsd);
}

/** PancakeSwap's own pools on BNB Chain (config/networks.ts's "bsc" entry) —
 * vetted against the hand-curated domain/bscTokens.ts list, as in the swap
 * app. */
export function getBscPancakePools(): Promise<BscPool[]> {
  return getOrFetch("bsc:pancake:pools", TTL.bscPools, async () => {
    const all = await getDefiLlamaPools();
    return toPools(all, { chain: "BSC", project: "pancakeswap-amm", tokenByAddress: TOKEN_BY_ADDRESS });
  });
}

/** Every other LI.FI-routed network (Ethereum, Polygon, Arbitrum) — raw
 * DeFiLlama rows, largest first. */
export function getPoolsForNetwork(network: LifiNetworkConfig): Promise<BscPool[]> {
  return getOrFetch(`lifi:pools:${network.id}`, TTL.networkPools, async () => {
    const all = await getDefiLlamaPools();
    const { chain, project } = network.defiLlama;
    return toPools(all, { chain, project });
  });
}
