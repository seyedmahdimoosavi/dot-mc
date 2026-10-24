import { createPublicClient, http } from "viem";

import { dotOneChain } from "@/config/chain";
import { RPC_URL } from "@/config/env";

// The one publicClient every data/ reader shares. Unlike dotoneswap's
// data/chain.ts this runs in the browser (the app has no server), so it
// talks straight to DotOne's public RPC — verified CORS-enabled
// (Access-Control-Allow-Origin: * on both preflight and POST).
//
// retryCount/retryDelay are set explicitly (rather than relying on viem's
// defaults of 3/150ms) because this app issues bursts of concurrent reads
// (multicall batches, v3 pool-discovery chunk scans) that are prone to
// tripping the RPC's rate limit — see data/pools/v3Pools.ts's
// CHUNK_DELAY_MS for the sibling pacing fix on the getLogs scan loop.
export const publicClient = createPublicClient({
  chain: dotOneChain,
  transport: http(RPC_URL, { batch: true, retryCount: 5, retryDelay: 300 }),
});
