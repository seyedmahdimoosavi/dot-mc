import { Link } from 'react-router-dom'
import type { Coin } from '../../lib/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatCompactUsd, formatCompactNumber, formatPercent, formatPrice } from '../../lib/format'
import { CoinIcon } from '../CoinIcon'
import { CoinName } from '../CoinName'
import { Sparkline } from '../Sparkline'
import { Icon } from '../icons/Icon'
import { useWatchlist } from '../../lib/WatchlistContext'

function Change({ value, lang }: { value: number; lang: 'en' | 'fa' }) {
  return <span className={value >= 0 ? 'text-green' : 'text-red'}>{formatPercent(value, lang)}</span>
}

const th = 'whitespace-nowrap px-2.5 py-4 text-left text-[10px] font-medium uppercase tracking-[.04em] text-muted'
const td = 'whitespace-nowrap border-t border-line px-2.5 py-3.5'

export function CoinTable({ coins }: { coins: Coin[] }) {
  const { t, lang } = useI18n()
  const { isWatched, toggle } = useWatchlist()

  if (coins.length === 0) {
    return <p className="py-7.5 text-center text-sm text-muted">{t.table.noResults}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-230 border-collapse text-xs">
        <thead>
          <tr>
            <th className={th}>{t.table.rank}</th>
            <th className={th}>{t.table.name}</th>
            <th className={th}>{t.table.price}</th>
            <th className={th}>{t.table.change1h}</th>
            <th className={th}>{t.table.change24h}</th>
            <th className={th}>{t.table.change7d}</th>
            <th className={th}>{t.table.marketCap}</th>
            <th className={th}>{t.table.volume24h}</th>
            <th className={th}>{t.table.circulatingSupply}</th>
            <th className={th}>{t.table.last7d}</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} className="hover:bg-surface">
              <td className={`${td} text-muted`}>
                <div className="flex items-center gap-1.5">
                  <button
                    className={`grid place-items-center p-0 ${isWatched(coin.id) ? 'text-gold' : 'text-line-2 hover:text-gold'}`}
                    onClick={() => toggle(coin.id)}
                    aria-label="Toggle watchlist"
                  >
                    <Icon name={isWatched(coin.id) ? 'starFilled' : 'star'} size={13} />
                  </button>
                  {coin.rank}
                </div>
              </td>
              <td className={td}>
                <Link className="flex min-w-0 items-center gap-2.75" to={`/currencies/${coin.slug}`}>
                  <CoinIcon coin={coin} />
                  <span className="flex min-w-0 max-w-40 flex-col gap-0.5">
                    <CoinName name={coin.name} as="strong" className="text-xs font-semibold" />
                    <small className="truncate text-[10px] uppercase text-muted">{coin.symbol}</small>
                  </span>
                </Link>
              </td>
              <td className={`${td} font-semibold`}>{formatPrice(coin.price, lang)}</td>
              <td className={td}>
                <Change value={coin.change1h} lang={lang} />
              </td>
              <td className={td}>
                <Change value={coin.change24h} lang={lang} />
              </td>
              <td className={td}>
                <Change value={coin.change7d} lang={lang} />
              </td>
              <td className={td}>{formatCompactUsd(coin.marketCap, lang)}</td>
              <td className={td}>{formatCompactUsd(coin.volume24h, lang)}</td>
              <td className={td}>
                {formatCompactNumber(coin.circulatingSupply, lang)} {coin.symbol}
              </td>
              <td className={`${td} w-25`}>
                <Sparkline data={coin.sparkline} positive={coin.change7d >= 0} className="h-8" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
