import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/I18nContext'
import { mockCoins } from '../../lib/mockCoins'
import { formatPercent, formatPrice } from '../../lib/format'
import { CoinIcon } from '../CoinIcon'
import { Sparkline } from '../Sparkline'
import type { Coin } from '../../lib/types'

type TabKey = 'trending' | 'gainers' | 'losers' | 'recentlyAdded'

function pickList(coins: Coin[], tab: TabKey): Coin[] {
  switch (tab) {
    case 'gainers':
      return [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, 6)
    case 'losers':
      return [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, 6)
    case 'recentlyAdded':
      return [...coins].sort((a, b) => b.rank - a.rank).slice(0, 6)
    default:
      return [...coins].sort((a, b) => b.volume24h / b.marketCap - a.volume24h / a.marketCap).slice(0, 6)
  }
}

export function TrendingPanel() {
  const { t, lang } = useI18n()
  const [tab, setTab] = useState<TabKey>('trending')
  const list = useMemo(() => pickList(mockCoins, tab), [tab])

  const tabs: TabKey[] = ['trending', 'gainers', 'losers', 'recentlyAdded']

  return (
    <section className="trending-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.filters.trending}</p>
          <h2>{t.trending.title}</h2>
        </div>
        <div className="trending-tabs">
          {tabs.map((key) => (
            <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
              {t.trending.tabs[key]}
            </button>
          ))}
        </div>
      </div>
      <p className="trending-subtitle">{t.trending.subtitle}</p>
      <div className="trending-grid">
        {list.map((coin, i) => (
          <Link className="trending-card" to={`/currencies/${coin.slug}`} key={coin.id}>
            <div className="trending-card-top">
              <span className="trending-index">{i + 1}</span>
              <CoinIcon coin={coin} size={28} />
              <span className="trending-name">
                <strong>{coin.name}</strong>
                <small>{coin.symbol}</small>
              </span>
            </div>
            <Sparkline data={coin.sparkline} positive={coin.change24h >= 0} compact className="trending-spark" />
            <div className="trending-card-bottom">
              <span>{formatPrice(coin.price, lang)}</span>
              <span className={coin.change24h >= 0 ? 'positive' : 'negative'}>{formatPercent(coin.change24h, lang)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
