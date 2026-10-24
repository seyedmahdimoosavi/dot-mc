import type { TokenInfo } from "./types";

// Authoritative metadata override for tokens whose on-chain symbol()/name()
// calls fail on this RPC — copied verbatim from dotoneswap's domain/tokens.ts
// (itself ported from dotone-swap-v3's src/config/tokenList.ts).
//
// Also doubles as the "is this a real token?" allowlist used by
// features/pools/PoolsExplorer.tsx (REAL_TOKEN_ADDRESSES, which additionally
// drops anything whose name contains "test"), so the pool list hides junk
// pairs the same way the swap app does. The bridged tokens below were
// verified live on dotscan.one/tokens — real DOTO-20 contracts brought over by
// the DotOne bridge, all minted with 18 decimals regardless of their
// source-chain decimals.
export const CURATED_TOKENS: TokenInfo[] = [
  {
    address: "0xf412e85297F2A3dC7C3EC748a38Ff82446E0dD48",
    symbol: "TT2",
    decimals: 18,
    name: "TestToken2",
  },
  {
    address: "0xe415fAEd7f43e22c8Ef0159b33FADF577d94a5f0",
    symbol: "WBNB",
    decimals: 18,
    name: "Wrapped BNB",
  },
  {
    address: "0x711Dc0Dd81A4cCa64Bc8c3fad4E51D7EeB3082a7",
    symbol: "WETH",
    decimals: 18,
    name: "Ethereum Token (Bridged)",
  },
  {
    address: "0x9c4229D652f0D0D7CaDc11554aBFFA8C840798d8",
    symbol: "WUSDT",
    decimals: 18,
    name: "Tether USD (Bridged)",
  },
  {
    address: "0xCc42fB0Cf8bc9426E3165eE59dD8c6c19edF13B7",
    symbol: "WUSDC",
    decimals: 18,
    name: "USD Coin (Bridged)",
  },
  {
    address: "0xd68F57d9698088D5e0E6f49E60D1398A849098Fd",
    symbol: "WBTCB",
    decimals: 18,
    name: "BTCB Token (Bridged)",
  },
  {
    address: "0xB1e600BE9c665042eCAF99Eb57857E54dA4267d1",
    symbol: "WDAI",
    decimals: 18,
    name: "Dai Token (Bridged)",
  },
  {
    address: "0x7D4A965754f800EA08B792b00455B31ED1c31fcC",
    symbol: "WLINK",
    decimals: 18,
    name: "ChainLink Token (Bridged)",
  },
  {
    address: "0x89e23f72D7Ea5D33D2B6d97Bd63b6c08be7DBc7A",
    symbol: "WCake",
    decimals: 18,
    name: "PancakeSwap Token (Bridged)",
  },
  {
    address: "0xd674EC6d370b5b6418679dCbc6A01aaEDec93894",
    symbol: "WSHIB",
    decimals: 18,
    name: "SHIBA INU (Bridged)",
  },
];
