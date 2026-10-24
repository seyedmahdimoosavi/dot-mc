import type { Address } from "viem";

import { TTL } from "@/config/ttl";
import type { Pool } from "@/domain/types";

import { publicClient } from "../chain";
import { FACTORY_ABI, PAIR_ABI } from "../contracts/abis";
import { V2_FACTORY } from "../contracts/addresses";
import { resolveTokenMetadata } from "../tokens/metadata";
import { getOrFetch } from "./cache";

interface RawPair {
  address: Address;
  token0: Address;
  token1: Address;
  totalSupply: bigint;
  reserve0: bigint;
  reserve1: bigint;
}

// Ported from dotoneswap's data/v2/pools.ts (itself ported from
// dotone-swap-v3's src/features/v2/Pools.tsx, which was a serial per-pair loop
// with bounded concurrency + retry): every pair's
// token0/token1/totalSupply/getReserves is one multicall regardless of pair
// count. Runs in the browser here, straight against DotOne's public RPC.
async function fetchAllV2Pools(): Promise<Pool[]> {
  const length = await publicClient.readContract({
    address: V2_FACTORY,
    abi: FACTORY_ABI,
    functionName: "allPairsLength",
  });
  const count = Number(length);
  if (count === 0) return [];

  const pairAddrResults = await publicClient.multicall({
    contracts: Array.from(
      { length: count },
      (_, i) => ({ address: V2_FACTORY, abi: FACTORY_ABI, functionName: "allPairs", args: [BigInt(i)] }) as const,
    ),
    allowFailure: true,
  });
  const pairAddresses = pairAddrResults.filter((r) => r.status === "success").map((r) => r.result as Address);
  if (pairAddresses.length === 0) return [];

  const pairResults = await publicClient.multicall({
    contracts: pairAddresses.flatMap((address) => [
      { address, abi: PAIR_ABI, functionName: "token0" } as const,
      { address, abi: PAIR_ABI, functionName: "token1" } as const,
      { address, abi: PAIR_ABI, functionName: "totalSupply" } as const,
      { address, abi: PAIR_ABI, functionName: "getReserves" } as const,
    ]),
    allowFailure: true,
  });

  const allTokenAddresses: Address[] = [];
  const rawPairs: RawPair[] = [];
  pairAddresses.forEach((address, i) => {
    const [t0R, t1R, tsR, resR] = pairResults.slice(i * 4, i * 4 + 4);
    if (t0R.status !== "success" || t1R.status !== "success" || tsR.status !== "success" || resR.status !== "success") {
      return;
    }
    const totalSupply = tsR.result as bigint;
    if (totalSupply === 0n) return; // matches old app: skip pairs with no liquidity ever minted
    const token0 = t0R.result as Address;
    const token1 = t1R.result as Address;
    const [reserve0, reserve1] = resR.result as readonly [bigint, bigint, number];
    allTokenAddresses.push(token0, token1);
    rawPairs.push({ address, token0, token1, totalSupply, reserve0, reserve1 });
  });

  const tokenInfo = await resolveTokenMetadata(allTokenAddresses);

  const pools: Pool[] = [];
  for (const p of rawPairs) {
    const token0 = tokenInfo.get(p.token0.toLowerCase());
    const token1 = tokenInfo.get(p.token1.toLowerCase());
    if (!token0 || !token1) continue;
    pools.push({
      address: p.address,
      token0,
      token1,
      reserve0: p.reserve0,
      reserve1: p.reserve1,
      totalSupply: p.totalSupply,
    });
  }
  return pools;
}

export function getAllV2Pools(): Promise<Pool[]> {
  return getOrFetch("v2:pools", TTL.v2Pools, fetchAllV2Pools);
}
