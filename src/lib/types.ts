export interface Coin {
  id: string
  rank: number
  name: string
  symbol: string
  slug: string
  price: number
  change1h: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  maxSupply: number | null
  fully_diluted_valuation: number | null
  allTimeHigh: number
  allTimeLow: number
  sparkline: (number | null)[]
  sparklineTimestamps?: number[]
  stale?: boolean
  fetchedAt?: string
  color: string
  logo: string
  address: string
  categories: string[]
}
