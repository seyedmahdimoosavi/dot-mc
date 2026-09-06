import { useI18n } from '../../i18n/I18nContext'
import { formatCompactUsd, formatPercent } from '../../lib/format'
import { globalStats, marketCapSeries } from '../../lib/mockCoins'
import { Sparkline } from '../Sparkline'

export function Hero() {
  const { t, lang } = useI18n()
  return (
    <section className="market-hero">
      <div>
        <p className="eyebrow">
          <span className="spark">✦</span> {t.hero.eyebrow}
        </p>
        <h1>
          {t.hero.titleLine1}
          <br />
          <em>{t.hero.titleLine2Em}</em>
        </h1>
        <p className="hero-copy">{t.hero.copy}</p>
        <div className="hero-stats">
          <div>
            <strong>{formatCompactUsd(globalStats.totalMarketCap, lang)}</strong>
            <span>{t.hero.marketCapLabel}</span>
          </div>
          <div>
            <strong className="positive">{formatPercent(globalStats.marketCapChange24h, lang)}</strong>
            <span>{t.hero.changeLabel}</span>
          </div>
          <div>
            <strong>{formatCompactUsd(globalStats.totalVolume24h, lang)}</strong>
            <span>{t.hero.volumeLabel}</span>
          </div>
        </div>
      </div>
      <div className="hero-chart">
        <div className="chart-top">
          <span>{t.hero.chartTitle}</span>
          <strong>{t.hero.chartSubtitle}</strong>
        </div>
        <Sparkline data={marketCapSeries} positive />
        <div className="chart-labels">
          <span>Aug 08</span>
          <span>Sep 06</span>
        </div>
      </div>
    </section>
  )
}
