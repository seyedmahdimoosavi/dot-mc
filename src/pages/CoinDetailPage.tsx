import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { mockCoins } from '../lib/mockCoins'
import { formatCompactUsd, formatCompactNumber, formatPercent, formatPrice } from '../lib/format'
import { CoinIcon } from '../components/CoinIcon'
import { CoinName } from '../components/CoinName'
import { Sparkline } from '../components/Sparkline'
import { Icon } from '../components/icons/Icon'
import { Button } from '../components/ui/button'
import { useWatchlist } from '../lib/WatchlistContext'

const RANGES = ['1H', '1D', '1W', '1M', '1Y', 'ALL'] as const
const EXCHANGES = ['DotSwap', 'Binox', 'Krakenio', 'CoinBridge', 'GateOne']

const th = 'whitespace-nowrap px-2.5 py-4 text-left text-[10px] font-medium uppercase tracking-[.04em] text-muted'
const td = 'whitespace-nowrap border-t border-line px-2.5 py-3.5'

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
    <main className="mx-auto max-w-310 px-5 pb-20 pt-6.5 nav:px-7.5">
      <Link className="mb-8 inline-block text-xs text-muted hover:text-ink" to="/">
        ← {t.detail.back}
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <CoinIcon coin={coin} size={52} className="text-2xl" />
          <div className="min-w-0">
            <div className="mb-1.5 text-[11px] text-muted">
              {t.nav.cryptocurrencies} / {coin.name}
            </div>
            <h1 className="flex items-baseline gap-1.75 font-display text-[26px] font-bold tracking-[-0.04em] nav:text-[30px]">
              <CoinName name={coin.name} as="span" className="max-w-70" />
              <span className="text-sm font-medium text-muted">{coin.symbol}</span>
            </h1>
            <div className="mt-2 flex items-center gap-2.5 text-[10px]">
              <span className="rounded-sm bg-accent-soft px-1.5 py-1">
                #{coin.rank} {t.detail.rank}
              </span>
              <span className="text-green">● {t.detail.verified}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            className={isWatched(coin.id) ? 'text-gold' : ''}
            onClick={() => toggle(coin.id)}
          >
            <Icon name={isWatched(coin.id) ? 'starFilled' : 'star'} size={16} className={isWatched(coin.id) ? 'text-gold' : 'text-line-2'} />
            {t.detail.watchlistAdd}
          </Button>
          <Button variant="solid">{t.detail.buy}</Button>
        </div>
      </div>

      <div className="mt-8.5 grid grid-cols-2 gap-5 border-y border-line py-6 nav:grid-cols-[2fr_repeat(3,1fr)]">
        <div className="col-span-2 flex flex-col gap-1.5 border-b border-line pb-4 nav:col-span-1 nav:border-b-0 nav:border-e nav:pb-0">
          <span className="text-[10px] text-muted">{t.detail.priceOf(coin.name)}</span>
          <strong className="font-display text-2xl font-bold">{formatPrice(coin.price, lang)}</strong>
          <span className={coin.change24h >= 0 ? 'text-green' : 'text-red'}>
            {formatPercent(coin.change24h, lang)} (24h)
          </span>
        </div>
        <div className="flex flex-col gap-1.5 nav:ps-5">
          <span className="text-[10px] text-muted">{t.table.marketCap}</span>
          <strong className="text-base font-semibold">{formatCompactUsd(coin.marketCap, lang)}</strong>
        </div>
        <div className="flex flex-col gap-1.5 nav:ps-5">
          <span className="text-[10px] text-muted">{t.table.volume24h}</span>
          <strong className="text-base font-semibold">{formatCompactUsd(coin.volume24h, lang)}</strong>
        </div>
        <div className="flex flex-col gap-1.5 nav:ps-5">
          <span className="text-[10px] text-muted">{t.detail.rank}</span>
          <strong className="text-base font-semibold">#{coin.rank}</strong>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 nav:grid-cols-[1.65fr_1fr]">
        <section className="rounded-lg border border-line bg-surface-2 p-5.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold">
                <CoinName name={`${coin.name} price chart`} as="span" className="max-w-70" />
              </h2>
              <p className="mt-1 text-[11px] text-muted">Interactive market overview</p>
            </div>
            <div className="flex gap-0.75">
              {RANGES.map((item) => (
                <button
                  key={item}
                  className={`rounded px-2 py-1.25 text-[10px] ${range === item ? 'bg-accent-soft text-ink' : 'text-muted'}`}
                  onClick={() => setRange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mt-5.5 pe-12.5">
            <Sparkline data={coin.sparkline} positive={coin.change24h >= 0} showGrid className="h-62.5" />
            <div className="absolute inset-y-0 inset-e-0 flex flex-col justify-between text-end text-[9px] text-muted">
              <span>{formatPrice(yMax, lang)}</span>
              <span>{formatPrice((yMax + yMin) / 2, lang)}</span>
              <span>{formatPrice(yMin, lang)}</span>
            </div>
          </div>
        </section>
        <aside className="rounded-lg border border-line bg-surface-2 p-5.5">
          <h2 className="font-display text-base font-semibold">
            <CoinName name={t.detail.statsTitle(coin.name)} as="span" className="max-w-70" />
          </h2>
          <div className="my-5">
            <div className="flex justify-between border-b border-line py-3 text-[11px]">
              <span className="text-muted">{t.detail.high}</span>
              <strong className="font-semibold">{formatPrice(coin.allTimeHigh, lang)}</strong>
            </div>
            <div className="flex justify-between border-b border-line py-3 text-[11px]">
              <span className="text-muted">{t.detail.low}</span>
              <strong className="font-semibold">{formatPrice(coin.allTimeLow, lang)}</strong>
            </div>
            <div className="flex justify-between border-b border-line py-3 text-[11px]">
              <span className="text-muted">{t.detail.supply}</span>
              <strong className="font-semibold">
                {formatCompactNumber(coin.circulatingSupply, lang)} {coin.symbol}
              </strong>
            </div>
            <div className="flex justify-between border-b border-line py-3 text-[11px]">
              <span className="text-muted">{t.detail.max}</span>
              <strong className="font-semibold">
                {coin.maxSupply ? `${formatCompactNumber(coin.maxSupply, lang)} ${coin.symbol}` : '∞'}
              </strong>
            </div>
            <div className="flex justify-between border-b border-line py-3 text-[11px]">
              <span className="text-muted">{t.detail.fdv}</span>
              <strong className="font-semibold">
                {formatCompactUsd(coin.maxSupply ? coin.maxSupply * coin.price : coin.marketCap, lang)}
              </strong>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-10 flex gap-6 overflow-x-auto border-b border-line">
        <button
          className={`whitespace-nowrap py-3.25 text-xs ${tab === 'overview' ? 'border-b-2 border-gold text-ink' : 'text-muted'}`}
          onClick={() => setTab('overview')}
        >
          {t.detail.overview}
        </button>
        <button
          className={`whitespace-nowrap py-3.25 text-xs ${tab === 'markets' ? 'border-b-2 border-gold text-ink' : 'text-muted'}`}
          onClick={() => setTab('markets')}
        >
          {t.detail.markets}
        </button>
        <button
          className={`whitespace-nowrap py-3.25 text-xs ${tab === 'about' ? 'border-b-2 border-gold text-ink' : 'text-muted'}`}
          onClick={() => setTab('about')}
        >
          {t.detail.about}
        </button>
      </section>

      {tab === 'overview' && (
        <div className="max-w-190 py-7">
          <h2 className="font-display text-base font-semibold">
            {t.detail.about} {coin.name}
          </h2>
          <p className="mt-3 text-[13px] leading-[1.9] text-muted">{t.detail.aboutBody(coin.name)}</p>
        </div>
      )}

      {tab === 'markets' && (
        <div className="py-7">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className={th}>#</th>
                  <th className={th}>Exchange</th>
                  <th className={th}>Pair</th>
                  <th className={th}>{t.table.price}</th>
                  <th className={th}>{t.table.volume24h}</th>
                </tr>
              </thead>
              <tbody>
                {EXCHANGES.map((exchange, i) => (
                  <tr key={exchange}>
                    <td className={`${td} text-muted`}>{i + 1}</td>
                    <td className={td}>{exchange}</td>
                    <td className={td}>{coin.symbol}/USDT</td>
                    <td className={`${td} font-semibold`}>{formatPrice(coin.price * (1 + (i - 2) * 0.0006), lang)}</td>
                    <td className={td}>{formatCompactUsd(coin.volume24h / (i + 1.4), lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div className="max-w-190 py-7">
          <h2 className="font-display text-base font-semibold">
            {t.detail.about} {coin.name}
          </h2>
          <p className="mt-3 text-[13px] leading-[1.9] text-muted">{t.detail.aboutBody(coin.name)}</p>
          <p className="mt-3 text-[13px] leading-[1.9] text-muted">{t.footer.disclaimer}</p>
        </div>
      )}
    </main>
  )
}
