import type { Chain } from "viem";

import { arbitrumChain, bscChain, mainnetChain, polygonChain } from "./chain";

// Every network the pools page / swap UI can be pointed at. "dotone" is our
// own AMM (V2 + V3 factories on DotOne chain); everything else is a LI.FI-
// routed chain whose pool rows come from DeFiLlama (data/pools/defiLlamaPools.ts).
export type SwapNetwork = "dotone" | "bsc" | "ethereum" | "polygon" | "arbitrum";

export interface LifiNetworkConfig {
  id: Exclude<SwapNetwork, "dotone">;
  label: string;
  chain: Chain;
  /** Symbol to look up for this network's own icon in the network switcher
   * and pool-filter dropdowns. */
  nativeSymbol: string;
  /** DeFiLlama's public yields API identifies pools by its own chain-name and
   * project-slug strings, not chain IDs — these are that API's vocabulary,
   * verified against https://yields.llama.fi/pools. `projectLabel` is just
   * the human-readable name shown in the pool row ("PancakeSwap · BNB
   * Chain"). Ported from dotoneswap's config/networks.ts. */
  defiLlama: { chain: string; project: string; projectLabel: string };
}

// Single source of truth for every LI.FI-routed network — the pools page's
// network filter (features/pools/PoolsExplorer.tsx) and the data layer's
// DeFiLlama filters (data/pools/defiLlamaPools.ts) both derive from this
// array, so adding a 5th network here is the only change needed.
export const LIFI_NETWORKS: LifiNetworkConfig[] = [
  {
    id: "bsc",
    label: "BNB Chain",
    chain: bscChain,
    nativeSymbol: "BNB",
    defiLlama: { chain: "BSC", project: "pancakeswap-amm", projectLabel: "PancakeSwap" },
  },
  {
    id: "ethereum",
    label: "Ethereum",
    chain: mainnetChain,
    nativeSymbol: "ETH",
    defiLlama: { chain: "Ethereum", project: "uniswap-v3", projectLabel: "Uniswap V3" },
  },
  {
    id: "polygon",
    label: "Polygon",
    chain: polygonChain,
    // Polygon's native currency is POL, not MATIC — viem's own polygon chain
    // def already reports nativeCurrency.symbol "POL" (post-rebrand), so this
    // must match that, not the old ticker.
    nativeSymbol: "POL",
    defiLlama: { chain: "Polygon", project: "uniswap-v3", projectLabel: "Uniswap V3" },
  },
  {
    id: "arbitrum",
    label: "Arbitrum",
    chain: arbitrumChain,
    // Arbitrum's actual gas token is ETH, same as Ethereum mainnet — using
    // that here would make the two networks' icons indistinguishable in the
    // switcher, so ARB (its governance token) is used purely as a distinct
    // visual identifier, not a claim that it's the native currency.
    nativeSymbol: "ARB",
    defiLlama: { chain: "Arbitrum", project: "uniswap-v3", projectLabel: "Uniswap V3" },
  },
];

export function getLifiNetwork(id: SwapNetwork): LifiNetworkConfig | undefined {
  return LIFI_NETWORKS.find((n) => n.id === id);
}
