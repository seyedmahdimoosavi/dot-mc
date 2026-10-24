import type { Address } from "viem";

import { CHAIN_ID } from "@/config/env";
import { TTL } from "@/config/ttl";
import { V3_POOL_SEED, V3_POOL_SEED_BLOCK } from "@/config/v3PoolSeed";
import type { V3PoolInfo } from "@/domain/types";

import { publicClient } from "../chain";
import { V3_FACTORY } from "../contracts/addresses";
import { V3_FACTORY_ABI, V3_POOL_ABI } from "../contracts/abis";
import { resolveTokenMetadata } from "../tokens/metadata";
import { getOrFetch, peekCache, setCache } from "./cache";

interface V3PoolCreatedInfo {
  pool: Address;
  token0: Address;
  token1: Address;
  fee: number;
}

interface ScanCheckpoint {
  lastScannedBlock: bigint;
  pools: V3PoolCreatedInfo[];
}

const CHECKPOINT_KEY = "v3:pools:checkpoint";
// This RPC caps eth_getLogs at a 30,000-block range per call (verified
// directly against rpc.dotone.online — anything larger is rejected outright
// with ErrGetLogsExceededMaxAllowedRange; 25,000 and 50,000 were both tried
// while porting this). 25,000 leaves headroom under that cap.
const CHUNK_SIZE = 25_000n;
const MIN_CHUNK_SIZE = 500n;
// Backoff floor/ceiling once a chunk fails (e.g. after viem's own internal
// HTTP retries are exhausted) — grows with consecutive failures so repeated
// rate-limiting spaces requests out further instead of retrying at the same
// pace that just got rate-limited, and resets to CHUNK_DELAY_MS on the next
// success.
const MAX_CHUNK_DELAY_MS = 10_000;
let consecutiveFailures = 0;
// Wall-clock budget per invocation — a from-scratch scan of the factory's
// full ~14M-block history can need hundreds of chunks and would never finish
// inside one request/paint. Instead of blocking the UI for minutes, each call
// advances the scan by whatever fits in this budget and returns what has been
// found so far: the list grows across a few successive requests (the hook
// re-polls while `scanComplete` is false) instead of one hanging call. Once
// caught up — and since a fresh seed is bundled in config/v3PoolSeed.ts —
// steady-state calls only scan the small delta since the last pass.
const SCAN_BUDGET_MS = 5000;
// Minimum gap between successive chunk requests. A sequential scan at
// CHUNK_SIZE showed no rate-limit failures with no delay at all (each
// awaited chunk's own ~300ms round trip already paces things), but a small
// floor stays cheap insurance against concurrent callers tightening spacing.
const CHUNK_DELAY_MS = 50;

// Where the checkpoint survives a page reload. dotoneswap keeps this purely
// in-process because a warm Next.js server holds it between requests; a
// browser tab has no such process, so without persistence every hard refresh
// would restart the scan from the seed and re-walk every block since. The
// scan logic itself is unchanged — this is only its storage backend.
// Keyed by chain + factory so pointing the app at a different deployment
// can't resume someone else's progress.
const STORAGE_KEY = `dotone:v3:pools:checkpoint:${CHAIN_ID}:${V3_FACTORY.toLowerCase()}`;

function readStoredCheckpoint(): ScanCheckpoint | undefined {
  if (typeof localStorage === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { lastScannedBlock?: string; pools?: V3PoolCreatedInfo[] };
    if (typeof parsed.lastScannedBlock !== "string" || !Array.isArray(parsed.pools)) return undefined;
    return { lastScannedBlock: BigInt(parsed.lastScannedBlock), pools: parsed.pools };
  } catch {
    // Corrupt entry or storage disabled (private mode) — fall back to the seed.
    return undefined;
  }
}

function writeStoredCheckpoint(checkpoint: ScanCheckpoint): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lastScannedBlock: checkpoint.lastScannedBlock.toString(), pools: checkpoint.pools }),
    );
  } catch {
    // Quota exceeded / storage disabled — the in-memory checkpoint still works
    // for this session, it just won't resume after a reload.
  }
}

// advanceScan() must run on every call, NOT be gated behind the outer
// state-cache TTL below — it's the thing that makes the checkpoint actually
// progress. Guarded by a single shared in-flight promise so concurrent calls
// during catch-up don't each start their own overlapping scan (which could
// otherwise race and regress lastScannedBlock).
let scanInflight: Promise<{ pools: V3PoolCreatedInfo[]; scanComplete: boolean }> | null = null;

function advanceScan(): Promise<{ pools: V3PoolCreatedInfo[]; scanComplete: boolean }> {
  if (scanInflight) return scanInflight;
  scanInflight = runScan().finally(() => {
    scanInflight = null;
  });
  return scanInflight;
}

function toPoolInfo(args: { token0: Address; token1: Address; fee: number; pool: Address }): V3PoolCreatedInfo {
  return { pool: args.pool, token0: args.token0, token1: args.token1, fee: args.fee };
}

function bigMax(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}

function seededCheckpoint(): ScanCheckpoint {
  return {
    lastScannedBlock: V3_POOL_SEED_BLOCK,
    pools: V3_POOL_SEED.map((p) => ({ ...p })),
  };
}

