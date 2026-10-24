// Every network the pools page / swap UI can be pointed at. "dotone" is our
// own AMM (V2 + V3 factories on DotOne chain); everything else is a
// LI.FI-routed chain whose pool rows come from DeFiLlama
// (data/pools/defiLlamaPools.ts).
export type SwapNetwork = "dotone" | "bsc" | "ethereum" | "polygon" | "arbitrum";

export interface LifiNetworkConfig {
  id: Exclude<SwapNetwork, "dotone">;
  label: string;
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
    defiLlama: { chain: "BSC", project: "pancakeswap-amm", projectLabel: "PancakeSwap" },
  },
  {
    id: "ethereum",
    label: "Ethereum",
    defiLlama: { chain: "Ethereum", project: "uniswap-v3", projectLabel: "Uniswap V3" },
  },
  {
    id: "polygon",
    label: "Polygon",
    defiLlama: { chain: "Polygon", project: "uniswap-v3", projectLabel: "Uniswap V3" },
  },
  {
    id: "arbitrum",
    label: "Arbitrum",
    defiLlama: { chain: "Arbitrum", project: "uniswap-v3", projectLabel: "Uniswap V3" },
  },
];

export function getLifiNetwork(id: SwapNetwork): LifiNetworkConfig | undefined {
  return LIFI_NETWORKS.find((n) => n.id === id);
}
