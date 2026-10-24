interface CacheEntry<T> {
  value?: T;
  expiresAt: number;
  inflight?: Promise<T>;
}

// One shared TTL + inflight-dedup cache for every data/ reader, replacing
// the old app's three independent retry/dedupe implementations
// (Pools.tsx's mapWithConcurrency, tokenList.ts's withRetry, tokens.ts's
// withRetry) with a single place.
//
// Ported from dotoneswap's data/cache.ts, where it lives in a warm server
// process and survives across requests. This app has no server, so the store
// lives in the browser tab instead: it deduplicates everything a page needs
// (React Query's own cache sits on top of it) and resets on reload — except
// the V3 pool-scan checkpoint, which data/pools/v3Pools.ts additionally
// mirrors into localStorage so a reload doesn't restart the scan.
const store = new Map<string, CacheEntry<unknown>>();

/**
 * Returns the cached value for `key` if still fresh; otherwise calls
 * `fetcher()` once — concurrent callers for the same cold key share the
 * same in-flight promise instead of each triggering their own chain read.
 */
export async function getOrFetch<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const entry = store.get(key) as CacheEntry<T> | undefined;

  if (entry && entry.value !== undefined && entry.expiresAt > now) {
    return entry.value;
  }
  if (entry?.inflight) {
    return entry.inflight;
  }

  const staleValue = entry?.value;
  const inflight = fetcher()
    .then((value) => {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .catch((err) => {
      // A failed refresh (e.g. RPC rate-limited) shouldn't wipe out a
      // previously-good value — keep serving it (briefly extending its
      // expiry so we don't immediately re-fetch on every next call) rather
      // than making the UI go blank while the upstream recovers. Only drop
      // the slot entirely when there was never a good value to fall back on.
      if (staleValue !== undefined) {
        store.set(key, { value: staleValue, expiresAt: Date.now() + Math.min(ttlMs, 5_000) });
        return staleValue;
      }
      store.delete(key);
      throw err;
    });

  store.set(key, { value: staleValue, expiresAt: entry?.expiresAt ?? 0, inflight });
  return inflight;
}

/** Reads a cache slot without triggering a fetch — used by the checkpointed
 * V3 pool scan, which manages its own non-expiring progress state. */
export function peekCache<T>(key: string): T | undefined {
  return (store.get(key) as CacheEntry<T> | undefined)?.value;
}

/** Writes a cache slot directly, bypassing the fetcher — used by the
 * checkpointed V3 pool scan to persist partial progress with no TTL. */
export function setCache<T>(key: string, value: T, ttlMs = Number.POSITIVE_INFINITY): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Drops a cache slot so the next getOrFetch call is forced to hit the chain
 * instead of serving a value that's stale-but-still-within-TTL — used after
 * a wallet write (e.g. removing V3 liquidity) so the read that follows
 * doesn't just echo back pre-write state for the rest of the TTL window. */
export function invalidate(key: string): void {
  store.delete(key);
}