async function runScan(): Promise<{ pools: V3PoolCreatedInfo[]; scanComplete: boolean }> {
  // Seeded rather than starting from the factory's deploy block every time the
  // checkpoint is empty (cold start, cleared storage, …) — see
  // config/v3PoolSeed.ts for why: a from-scratch scan of the full history
  // would never finish before something reset it again. Only take a stored
  // checkpoint at or past the seed block, so a stale one from an older build
  // can't make the list skip pools the newer seed already knows about.
  const stored = peekCache<ScanCheckpoint>(CHECKPOINT_KEY) ?? readStoredCheckpoint();
  const checkpoint = stored && stored.lastScannedBlock >= V3_POOL_SEED_BLOCK ? stored : seededCheckpoint();

  const latest = await publicClient.getBlockNumber();
  if (checkpoint.lastScannedBlock >= latest) {
    return { pools: checkpoint.pools, scanComplete: true };
  }

  const seen = new Map(checkpoint.pools.map((p) => [p.pool.toLowerCase(), p]));
  let from = checkpoint.lastScannedBlock + 1n;
  let lastScanned = checkpoint.lastScannedBlock;
  const start = Date.now();
  let firstChunk = true;

  while (from <= latest && Date.now() - start < SCAN_BUDGET_MS) {
    // Shrink the chunk on repeated failures — a smaller eth_getLogs range is
    // both less likely to be rejected outright and cheaper to retry.
    const chunkSize =
      consecutiveFailures > 0 ? bigMax(CHUNK_SIZE >> BigInt(Math.min(consecutiveFailures, 3)), MIN_CHUNK_SIZE) : CHUNK_SIZE;
    const to = from + chunkSize - 1n > latest ? latest : from + chunkSize - 1n;
    // Pace successive chunk requests — back-to-back eth_getLogs calls with no
    // delay is what was tripping the RPC's rate limit, which then made every
    // chunk fail and retry (via viem's built-in HTTP retry), burning through
    // the request budget even faster without any scan progress. After a
    // failure, back off further still (exponential, capped) instead of
    // immediately retrying at the same pace that just got rate-limited.
    const delay =
      consecutiveFailures > 0 ? Math.min(CHUNK_DELAY_MS * 2 ** consecutiveFailures, MAX_CHUNK_DELAY_MS) : CHUNK_DELAY_MS;
    if (!firstChunk) await new Promise((resolve) => setTimeout(resolve, delay));
    firstChunk = false;
    try {
      const events = await publicClient.getContractEvents({
        address: V3_FACTORY,
        abi: V3_FACTORY_ABI,
        eventName: "PoolCreated",
        fromBlock: from,
        toBlock: to,
      });
      for (const event of events) {
        const info = toPoolInfo(event.args as { token0: Address; token1: Address; fee: number; pool: Address });
        seen.set(info.pool.toLowerCase(), info);
      }
      lastScanned = to;
      consecutiveFailures = 0;
    } catch {
      // Leave lastScannedBlock where it was — this chunk gets retried (with a
      // smaller range and a longer delay, per above) on the next call instead
      // of silently being skipped.
      consecutiveFailures += 1;
      break;
    }
    from = to + 1n;
  }

  const pools = Array.from(seen.values());
  // Forward-only write: only persist if we actually advanced past whatever is
  // currently cached, so this can't regress progress another caller made.
  const current = peekCache<ScanCheckpoint>(CHECKPOINT_KEY);
  if (!current || lastScanned > current.lastScannedBlock) {
    const next = { lastScannedBlock: lastScanned, pools };
    setCache(CHECKPOINT_KEY, next);
    writeStoredCheckpoint(next);
  }
  return { pools, scanComplete: lastScanned >= latest };
}

async function computeState(created: V3PoolCreatedInfo[]): Promise<V3PoolInfo[]> {
  if (created.length === 0) return [];

  const stateContracts = created.flatMap((p) => [
    { address: p.pool, abi: V3_POOL_ABI, functionName: "slot0" } as const,
    { address: p.pool, abi: V3_POOL_ABI, functionName: "liquidity" } as const,
  ]);
  const [stateResults, tokenInfo] = await Promise.all([
    publicClient.multicall({ contracts: stateContracts, allowFailure: true }),
    resolveTokenMetadata(created.flatMap((p) => [p.token0, p.token1])),
  ]);

  const pools: V3PoolInfo[] = [];
  created.forEach((p, i) => {
    const slot0R = stateResults[i * 2];
    const liquidityR = stateResults[i * 2 + 1];
    if (slot0R.status !== "success" || liquidityR.status !== "success") return;
    const token0 = tokenInfo.get(p.token0.toLowerCase());
    const token1 = tokenInfo.get(p.token1.toLowerCase());
    if (!token0 || !token1) return;
    const [sqrtPriceX96, tick] = slot0R.result as readonly [bigint, number, number, number, number, number, boolean];
    pools.push({
      address: p.pool,
      token0,
      token1,
      fee: p.fee,
      sqrtPriceX96,
      tick,
      liquidity: liquidityR.result as bigint,
    });
  });
  return pools;
}

export async function getAllV3Pools(): Promise<{ pools: V3PoolInfo[]; scanComplete: boolean }> {
  // Discovery advances every call (cheap once caught up — one getBlockNumber
  // read — and self-bounded while catching up). Only the multicall state
  // refresh (slot0/liquidity/token metadata) is throttled to the TTL, since
  // that's the actually-expensive part to repeat.
  const { pools: created, scanComplete } = await advanceScan();
  const pools = await getOrFetch("v3:pools:state", TTL.v3Pools, () => computeState(created));
  return { pools, scanComplete };
}
