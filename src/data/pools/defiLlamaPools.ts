import { DEFILLAMA_POOLS_URL } from "@/config/env";
import type { LifiNetworkConfig } from "@/config/networks";
import { TTL } from "@/config/ttl";
import { BSC_CURATED_TOKENS } from "@/domain/bscTokens";
import type { BscPool, TokenInfo } from "@/domain/types";

import { getCachedLifiTokens } from "../lifi/tokens";
import { getOrFetch } from "./cache";

// DeFiLlama's public yields API (no key, no auth) — used purely as a
// read-only market-data source so the Pools page can show real TVL/APY for
// chains LI.FI already routes swaps to, without us running an indexer for
// someone else's AMM. Not affiliated with LI.FI — LI.FI only gives swap
// quotes, it has no pool-listing API.
//
// Ported from dotoneswap's data/bsc/pancakePools.ts and
// data/pools/lifiNetworkPools.ts, which were two near-identical files because
// each network key got its own server-side cache entry. Here (a browser app)
// the two are merged onto ONE cached download of the full payload: it's a
// ~10MB JSON response, so fetching it once per network per refresh cycle —
// four times over — would be needlessly heavy for a client. The per-network
// filtering itself (chain/project match, both tokens known, sort by TVL,
// cap at 30) is unchanged.
interface DefiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  pool: string;
  underlyingTokens: string[] | null;
}

const MAX_POOLS = 30;

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

/** That network's top-30-by-24h-volume LI.FI token list, keyed by lowercase
 * address — the same vetting list dotoneswap's lifiNetworkPools.ts uses.
 * Returns null when LI.FI can't be reached (see toPools's fallback). */
async function lifiTokenMap(network: LifiNetworkConfig): Promise<Map<string, TokenInfo> | null> {
  try {
    const tokens = await getCachedLifiTokens(network.chain.id);
    return new Map(tokens.map((t) => [t.address.toLowerCase(), t]));
  } catch (error) {
    // LI.FI's API sits behind Cloudflare, which returns 403 for some
    // networks/ASNs (verified: even https://li.quest/v1/chains is blocked
    // from this machine). Without its token list we can't vet against
    // known-liquid tokens, but showing the chain's largest pools is still far
    // better than an empty section — see toPools.
    console.warn(
      `[pools] LI.FI token list unavailable for ${network.label} (${(error as Error)?.message ?? error}); ` +
        "falling back to DeFiLlama's own token fields.",
    );
    return null;
  }
}

/** DeFiLlama names a pool "TOKEN0-TOKEN1" (e.g. "WETH-USDT"); split that into
 * per-side symbols for the fallback path where LI.FI can't supply real token
 * metadata. Decimals are unknown there and default to 18 — harmless, because
 * the pool row only renders symbols (no amount math runs on LI.FI rows). */
function symbolsFromPoolSymbol(symbol: string, index: 0 | 1): string {
  const parts = symbol.split("-");
  const part = parts[index]?.trim();
  return part && part.length > 0 ? part : "?";
}

/** Filters DeFiLlama's index down to `chain`/`project`'s pools, sorted by TVL
 * and capped at 30 copies of the dotoneswap behaviour:
 *
 * - `tokenByAddress` non-null (the normal path): only pools whose BOTH
 *   underlying tokens are in that list survive. DeFiLlama indexes thousands of
 *   low-quality/scam pairs we have no way to vet, so anything we can't name is
 *   dropped.
 * - `tokenByAddress` null (LI.FI unreachable): no vetting is possible, so
 *   token metadata is derived from DeFiLlama's own row instead. */
function toPools(
  all: DefiLlamaPool[],
  chain: string,
  project: string,
  tokenByAddress: Map<string, TokenInfo> | null,
): BscPool[] {
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
  return pools.sort((a, b) => b.tvlUsd - a.tvlUsd).slice(0, MAX_POOLS);
}

/** PancakeSwap's own pools on BNB Chain (config/networks.ts's "bsc" entry) —
 * vetted against the hand-curated domain/bscTokens.ts list. */
export function getBscPancakePools(): Promise<BscPool[]> {
  return getOrFetch("bsc:pancake:pools", TTL.bscPools, async () => {
    const all = await getDefiLlamaPools();
    return toPools(all, "BSC", "pancakeswap-amm", TOKEN_BY_ADDRESS);
  });
}

/** Every other LI.FI-routed network (Ethereum, Polygon, Arbitrum) — vetted
 * against that network's LI.FI token list, exactly like dotoneswap's
 * data/pools/lifiNetworkPools.ts. */
export function getPoolsForNetwork(network: LifiNetworkConfig): Promise<BscPool[]> {
  return getOrFetch(`lifi:pools:${network.id}`, TTL.networkPools, async () => {
    const [all, tokenByAddress] = await Promise.all([getDefiLlamaPools(), lifiTokenMap(network)]);
    const { chain, project } = network.defiLlama;
    return toPools(all, chain, project, tokenByAddress);
  });
}
