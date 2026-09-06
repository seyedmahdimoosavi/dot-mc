import type { Coin } from '../lib/types'

export function CoinIcon({ coin, size }: { coin: Coin; size?: number }) {
  const style = size ? { background: coin.color, width: size, height: size, fontSize: size * 0.5 } : { background: coin.color }
  return (
    <span className="coin-icon" style={style}>
      {coin.symbol.slice(0, 1)}
    </span>
  )
}
