import { defineChain } from "viem";
import { arbitrum, bsc, mainnet, polygon } from "viem/chains";

import { MULTICALL3 } from "@/data/contracts/addresses";

import { ARBITRUM_RPC_URL, BSC_RPC_URL, CHAIN_ID, ETH_RPC_URL, POLYGON_RPC_URL, RPC_URL } from "./env";

// DotOneSmartchain Testnet — not a built-in viem/wagmi chain. Ported from
// dotoneswap's config/chain.ts so the browser-side publicClient
// (data/chain.ts) targets exactly the same network/contracts as the swap app.
export const dotOneChain = defineChain({
  id: CHAIN_ID,
  name: "DotOneSmartchain Testnet",
  nativeCurrency: { name: "DotOne Coin", symbol: "DT1", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  contracts: {
    // This chain's own Multicall3 deployment (see data/contracts/addresses.ts)
    // — setting this makes publicClient.multicall() batch into aggregate3()
    // automatically, no custom multicall helper needed.
    multicall3: { address: MULTICALL3 },
  },
});

// BNB Chain — reuses viem's built-in `bsc` definition (correct multicall3
// address, block explorer, etc. already set) and only overrides the RPC
// endpoint so it's consistent with BSC_RPC_URL.
export const bscChain = defineChain({
  ...bsc,
  rpcUrls: { default: { http: [BSC_RPC_URL] } },
});

// Same reuse-the-built-in-definition, override-only-the-RPC pattern as
// bscChain above.
export const mainnetChain = defineChain({
  ...mainnet,
  rpcUrls: { default: { http: [ETH_RPC_URL] } },
});

export const polygonChain = defineChain({
  ...polygon,
  rpcUrls: { default: { http: [POLYGON_RPC_URL] } },
});

export const arbitrumChain = defineChain({
  ...arbitrum,
  rpcUrls: { default: { http: [ARBITRUM_RPC_URL] } },
});

export const SUPPORTED_CHAINS = [dotOneChain, bscChain, mainnetChain, polygonChain, arbitrumChain] as const;
