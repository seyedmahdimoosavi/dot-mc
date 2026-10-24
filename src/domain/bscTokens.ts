import { NATIVE_TOKEN_ADDRESS } from "@/data/lifi";

import type { TokenInfo } from "./types";

// Curated list of major, liquid BSC mainnet tokens, copied verbatim from
// dotoneswap's domain/bscTokens.ts — real BEP-20 contract addresses, each
// verified live against BSC (symbol()/decimals() via eth_call) before being
// added there. Deliberately not fetched from LI.FI's own token list API, to
// keep this list small and intentional rather than the full firehose of BSC
// tokens LI.FI indexes.
//
// Used by data/pools/defiLlamaPools.ts to vet DeFiLlama's PancakeSwap pool
// rows: a pool is only surfaced when both of its underlying tokens appear
// here, which filters out the thousands of low-quality/scam pairs DeFiLlama
// indexes.
export const BSC_CURATED_TOKENS: TokenInfo[] = [
  {
    address: NATIVE_TOKEN_ADDRESS,
    symbol: "BNB",
    decimals: 18,
    name: "BNB",
  },
  {
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    symbol: "WBNB",
    decimals: 18,
    name: "Wrapped BNB",
  },
  {
    address: "0x55d398326f99059fF775485246999027B3197955",
    symbol: "USDT",
    decimals: 18,
    name: "Tether USD",
  },
  {
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    symbol: "USDC",
    decimals: 18,
    name: "USD Coin",
  },
  {
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    symbol: "BUSD",
    decimals: 18,
    name: "Binance USD",
  },
  {
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    symbol: "ETH",
    decimals: 18,
    name: "Ethereum Token",
  },
  {
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    symbol: "BTCB",
    decimals: 18,
    name: "BTCB Token",
  },
  {
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    symbol: "CAKE",
    decimals: 18,
    name: "PancakeSwap Token",
  },
  {
    address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    symbol: "DAI",
    decimals: 18,
    name: "Dai Token",
  },
  {
    address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
    symbol: "LINK",
    decimals: 18,
    name: "ChainLink Token",
  },
  {
    address: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
    symbol: "SHIB",
    decimals: 18,
    name: "SHIBA INU",
  },
  {
    // On-chain decimals=8, unlike every other token in this list — verified
    // live via symbol()/decimals() before adding (Binance-Peg Dogecoin kept
    // Dogecoin's own 8-decimal convention instead of the usual 18).
    address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    symbol: "DOGE",
    decimals: 8,
    name: "Dogecoin",
  },
  {
    address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
    symbol: "XRP",
    decimals: 18,
    name: "XRP Token",
  },
  {
    address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
    symbol: "ADA",
    decimals: 18,
    name: "Cardano Token",
  },
  {
    address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
    symbol: "DOT",
    decimals: 18,
    name: "Polkadot Token",
  },
  {
    address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
    symbol: "MATIC",
    decimals: 18,
    name: "Matic Token",
  },
  {
    address: "0x1CE0c2827e2eF14D5C4f29a091d735A204794041",
    symbol: "AVAX",
    decimals: 18,
    name: "Avalanche Token",
  },
  {
    address: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
    symbol: "UNI",
    decimals: 18,
    name: "Uniswap",
  },
  {
    address: "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
    symbol: "LTC",
    decimals: 18,
    name: "Litecoin Token",
  },
  {
    address: "0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B",
    symbol: "TRX",
    decimals: 18,
    name: "TRON",
  },
  {
    address: "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409",
    symbol: "FDUSD",
    decimals: 18,
    name: "First Digital USD",
  },
];
