import { createPublicClient, http } from 'viem';

import { bsc } from 'viem/chains';
import { useQuery } from '@tanstack/react-query';

export interface ChainlinkTokenPrice {
  readonly price: number;
  readonly pair: string;
  readonly updatedAt: Date;
}

const POLL_INTERVAL = 30_000;

export default function useChainlinkTokenPrice(tokenAddress: string | undefined) {
  const feed = getChainlinkFeedForToken(tokenAddress);

  return useQuery<ChainlinkTokenPrice>({
    queryKey: ['chainlink-token-price', feed?.feedAddress],
    enabled: Boolean(feed),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL,
    retry: false,
    queryFn: async () => {
      if (!feed) {
        throw new Error('No Chainlink feed configured for this token');
      }

      const [decimals, roundData] = await bscPublicClient.multicall({
        contracts: [
          { address: feed.feedAddress, abi: aggregatorV3Abi, functionName: 'decimals' },
          { address: feed.feedAddress, abi: aggregatorV3Abi, functionName: 'latestRoundData' },
        ] as const,
        allowFailure: false,
      });

      const [, answer, , updatedAt] = roundData;

      return {
        price: Number(answer) / 10 ** decimals,
        pair: feed.pair,
        updatedAt: new Date(Number(updatedAt) * 1000),
      };
    },
  });
}
const aggregatorV3Abi = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;





export const BSC_RPC_URL = 'https://bsc-dataseed.binance.org';

// Reads Chainlink price feeds that live on BNB Chain mainnet, independent
// of whichever chain this explorer instance itself indexes. Uses Binance's
// public RPC explicitly (rather than viem's default) so the endpoint is a
// fixed, known domain that can be allow-listed in the CSP connect-src.
const bscPublicClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_RPC_URL),
});

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

// export default CHAINLINK_TOKEN_FEEDS;