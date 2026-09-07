import { coinBrandColors, defaultCoinColor } from '../theme/colors'
import { slugify } from './slug'
import type { Coin } from './types'

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
}

const seedCoins: SeedCoin[] = [
  { name: 'Bitcoin', symbol: 'BTC', price: 67842.29, categories: ['layer1', 'store-of-value'] },
  { name: 'Ethereum', symbol: 'ETH', price: 3522.18, categories: ['layer1', 'smart-contracts'] },
  { name: 'Tether', symbol: 'USDT', price: 1.0, categories: ['stablecoin'] },
  { name: 'BNB', symbol: 'BNB', price: 604.73, categories: ['exchange-token', 'layer1'] },
  { name: 'Solana', symbol: 'SOL', price: 178.92, categories: ['layer1', 'smart-contracts'] },
  { name: 'USDC', symbol: 'USDC', price: 1.0, categories: ['stablecoin'] },
  { name: 'XRP', symbol: 'XRP', price: 0.5274, categories: ['payments'] },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.1422, categories: ['meme'] },
  { name: 'Cardano', symbol: 'ADA', price: 0.452, categories: ['layer1', 'smart-contracts'] },
  { name: 'TRON', symbol: 'TRX', price: 0.1213, categories: ['payments'] },
  { name: 'Avalanche', symbol: 'AVAX', price: 34.87, categories: ['layer1', 'smart-contracts'] },
  { name: 'Shiba Inu', symbol: 'SHIB', price: 0.00002187, categories: ['meme'] },
  { name: 'Polkadot', symbol: 'DOT', price: 6.98, categories: ['layer1'] },
  { name: 'Chainlink', symbol: 'LINK', price: 14.62, categories: ['defi'] },
  { name: 'Bitcoin Cash', symbol: 'BCH', price: 452.11, categories: ['payments'] },
  { name: 'NEAR Protocol', symbol: 'NEAR', price: 5.43, categories: ['layer1', 'smart-contracts'] },
  { name: 'Litecoin', symbol: 'LTC', price: 84.55, categories: ['payments'] },
  { name: 'Polygon', symbol: 'MATIC', price: 0.712, categories: ['layer2'] },
  { name: 'Internet Computer', symbol: 'ICP', price: 12.34, categories: ['smart-contracts'] },
  { name: 'Uniswap', symbol: 'UNI', price: 7.21, categories: ['defi'] },
  { name: 'Ethereum Classic', symbol: 'ETC', price: 26.4, categories: ['layer1'] },
  { name: 'Stellar', symbol: 'XLM', price: 0.1123, categories: ['payments'] },
  { name: 'Monero', symbol: 'XMR', price: 168.72, categories: ['privacy'] },
  { name: 'OKB', symbol: 'OKB', price: 51.02, categories: ['exchange-token'] },
  { name: 'Filecoin', symbol: 'FIL', price: 5.87, categories: ['storage'] },
  { name: 'Hedera', symbol: 'HBAR', price: 0.0812, categories: ['layer1'] },
  { name: 'Cosmos', symbol: 'ATOM', price: 8.44, categories: ['layer1'] },
  { name: 'VeChain', symbol: 'VET', price: 0.0389, categories: ['supply-chain'] },
  { name: 'Aptos', symbol: 'APT', price: 9.56, categories: ['layer1', 'smart-contracts'] },
  { name: 'Arbitrum', symbol: 'ARB', price: 1.12, categories: ['layer2'] },
  { name: 'Optimism', symbol: 'OP', price: 2.34, categories: ['layer2'] },
  { name: 'Immutable', symbol: 'IMX', price: 1.98, categories: ['nft'] },
  { name: 'Render', symbol: 'RNDR', price: 7.65, categories: ['ai'] },
  { name: 'Injective', symbol: 'INJ', price: 24.11, categories: ['defi'] },
  { name: 'Fantom', symbol: 'FTM', price: 0.612, categories: ['layer1'] },
  { name: 'Algorand', symbol: 'ALGO', price: 0.1654, categories: ['layer1'] },
  { name: 'The Graph', symbol: 'GRT', price: 0.198, categories: ['defi'] },
  { name: 'Tezos', symbol: 'XTZ', price: 0.912, categories: ['smart-contracts'] },
  { name: 'EOS', symbol: 'EOS', price: 0.634, categories: ['smart-contracts'] },
  { name: 'Theta Network', symbol: 'THETA', price: 1.42, categories: ['media'] },
  { name: 'Flow', symbol: 'FLOW', price: 0.734, categories: ['nft'] },
  { name: 'Axie Infinity', symbol: 'AXS', price: 6.32, categories: ['nft', 'gaming'] },
  { name: 'The Sandbox', symbol: 'SAND', price: 0.412, categories: ['nft', 'gaming'] },
  { name: 'Decentraland', symbol: 'MANA', price: 0.381, categories: ['nft', 'gaming'] },
  { name: 'Chiliz', symbol: 'CHZ', price: 0.0876, categories: ['gaming'] },
  { name: 'Kava', symbol: 'KAVA', price: 0.612, categories: ['defi'] },
  { name: 'Zcash', symbol: 'ZEC', price: 28.44, categories: ['privacy'] },
  { name: 'Dash', symbol: 'DASH', price: 24.83, categories: ['payments'] },
]

const syllables = ['Nova', 'Zen', 'Pulse', 'Vault', 'Orbit', 'Quanta', 'Nex', 'Flux', 'Ion', 'Cove', 'Aether', 'Byte', 'Drift', 'Ember', 'Halo']
const suffixes = ['Chain', 'Swap', 'Net', 'Protocol', 'Finance', 'DAO', 'Verse', 'Link', 'X', 'Labs']

function generateFillerCoins(count: number): SeedCoin[] {
  const rand = seededRandom(hashSeed('dotmarket-filler-seed'))
  const filler: SeedCoin[] = []
  const cats = ['defi', 'layer1', 'layer2', 'gaming', 'nft', 'meme', 'ai', 'payments']
  for (let i = 0; i < count; i++) {
    const a = syllables[Math.floor(rand() * syllables.length)]
    const b = suffixes[Math.floor(rand() * suffixes.length)]
    const name = `${a}${b}`
    const symbol = (a.slice(0, 2) + b.slice(0, 2)).toUpperCase()
    const magnitude = rand() < 0.3 ? 0.001 + rand() * 0.5 : rand() < 0.7 ? 0.5 + rand() * 20 : 20 + rand() * 200
    filler.push({
      name,
      symbol: `${symbol}${i}`,
      price: magnitude,
      categories: [cats[Math.floor(rand() * cats.length)]],
    })
  }
  return filler
}

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
    categories: seed.categories,
  }
}

const allSeeds = [...seedCoins, ...generateFillerCoins(55)]

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
