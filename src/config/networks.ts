export type SwapNetwork = "dotone" | "bsc" | "ethereum" | "polygon" | "arbitrum";
export const LIFI_NETWORKS = [
  { id: "bsc", label: "BNB Chain", nativeSymbol: "BNB", defiLlama: { projectLabel: "PancakeSwap" } },
  { id: "ethereum", label: "Ethereum", nativeSymbol: "ETH", defiLlama: { projectLabel: "DeFi pools" } },
  { id: "polygon", label: "Polygon", nativeSymbol: "POL", defiLlama: { projectLabel: "DeFi pools" } },
  { id: "arbitrum", label: "Arbitrum", nativeSymbol: "ETH", defiLlama: { projectLabel: "DeFi pools" } },
] as const;
