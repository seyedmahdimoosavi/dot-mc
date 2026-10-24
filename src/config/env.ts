// Network config, overridable via Vite env vars (see .env) — ported from
// dotoneswap's config/env.ts. This app is a browser-only SPA, so every value
// here is public and inlined into the bundle at BUILD time (Vite replaces
// `import.meta.env.*` statically), meaning changing one still requires a
// rebuild — the same trade-off Next.js has with NEXT_PUBLIC_* vars.
const env = import.meta.env as unknown as Record<string, string | undefined>;

function read(name: string): string | undefined {
  const value = env[name];
  return value && value.trim() ? value.trim() : undefined;
}

// DotOne Smartchain Testnet.
export const RPC_URL = read("VITE_RPC_URL") ?? "https://rpc.dotone.online";
export const CHAIN_ID = read("VITE_CHAIN_ID") ? Number(read("VITE_CHAIN_ID")) : 505;

// The swap app (this project's sibling) — pool rows link out to its own pool
// page instead of rendering pool details here; see features/pools/PoolsExplorer.tsx.
export const SWAP_APP_URL = read("VITE_SWAP_APP_URL") ?? "https://swap.dotone.online";

// DeFiLlama's public yields API (no key, no auth) — the only read-only
// market-data source behind the LI.FI-routed chains' pool rows on the Pools
// page (see data/pools/defiLlamaPools.ts).
export const DEFILLAMA_POOLS_URL = read("VITE_DEFILLAMA_POOLS_URL") ?? "https://yields.llama.fi/pools";
