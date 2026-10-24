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

// LI.FI-routed networks (see config/networks.ts) — swaps on these chains go
// through LI.FI rather than our own AMM, so these RPCs are only needed by the
// LI.FI SDK's token index (data/lifi.ts). Public endpoints unless overridden.
export const BSC_RPC_URL = read("VITE_BSC_RPC_URL") ?? "https://bsc-dataseed.binance.org";
export const ETH_RPC_URL = read("VITE_ETH_RPC_URL") ?? "https://eth.llamarpc.com";
export const POLYGON_RPC_URL = read("VITE_POLYGON_RPC_URL") ?? "https://polygon-rpc.com";
export const ARBITRUM_RPC_URL = read("VITE_ARBITRUM_RPC_URL") ?? "https://arb1.arbitrum.io/rpc";

// LI.FI API key from https://portal.li.fi — raises rate limits over the
// unauthenticated default. Registering an integrator string with a payout
// wallet (see LIFI_INTEGRATOR) happens at https://portal.li.fi.
export const LIFI_INTEGRATOR = read("VITE_LIFI_INTEGRATOR") ?? "dot-swap";
export const LIFI_API_KEY = read("VITE_LIFI_API_KEY");

// Our fee on top of LI.FI's own ~25bps default, as a fraction (0.01 = 1%).
export const LIFI_FEE = read("VITE_LIFI_FEE") ? Number(read("VITE_LIFI_FEE")) : 0.001;

// DeFiLlama's public yields API (no key, no auth) — the read-only market-data
// source behind every LI.FI/routed-chain pool row on the Pools page. Not
// affiliated with LI.FI: LI.FI only gives swap quotes, it has no pool-listing
// API (see data/pools/defiLlamaPools.ts).
export const DEFILLAMA_POOLS_URL = read("VITE_DEFILLAMA_POOLS_URL") ?? "https://yields.llama.fi/pools";
