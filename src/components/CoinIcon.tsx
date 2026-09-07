import type { Coin } from '../lib/types'
import { cn } from '@/lib/utils'

export function CoinIcon({ coin, size = 32, className }: { coin: Coin; size?: number; className?: string }) {
  return (
    <span
      className={cn('grid shrink-0 place-items-center rounded-full font-display font-bold text-white', className)}
      style={{ background: coin.color, width: size, height: size, fontSize: size * 0.5 }}
    >
      {coin.symbol.slice(0, 1)}
    </span>
  )
}
