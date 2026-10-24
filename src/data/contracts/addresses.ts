import type { Address } from "viem";

// Ported from dotoneswap's data/contracts/addresses.ts (itself ported from
// dotone-swap-v3's src/config/{contracts,v3}.ts), now overridable via Vite
// env vars (see .env) so a redeployed contract address only needs an env var
// change + rebuild, not a source edit.
//
// Every value has to be VITE_* rather than a server-only secret: this app is
// a browser SPA, and Vite only exposes VITE_* vars to the bundle — which is
// fine here, all of these are public on-chain addresses.
const env = import.meta.env as unknown as Record<string, string | undefined>;

function envAddress(name: string, fallback: Address): Address {
  const value = env[name];
  return value && value.trim() ? (value.trim() as Address) : fallback;
}

// V2
export const V2_ROUTER: Address = envAddress("VITE_V2_ROUTER", "0x63b76b550FF13b8B681E65C1C5eC7D4cf30143f7");
export const V2_FACTORY: Address = envAddress("VITE_V2_FACTORY", "0xD728243a996C615a44Eedcd40AE311083B9b9279");
// Kept on the historical VITE_WDOTO_ADDRESS name so an existing .env keeps
// working; the default is the real deployed contract, not a zero address.
export const WDOTO: Address = envAddress("VITE_WDOTO_ADDRESS", "0x044b2ED77214aeA517e811f5c80980511F8ff326");

// V3
export const V3_POSITION_MANAGER: Address = envAddress(
  "VITE_V3_POSITION_MANAGER",
  "0x352ca10c009FfCaB092d5916A58564dE0b949F57",
);
export const V3_SWAP_ROUTER: Address = envAddress("VITE_V3_SWAP_ROUTER", "0x9d34Fe7BE11A8aa53B9a305Cf8450011Fe7be3bC");
export const V3_QUOTER: Address = envAddress("VITE_V3_QUOTER", "0x72A8d19277D3d732e943E626AD6338D14648a773");
export const V3_FACTORY: Address = envAddress("VITE_V3_FACTORY", "0x97Dbc1528EBa37d8c35ae54Bd21F2C9Fe08d6e5E");
// Earliest block a PoolCreated event could exist — starting point for the
// checkpointed factory log scan (see data/pools/v3Pools.ts) when no seed is
// available for the current deployment.
export const V3_FACTORY_DEPLOY_BLOCK = env.VITE_V3_FACTORY_DEPLOY_BLOCK
  ? BigInt(env.VITE_V3_FACTORY_DEPLOY_BLOCK)
  : 2_483_938n;

// This chain's own Multicall3 deployment — NOT the canonical cross-chain
// singleton (0xcA11bde...), confirmed live via direct on-chain test.
export const MULTICALL3: Address = envAddress("VITE_MULTICALL3", "0xe345E23D099203B2aC01DC7EA71eEb84f4c1D13A");
