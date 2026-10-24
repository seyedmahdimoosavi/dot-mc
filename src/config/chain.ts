import { defineChain } from "viem";

import { MULTICALL3 } from "@/data/contracts/addresses";

import { CHAIN_ID, RPC_URL } from "./env";

// DotOneSmartchain Testnet — not a built-in viem/wagmi chain. Shared between
// the server-ish data layer (data/chain.ts) and any client component that
// needs the chain definition.
//
// The LI.FI-routed networks (BNB Chain, Ethereum, Polygon, Arbitrum) used to
// define their own chains here for the LI.FI SDK's token index. That SDK is
// gone (see data/pools/defiLlamaPools.ts), so their only remaining need was a
// chain id for a REST call — no viem chain object is required.
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
