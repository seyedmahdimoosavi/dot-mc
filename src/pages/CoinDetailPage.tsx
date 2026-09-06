import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { mockCoins } from '../lib/mockCoins'
import { formatCompactUsd, formatCompactNumber, formatPercent, formatPrice } from '../lib/format'
import { CoinIcon } from '../components/CoinIcon'
import { Sparkline } from '../components/Sparkline'
import { Icon } from '../components/icons/Icon'
import { useWatchlist } from '../lib/WatchlistContext'

const RANGES = ['1H', '1D', '1W', '1M', '1Y', 'ALL'] as const
const EXCHANGES = ['DotSwap', 'Binox', 'Krakenio', 'CoinBridge', 'GateOne']

export function CoinDetailPage() {
  const { slug } = useParams()
  const { t, lang } = useI18n()
  const { isWatched, toggle } = useWatchlist()
  const [range, setRange] = useState<(typeof RANGES)[number]>('1D')
  const [tab, setTab] = useState<'overview' | 'markets' | 'about'>('overview')

  const coin = useMemo(() => mockCoins.find((c) => c.slug === slug), [slug])

  if (!coin) return <Navigate to="/" replace />

  const lastPoint = coin.sparkline[coin.sparkline.length - 1]
  const priceAtPoint = (value: number) => coin.price * (value / lastPoint)
  const yMax = priceAtPoint(Math.max(...coin.sparkline))
  const yMin = priceAtPoint(Math.min(...coin.sparkline))

  return (
    <main className="detail-page">
      <Link className="back-link" to="/">
        ← {t.detail.back}
      </Link>
      <div className="detail-header">
        <div className="detail-title">
          <CoinIcon coin={coin} size={52} />
          <div>
            <div className="breadcrumb">
              {t.nav.cryptocurrencies} / {coin.name}
            </div>
            <h1>
              {coin.name} <span>{coin.symbol}</span>
            </h1>
            <div className="detail-meta">
              <span className="rank-pill">
                #{coin.rank} {t.detail.rank}
              </span>
              <span className="verified">● {t.detail.verified}</span>
            </div>
          </div>
        </div>
        <div className="detail-actions">
          <button className={`watch-button ${isWatched(coin.id) ? 'watched' : ''}`} onClick={() => toggle(coin.id)}>
            <Icon name={isWatched(coin.id) ? 'starFilled' : 'star'} size={16} /> {t.detail.watchlistAdd}
          </button>
          <button className="solid-button">{t.detail.buy}</button>
        </div>
      </div>

      <div className="price-overview">
        <div>
          <span className="label">{t.detail.priceOf(coin.name)}</span>
          <strong>{formatPrice(coin.price, lang)}</strong>
          <span className={coin.change24h >= 0 ? 'positive' : 'negative'}>
            {formatPercent(coin.change24h, lang)} (24h)
          </span>
        </div>
        <div className="detail-metric">
          <span>{t.table.marketCap}</span>
          <strong>{formatCompactUsd(coin.marketCap, lang)}</strong>
        </div>
        <div className="detail-metric">
          <span>{t.table.volume24h}</span>
          <strong>{formatCompactUsd(coin.volume24h, lang)}</strong>
        </div>
        <div className="detail-metric">
          <span>{t.detail.rank}</span>
          <strong>#{coin.rank}</strong>
        </div>
      </div>

      <div className="detail-grid">
        <section className="chart-panel">
          <div className="panel-heading">
            <div>
              <h2>{coin.name} price chart</h2>
              <p>Interactive market overview</p>
            </div>
            <div className="range-tabs">
              {RANGES.map((item) => (
                <button key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="large-chart">
            <Sparkline data={coin.sparkline} positive={coin.change24h >= 0} showGrid />
            <div className="chart-y">
              <span>{formatPrice(yMax, lang)}</span>
              <span>{formatPrice((yMax + yMin) / 2, lang)}</span>
              <span>{formatPrice(yMin, lang)}</span>
            </div>
          </div>
        </section>
        <aside className="about-panel">
          <h2>{t.detail.statsTitle(coin.name)}</h2>
          <div className="stat-list">
            <div>
              <span>{t.detail.high}</span>
              <strong>{formatPrice(coin.allTimeHigh, lang)}</strong>
            </div>
            <div>
              <span>{t.detail.low}</span>
              <strong>{formatPrice(coin.allTimeLow, lang)}</strong>
            </div>
            <div>
              <span>{t.detail.supply}</span>
              <strong>
                {formatCompactNumber(coin.circulatingSupply, lang)} {coin.symbol}
              </strong>
            </div>
            <div>
              <span>{t.detail.max}</span>
              <strong>{coin.maxSupply ? `${formatCompactNumber(coin.maxSupply, lang)} ${coin.symbol}` : '∞'}</strong>
            </div>
            <div>
              <span>{t.detail.fdv}</span>
              <strong>{formatCompactUsd(coin.maxSupply ? coin.maxSupply * coin.price : coin.marketCap, lang)}</strong>
            </div>
          </div>
        </aside>
      </div>

      <section className="detail-tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
          {t.detail.overview}
        </button>
        <button className={tab === 'markets' ? 'active' : ''} onClick={() => setTab('markets')}>
          {t.detail.markets}
        </button>
        <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>
          {t.detail.about}
        </button>
      </section>

      {tab === 'overview' && (
        <div className="detail-content">
          <h2>
            {t.detail.about} {coin.name}
          </h2>
          <p>{t.detail.aboutBody(coin.name)}</p>
        </div>
      )}

      {tab === 'markets' && (
        <div className="detail-content">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exchange</th>
                  <th>Pair</th>
                  <th>{t.table.price}</th>
                  <th>{t.table.volume24h}</th>
                </tr>
              </thead>
              <tbody>
                {EXCHANGES.map((exchange, i) => (
                  <tr key={exchange}>
                    <td className="rank-cell">{i + 1}</td>
                    <td>{exchange}</td>
                    <td>
                      {coin.symbol}/USDT
                    </td>
                    <td className="price-cell">{formatPrice(coin.price * (1 + (i - 2) * 0.0006), lang)}</td>
                    <td>{formatCompactUsd(coin.volume24h / (i + 1.4), lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div className="detail-content">
          <h2>
            {t.detail.about} {coin.name}
          </h2>
          <p>{t.detail.aboutBody(coin.name)}</p>
          <p>{t.footer.disclaimer}</p>
        </div>
      )}
    </main>
  )
}
