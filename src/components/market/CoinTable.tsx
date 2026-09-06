import { Link } from 'react-router-dom'
import type { Coin } from '../../lib/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatCompactUsd, formatCompactNumber, formatPercent, formatPrice } from '../../lib/format'
import { CoinIcon } from '../CoinIcon'
import { Sparkline } from '../Sparkline'
import { Icon } from '../icons/Icon'
import { useWatchlist } from '../../lib/WatchlistContext'

function Change({ value, lang }: { value: number; lang: 'en' | 'fa' }) {
  return <span className={value >= 0 ? 'positive' : 'negative'}>{formatPercent(value, lang)}</span>
}

export function CoinTable({ coins }: { coins: Coin[] }) {
  const { t, lang } = useI18n()
  const { isWatched, toggle } = useWatchlist()

  if (coins.length === 0) {
    return <p className="table-empty">{t.table.noResults}</p>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t.table.rank}</th>
            <th>{t.table.name}</th>
            <th>{t.table.price}</th>
            <th>{t.table.change1h}</th>
            <th>{t.table.change24h}</th>
            <th>{t.table.change7d}</th>
            <th>{t.table.marketCap}</th>
            <th>{t.table.volume24h}</th>
            <th>{t.table.circulatingSupply}</th>
            <th>{t.table.last7d}</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td className="rank-cell">
                <button
                  className={`star-button ${isWatched(coin.id) ? 'watched' : ''}`}
                  onClick={() => toggle(coin.id)}
                  aria-label="Toggle watchlist"
                >
                  <Icon name={isWatched(coin.id) ? 'starFilled' : 'star'} size={13} />
                </button>
                {coin.rank}
              </td>
              <td>
                <Link className="coin-name" to={`/currencies/${coin.slug}`}>
                  <CoinIcon coin={coin} />
                  <span>
                    <strong>{coin.name}</strong>
                    <small>{coin.symbol}</small>
                  </span>
                </Link>
              </td>
              <td className="price-cell">{formatPrice(coin.price, lang)}</td>
              <td>
                <Change value={coin.change1h} lang={lang} />
              </td>
              <td>
                <Change value={coin.change24h} lang={lang} />
              </td>
              <td>
                <Change value={coin.change7d} lang={lang} />
              </td>
              <td>{formatCompactUsd(coin.marketCap, lang)}</td>
              <td>{formatCompactUsd(coin.volume24h, lang)}</td>
              <td>
                {formatCompactNumber(coin.circulatingSupply, lang)} {coin.symbol}
              </td>
              <td className="mini-chart">
                <Sparkline data={coin.sparkline} positive={coin.change7d >= 0} compact />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
