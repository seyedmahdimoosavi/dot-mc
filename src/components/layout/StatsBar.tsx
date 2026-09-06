import { useI18n } from '../../i18n/I18nContext'
import { formatCompactUsd, formatPercent } from '../../lib/format'
import { globalStats } from '../../lib/mockCoins'

export function StatsBar() {
  const { t, lang } = useI18n()
  return (
    <div className="stats-bar">
      <div className="stats-bar-inner">
        <span>
          <strong>{globalStats.cryptoCount.toLocaleString()}</strong> {t.statsBar.cryptos}
        </span>
        <span className="stats-sep" />
        <span>
          <strong>{globalStats.exchangeCount.toLocaleString()}</strong> {t.statsBar.exchanges}
        </span>
        <span className="stats-sep" />
        <span>
          {t.statsBar.marketCap}: <strong>{formatCompactUsd(globalStats.totalMarketCap, lang)}</strong>{' '}
          <em className="positive">{formatPercent(globalStats.marketCapChange24h, lang)}</em>
        </span>
        <span className="stats-sep" />
        <span>
          {t.statsBar.volume24h}: <strong>{formatCompactUsd(globalStats.totalVolume24h, lang)}</strong>
        </span>
        <span className="stats-sep" />
        <span>
          {t.statsBar.dominance}: <strong>BTC {globalStats.btcDominance.toFixed(1)}%</strong>{' '}
          <strong>ETH {globalStats.ethDominance.toFixed(1)}%</strong>
        </span>
        <span className="stats-sep" />
        <span>
          ⛽ {t.statsBar.gas}: <strong>{globalStats.gasGwei} Gwei</strong>
        </span>
      </div>
    </div>
  )
}
