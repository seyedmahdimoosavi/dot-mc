export interface ChainlinkFeedConfig {
  readonly tokenAddress: string;
  readonly feedAddress: `0x${string}`;
  readonly pair: string;
}

const CHAINLINK_TOKEN_FEEDS: ReadonlyArray<ChainlinkFeedConfig> = [
  // ChainLink Token (Bridged)
  {
    tokenAddress: '0x7d4a965754f800ea08b792b00455b31ed1c31fcc',
    feedAddress: '0xca236E327F629f9Fc2c30A4E95775EbF0B89fac8',
    pair: 'LINK / USD',
  },

  // BTC Token
  {
    tokenAddress: '0xd68f57d9698088d5e0e6f49e60d1398a849098fd',
    feedAddress: '0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf',
    pair: 'BTC / USD',
  },

  // Ethereum Token
  {
    tokenAddress: '0x711dc0dd81a4cca64bc8c3fad4e51d7eeb3082a7',
    feedAddress: '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
    pair: 'ETH / USD',
  },

  // Tether USD
  {
    tokenAddress: '0x9c4229d652f0d0d7cadc11554abffa8c840798d8',
    feedAddress: '0xB97Ad0E74fa7d920791E90258A6E2085088b4320',
    pair: 'USDT / USD',
  },

  // USD Coin
  {
    tokenAddress: '0xcc42fb0cf8bc9426e3165ee59dd8c6c19edf13b7',
    feedAddress: '0x51597f405303C4377E36123cBc172b13269EA163',
    pair: 'USDC / USD',
  },

  // Dai Token
  {
    tokenAddress: '0xb1e600be9c665042ecaf99eb57857e54da4267d1',
    feedAddress: '0x132d3C0B1d2CeA0Bc552588063BDBb210FDeecfA',
    pair: 'DAI / USD',
  },

  // SHIBA INU
  {
    tokenAddress: '0xd674ec6d370b5b6418679dcbc6a01aaedec93894',
    feedAddress: '0xA615Be6cb0f3F36A641858dB6F30B9242d0ABeD8',
    pair: 'SHIB / USD',
  },

  // PancakeSwap Token
  {
    tokenAddress: '0x89e23f72d7ea5d33d2b6d97bd63b6c08be7dbc7a',
    feedAddress: '0xB6064eD41d4f67e353768aA239cA86f4F73665a1',
    pair: 'CAKE / USD',
  },

  // Wrapped BNB
  {
    tokenAddress: '0xe415faed7f43e22c8ef0159b33fadf577d94a5f0',
    feedAddress: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
    pair: 'BNB / USD',
  },
];

export function getChainlinkFeedForToken(
  address: string | undefined,
): ChainlinkFeedConfig | undefined {
  if (!address) {
    return undefined;
  }

  const normalized = address.toLowerCase();

  return CHAINLINK_TOKEN_FEEDS.find(
    (feed) => feed.tokenAddress === normalized,
  );
}

export default CHAINLINK_TOKEN_FEEDS;