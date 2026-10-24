import { getAddress } from "viem";

import type { SwapNetwork } from "@/config/networks";

// Real logos for the tokens this app lists, ported from dotoneswap's
// data/tokenLogos.ts (sourced from Trust Wallet's public asset repo and
// verified live there before being added).
//
// Two lookup paths, because the swap app's two sources don't both exist here:
//   • `resolveTokenLogo(symbol)` — the swap app's own symbol-keyed map, which
//     covers DotOne's bridged assets (domain/tokens.ts) and BSC's curated list
//     (domain/bscTokens.ts). Those tokens have no address on the chains Trust
//     Wallet indexes, so only a symbol lookup can find them.
//   • `trustWalletLogo(network, address)` — for the read-only pools on
//     Ethereum/Polygon/Arbitrum/BNB Chain, whose symbols come from DeFiLlama
//     and aren't all in the map. The swap app got logos for these from LI.FI's
//     per-token `logoURI`; that SDK is gone (see data/pools/defiLlamaPools.ts),
//     so the same Trust Wallet repo is queried by address instead.
const TRUST_WALLET = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";
const TRUST_WALLET_SMARTCHAIN = `${TRUST_WALLET}/smartchain/assets`;

const CHAIN_SLUG: Record<Exclude<SwapNetwork, "dotone">, string> = {
  bsc: "smartchain",
  ethereum: "ethereum",
  polygon: "polygon",
  arbitrum: "arbitrum",
};

