import type { Address } from "viem";

import { CURATED_TOKENS } from "@/domain/tokens";
import type { TokenInfo } from "@/domain/types";

import { publicClient } from "../chain";
import { ERC20_ABI } from "../contracts/abis";

const curatedByAddress = new Map<string, TokenInfo>(CURATED_TOKENS.map((t) => [t.address.toLowerCase(), t]));

/**
 * Resolves symbol/decimals/name for a set of token addresses in ONE
 * multicall batch — curated overrides (domain/tokens.ts) take precedence
 * over on-chain reads. Ported from dotoneswap's data/tokens/metadata.ts,
 * mirroring dotone-swap-v3's unknown-token batching pattern already proven in
 * its V3Pools.tsx/V3Positions.tsx.
 *
 * Known simplification vs. the old app: tokens whose symbol()/name() return
 * bytes32 instead of string (hand-rolled test tokens) aren't retried with a
 * bytes32 ABI here — they fall through to the "Unknown" placeholder. The
 * escape hatch is the same one the old app uses for this exact case: add a
 * CURATED_TOKENS entry.
 */
export async function resolveTokenMetadata(addresses: Address[]): Promise<Map<string, TokenInfo>> {
  const result = new Map<string, TokenInfo>();
  const toFetch: Address[] = [];
  // Dedup against every address seen so far, not just the ones already in
  // `result` (which — before the multicall runs below — only holds curated
  // entries) — otherwise the same non-curated address repeated across many
  // callers' inputs piles up as duplicate entries in `toFetch`, ballooning
  // the multicall batch well past what it needs to be.
  const seen = new Set<string>();

  for (const addr of addresses) {
    const key = addr.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const curated = curatedByAddress.get(key);
    if (curated) {
      result.set(key, curated);
    } else {
      toFetch.push(addr);
    }
  }
  if (toFetch.length === 0) return result;

  const contracts = toFetch.flatMap((address) => [
    { address, abi: ERC20_ABI, functionName: "symbol" } as const,
    { address, abi: ERC20_ABI, functionName: "decimals" } as const,
    { address, abi: ERC20_ABI, functionName: "name" } as const,
  ]);
  const results = await publicClient.multicall({ contracts, allowFailure: true });

  toFetch.forEach((address, i) => {
    const [symbolR, decimalsR, nameR] = results.slice(i * 3, i * 3 + 3);
    const key = address.toLowerCase();
    if (symbolR.status === "success" && decimalsR.status === "success") {
      const symbol = symbolR.result as string;
      result.set(key, {
        address,
        symbol,
        decimals: decimalsR.result as number,
        name: nameR.status === "success" ? (nameR.result as string) : symbol,
      });
    } else {
      result.set(key, { address, symbol: `${address.slice(0, 6)}…`, decimals: 18, name: "Unknown" });
    }
  });
  return result;
}
