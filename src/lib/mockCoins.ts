import { coinBrandColors, defaultCoinColor } from '../theme/colors'

import type { Coin } from './types'
import { slugify } from './slug'

const cmcLogo = (id: number): string =>
  `https://s2.coinmarketcap.com/static/img/coins/200x200/${id}.png`


/** Deterministic PRNG so charts/prices stay stable across re-renders (mulberry32). */
function seededRandom(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0
  }
  return hash
}

/** Bounded, mean-reverting random walk so any two points stay within a realistic ratio. */
function buildSparkline(rand: () => number, trendBias: number, points = 32): number[] {
  const series: number[] = []
  const bias = trendBias / 100
  let value = 100
  for (let i = 0; i < points; i++) {
    const meanReversion = (100 - value) * 0.03
    const drift = (rand() - 0.5) * 3 + bias * 1.2 + meanReversion
    value = Math.min(150, Math.max(55, value + drift))
    series.push(value)
  }
  return series
}

interface SeedCoin {
  name: string
  symbol: string
  price: number
  categories: string[]
  logo: string
  address: string
}

const seedCoins: SeedCoin[] = [
  {
    name: 'ChainLink Token (Bridged)',
    symbol: 'WLINK',
    price: 0,
    categories: ['defi'],
    logo: cmcLogo(1975),
    address: '0x7D4A965754f800EA08B792b00455B31ED1c31fcC',
  },
  {
    name: 'BTC Token',
    symbol: 'BTC',
    price: 0,
    categories: ['layer1', 'store-of-value'],
    logo: cmcLogo(1),
    address: '0xd68F57d9698088D5e0E6f49E60D1398A849098Fd',
  },
  {
    name: 'Ethereum Token',
    symbol: 'ETH',
    price: 0,
    categories: ['layer1', 'smart-contracts'],
    logo: cmcLogo(1027),
    address: '0x711Dc0Dd81A4cCa64Bc8c3fad4E51D7EeB3082a7',
  },
  {
    name: 'Tether USD',
    symbol: 'WUSDT',
    price: 1,
    categories: ['stablecoin'],
    logo: cmcLogo(825),
    address: '0x9c4229D652f0D0D7CaDc11554aBFFA8C840798d8',
  },
  {
    name: 'USD Coin',
    symbol: 'WUSDC',
    price: 1,
    categories: ['stablecoin'],
    logo: cmcLogo(3408),
    address: '0xCc42fB0Cf8bc9426E3165eE59dD8c6c19edF13B7',
  },
  {
    name: 'Dai Token',
    symbol: 'WDAI',
    price: 1,
    categories: ['stablecoin'],
    logo: cmcLogo(4943),
    address: '0xB1e600BE9c665042eCAF99Eb57857E54dA4267d1',
  },
  {
    name: 'SHIBA INU',
    symbol: 'WSHIB',
    price: 0,
    categories: ['meme'],
    logo: cmcLogo(5994),
    address: '0xd674EC6d370b5b6418679dCbc6A01aaEDec93894',
  },
  {
    name: 'PancakeSwap Token',
    symbol: 'WCake',
    price: 0,
    categories: ['defi'],
    logo: cmcLogo(7186),
    address: '0x89e23f72D7Ea5D33D2B6d97Bd63b6c08be7DBc7A',
  },
  {
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    price: 0,
    categories: ['exchange-token', 'layer1'],
    logo: cmcLogo(1839),
    address: '0xe415fAEd7f43e22c8Ef0159b33FADF577d94a5f0',
  },
]

function buildCoin(seed: SeedCoin, rank: number): Coin {
  const rand = seededRandom(hashSeed(seed.symbol))
  const change24h = (rand() - 0.5) * 16
  const change1h = (rand() - 0.5) * 4
  const change7d = (rand() - 0.5) * 28
  const circulatingSupply = Math.round((1_000_000 + rand() * 900_000_000) / (seed.price > 100 ? 50 : 1))
  const marketCap = seed.price * circulatingSupply
  const hasMax = rand() > 0.4
  return {
    id: seed.symbol.toLowerCase(),
    rank,
    name: seed.name,
    symbol: seed.symbol,
    slug: slugify(seed.name),
    price: seed.price,
    change1h,
    change24h,
    change7d,
    marketCap,
    volume24h: marketCap * (0.03 + rand() * 0.22),
    circulatingSupply,
    maxSupply: hasMax ? Math.round(circulatingSupply * (1.05 + rand() * 0.8)) : null,
    allTimeHigh: seed.price * (1.2 + rand() * 2.5),
    allTimeLow: seed.price * (0.02 + rand() * 0.3),
    sparkline: buildSparkline(rand, change7d),
    color: coinBrandColors[seed.symbol] ?? defaultCoinColor,
    logo: seed.logo,
    address: seed.address,
    categories: seed.categories,
  }
}

const allSeeds = seedCoins;

export const mockCoins: Coin[] = allSeeds
  .map((seed, i) => buildCoin(seed, i + 1))
  .sort((a, b) => b.marketCap - a.marketCap)
  .map((coin, index) => ({ ...coin, rank: index + 1 }))

export const marketCapSeries = buildSparkline(seededRandom(hashSeed('dotmarket-global-cap')), 1, 30)

export const globalStats = {
  totalMarketCap: mockCoins.reduce((sum, c) => sum + c.marketCap, 0),
  totalVolume24h: mockCoins.reduce((sum, c) => sum + c.volume24h, 0),
  marketCapChange24h: 2.84,
  btcDominance: (mockCoins.find((c) => c.symbol === 'BTC')!.marketCap / mockCoins.reduce((s, c) => s + c.marketCap, 0)) * 100,
  ethDominance: (mockCoins.find((c) => c.symbol === 'ETH')!.marketCap / mockCoins.reduce((s, c) => s + c.marketCap, 0)) * 100,
  cryptoCount: mockCoins.length,
  exchangeCount: 412,
  gasGwei: 18,
}