const TOKEN_LOGOS: Record<string, string> = {
  // DotOneSwap's own native wrapped token — the app's own logo, not a
  // Trust Wallet asset.
  WDOTO: "/doto.svg",
  WBNB: `${TRUST_WALLET_SMARTCHAIN}/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png`,
  WETH: `${TRUST_WALLET_SMARTCHAIN}/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png`,
  WUSDT: `${TRUST_WALLET_SMARTCHAIN}/0x55d398326f99059fF775485246999027B3197955/logo.png`,
  WUSDC: `${TRUST_WALLET_SMARTCHAIN}/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png`,
  WBTCB: `${TRUST_WALLET_SMARTCHAIN}/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/logo.png`,
  WDAI: `${TRUST_WALLET_SMARTCHAIN}/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3/logo.png`,
  WLINK: `${TRUST_WALLET_SMARTCHAIN}/0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD/logo.png`,
  WCake: `${TRUST_WALLET_SMARTCHAIN}/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png`,
  WSHIB: `${TRUST_WALLET_SMARTCHAIN}/0x2859e4544C4bB03966803b044A93563Bd2D0DD4D/logo.png`,

  // Plain-symbol entries for the BSC pool rows (domain/bscTokens.ts) — same
  // real BEP-20 assets as their bridged "W"-prefixed counterparts above, so
  // reusing the same Trust Wallet logo URLs.
  BNB: `${TRUST_WALLET_SMARTCHAIN}/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png`,
  USDT: `${TRUST_WALLET_SMARTCHAIN}/0x55d398326f99059fF775485246999027B3197955/logo.png`,
  USDC: `${TRUST_WALLET_SMARTCHAIN}/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d/logo.png`,
  BUSD: `${TRUST_WALLET_SMARTCHAIN}/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png`,
  ETH: `${TRUST_WALLET_SMARTCHAIN}/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png`,
  BTCB: `${TRUST_WALLET_SMARTCHAIN}/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c/logo.png`,
  CAKE: `${TRUST_WALLET_SMARTCHAIN}/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png`,
  DAI: `${TRUST_WALLET_SMARTCHAIN}/0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3/logo.png`,
  LINK: `${TRUST_WALLET_SMARTCHAIN}/0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD/logo.png`,
  SHIB: `${TRUST_WALLET_SMARTCHAIN}/0x2859e4544C4bB03966803b044A93563Bd2D0DD4D/logo.png`,
  DOGE: `${TRUST_WALLET_SMARTCHAIN}/0xbA2aE424d960c26247Dd6c32edC70B295c744C43/logo.png`,
  XRP: `${TRUST_WALLET_SMARTCHAIN}/0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE/logo.png`,
  ADA: `${TRUST_WALLET_SMARTCHAIN}/0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47/logo.png`,
  DOT: `${TRUST_WALLET_SMARTCHAIN}/0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402/logo.png`,
  MATIC: `${TRUST_WALLET_SMARTCHAIN}/0xCC42724C6683B7E57334c4E856f4c9965ED682bD/logo.png`,
  AVAX: `${TRUST_WALLET_SMARTCHAIN}/0x1CE0c2827e2eF14D5C4f29a091d735A204794041/logo.png`,
  UNI: `${TRUST_WALLET_SMARTCHAIN}/0xBf5140A22578168FD562DCcF235E5D43A02ce9B1/logo.png`,
  LTC: `${TRUST_WALLET_SMARTCHAIN}/0x4338665CBB7B2485A8855A139b75D5e34AB0DB94/logo.png`,
  // No entry for TRX — this token's address has no logo in Trust Wallet's
  // repo (verified live: 404), so it keeps TokenAvatar's generated fallback.
  FDUSD: `${TRUST_WALLET_SMARTCHAIN}/0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409/logo.png`,

  // Common symbols on the LI.FI-routed chains, taken from Trust Wallet's
  // canonical mainnet asset where the symbol exists on more than one chain
  // (a symbol-keyed map can't be chain-specific — same limitation the swap
  // app's map has).
  WMATIC: `${TRUST_WALLET}/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png`,
  WBTC: `${TRUST_WALLET}/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png`,
  WSTETH: `${TRUST_WALLET}/ethereum/assets/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0/logo.png`,
  STETH: `${TRUST_WALLET}/ethereum/assets/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84/logo.png`,
  AAVE: `${TRUST_WALLET}/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png`,
  ARB: `${TRUST_WALLET}/arbitrum/assets/0x912CE59144191C1204E64559FE8253a0e49E6548/logo.png`,
  OP: `${TRUST_WALLET}/optimism/assets/0x4200000000000000000000000000000000000042/logo.png`,
  CRV: `${TRUST_WALLET}/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png`,
  LDO: `${TRUST_WALLET}/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png`,
  PENDLE: `${TRUST_WALLET}/ethereum/assets/0x808507121B80c02388fAd14726482e061B8da827/logo.png`,
  GMX: `${TRUST_WALLET}/arbitrum/assets/0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a/logo.png`,
  GRT: `${TRUST_WALLET}/ethereum/assets/0xc944E90C64B2c07662A292be6244BDf05Cda44a7/logo.png`,
  MKR: `${TRUST_WALLET}/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png`,
  SUSHI: `${TRUST_WALLET}/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png`,
  COMP: `${TRUST_WALLET}/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png`,
  SNX: `${TRUST_WALLET}/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png`,
  ENS: `${TRUST_WALLET}/ethereum/assets/0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72/logo.png`,
};

export function resolveTokenLogo(symbol: string | undefined): string | undefined {
  if (!symbol) return undefined;
  return TOKEN_LOGOS[symbol];
}

/**
 * Trust Wallet's own logo file for an on-chain token. Their paths are EIP-55
 * checksummed, so the address is normalized first — a lowercase address is a
 * guaranteed 404 (verified). Returns undefined for an unparseable address.
 *
 * Tokens Trust Wallet doesn't list simply 404; TokenAvatar's onError then
 * falls back to the generated initials exactly as before.
 */
export function trustWalletLogo(
  network: Exclude<SwapNetwork, "dotone">,
  address: string,
): string | undefined {
  try {
    return `${TRUST_WALLET}/${CHAIN_SLUG[network]}/assets/${getAddress(address)}/logo.png`;
  } catch {
    return undefined;
  }
}
