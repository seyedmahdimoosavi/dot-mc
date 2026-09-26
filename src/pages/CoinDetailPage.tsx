import { Check, Copy, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  formatCompactNumber,
  formatCompactUsd,
  formatPercent,
  formatPrice,
} from "../lib/format";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "../components/ui/button";
import { CoinIcon } from "../components/CoinIcon";
import { CoinName } from "../components/CoinName";
import { Icon } from "../components/icons/Icon";
import { Sparkline } from "../components/Sparkline";
import { mockCoins } from "../lib/mockCoins";
import { useI18n } from "../i18n/I18nContext";
import { useLiveCoin } from "@/hooks/useLiveCoin";
import { useWatchlist } from "../lib/WatchlistContext";

const RANGES = ["1H", "1D", "1W", "1M", "1Y", "ALL"] as const;

function StatRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-3 text-[13px] last:border-b-0">
      <span className="text-muted">{label}</span>
      <strong className="font-semibold">{children}</strong>
    </div>
  );
}

function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export function CoinDetailPage() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const { isWatched, toggle } = useWatchlist();
  const [range, setRange] = useState<(typeof RANGES)[number]>("1D");
  const [tab, setTab] = useState<"overview" | "markets" | "about">("overview");

  const [copied, setCopied] = useState(false);

  const baseCoin = useMemo(
    () => mockCoins.find((c) => c.slug === slug),
    [slug],
  );
  const { coin, marketData, isLoading: isPriceLoading } = useLiveCoin(baseCoin);

  if (!coin) return <Navigate to="/" replace />;

  const address = marketData && "contract_address" in marketData
    ? marketData.contract_address
    : coin.address;
  const shortAddress = address
    ? address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address
    : null;
  const rank = marketData ? marketData.market_cap_rank : coin.rank;
  const change24h = marketData ? marketData.price_change_percentage_24h : coin.change24h;
  const marketCap = marketData ? marketData.market_cap : coin.marketCap;
  const volume24h = marketData ? marketData.total_volume : coin.volume24h;
  const circulatingSupply = marketData ? marketData.circulating_supply : coin.circulatingSupply;
  const maxSupply = marketData ? marketData.max_supply : coin.maxSupply;
  const ath = marketData ? marketData.ath : coin.allTimeHigh;
  const atl = marketData ? marketData.atl : coin.allTimeLow;
  const fdv = marketData ? marketData.fully_diluted_valuation : coin.fully_diluted_valuation;
  const unavailable = t.detail.unavailable;
  const money = (value: number | null | undefined) =>
    value == null || !Number.isFinite(value) ? unavailable : formatCompactUsd(value, lang);
  const price = (value: number | null | undefined) =>
    value == null || !Number.isFinite(value) ? unavailable : formatPrice(value, lang);
  const percent = (value: number | null | undefined) =>
    value == null || !Number.isFinite(value) ? unavailable : formatPercent(value, lang);
  const supply = (value: number | null | undefined) =>
    value == null || !Number.isFinite(value)
      ? unavailable
      : `${formatCompactNumber(value, lang)} ${coin.symbol}`;
  const date = (value: string | null | undefined) => {
    if (!value || Number.isNaN(Date.parse(value))) return unavailable;
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", {
      dateStyle: "medium",
      timeStyle: value.includes("T") ? "short" : undefined,
    }).format(new Date(value));
  };
  const links = marketData?.links;
  const linkGroups = [
    { label: t.detail.website, urls: links?.homepage },
    { label: t.detail.whitepaper, urls: [links?.whitepaper] },
    { label: t.detail.explorer, urls: links?.blockchain_site },
    { label: t.detail.forum, urls: links?.official_forum_url },
    { label: t.detail.community, urls: links?.chat_url },
    { label: t.detail.announcements, urls: links?.announcement_url },
    { label: t.detail.snapshot, urls: [links?.snapshot_url] },
    { label: "X", urls: links?.twitter_screen_name ? [`https://x.com/${encodeURIComponent(links.twitter_screen_name.replace(/^@/, ""))}`] : [] },
    { label: "Facebook", urls: links?.facebook_username ? [`https://www.facebook.com/${encodeURIComponent(links.facebook_username)}`] : [] },
    { label: "Telegram", urls: links?.telegram_channel_identifier ? [`https://t.me/${encodeURIComponent(links.telegram_channel_identifier.replace(/^@/, ""))}`] : [] },
    { label: "Reddit", urls: [links?.subreddit_url] },
    { label: "Bitcointalk", urls: links?.bitcointalk_thread_identifier != null ? [`https://bitcointalk.org/index.php?topic=${links.bitcointalk_thread_identifier}`] : [] },
    { label: "GitHub", urls: links?.repos_url?.github },
    { label: "Bitbucket", urls: links?.repos_url?.bitbucket },
  ].map((group) => ({
    label: group.label,
    urls: [...new Set((group.urls ?? []).map((url) => safeUrl(url)).filter((url): url is string => url !== null))],
  })).filter((group) => group.urls.length > 0);

  const handleCopy = async () => {
    try {
      if (!address) return;
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const lastPoint = coin.sparkline[coin.sparkline.length - 1];
  const priceAtPoint = (value: number) => coin.price * (value / lastPoint);
  const yMax = priceAtPoint(Math.max(...coin.sparkline));
  const yMin = priceAtPoint(Math.min(...coin.sparkline));
  return (
    <main className="mx-auto max-w-310 px-5 pb-20 pt-6.5 nav:px-7.5">
      <Link
        className="mb-8 inline-block text-md text-muted hover:text-ink"
        to="/"
      >
        ← {t.detail.back}
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <CoinIcon coin={coin} size={52} className="text-2xl" />
          <div className="min-w-0">
            <div className="mb-1.5 text-[13px] text-muted">
              {t.nav.cryptocurrencies} / {coin.name}
            </div>
            <h1 className="flex items-baseline gap-1.75 font-display text-[26px] font-bold tracking-[-0.04em] nav:text-[30px]">
              <CoinName name={coin.name} as="span" className="max-w-70" />
              <span className="text-sm font-medium text-muted">
                {coin.symbol}
              </span>
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[12px]">
              {rank != null && (
                <span className="rounded-sm bg-accent-soft px-1.5 py-1">
                  #{rank} {t.detail.rank}
                </span>
              )}
              {!marketData && coin.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-sm bg-accent-soft px-1.5 py-1 capitalize"
                >
                  {category}
                </span>
              ))}
            </div>
            {shortAddress && (
              <div className="mt-2 flex items-center gap-1 text-[12px] text-muted">
                <span>{t.detail.address}:</span>
                <span className="en" title={address ?? undefined}>{shortAddress}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 text-muted transition-colors hover:text-primary"
                  title={copied ? "Copied" : "Copy address"}
                  aria-label={copied ? "Address copied" : "Copy address"}
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            className={isWatched(coin.id) ? "text-gold" : ""}
            onClick={() => toggle(coin.id)}
          >
            <Icon
              name={isWatched(coin.id) ? "starFilled" : "star"}
              size={16}
              className={isWatched(coin.id) ? "text-gold" : "text-line-2"}
            />
            {t.detail.watchlistAdd}
          </Button>
          <Button variant="solid">{t.detail.buy}</Button>
        </div>
      </div>

      <div className="mt-8.5 grid grid-cols-2 gap-5 border-y border-line py-6 nav:grid-cols-[2fr_repeat(3,1fr)]">
        <div className="col-span-2 flex flex-col gap-1.5 border-b border-line pb-4 nav:col-span-1 nav:border-b-0 nav:border-e nav:pb-0">
          <span className="text-[12px] text-muted">
            {t.detail.priceOf(coin.name)}
          </span>
          <strong className="font-display text-2xl font-bold">
            {isPriceLoading ? (
              <span className="text-muted">...</span>
            ) : (
              price(marketData ? marketData.current_price : coin.price)
            )}
          </strong>
          <span className={change24h == null ? "text-muted" : change24h >= 0 ? "text-green" : "text-red"}>
            {percent(change24h)} (24h)
          </span>
        </div>
        <div className="flex flex-col gap-1.5 nav:ps-5">
          <span className="text-[12px] text-muted">{t.table.marketCap}</span>
          <strong className="text-base font-semibold">
            {money(marketCap)}
          </strong>
        </div>
        <div className="flex flex-col gap-1.5 nav:ps-5">
          <span className="text-[12px] text-muted">{t.table.volume24h}</span>
          <strong className="text-base font-semibold">
            {money(volume24h)}
          </strong>
        </div>
        <div className="flex flex-col gap-1.5 nav:ps-5">
          <span className="text-[12px] text-muted">{t.detail.rank}</span>
          <strong className="text-base font-semibold">{rank == null ? unavailable : `#${rank}`}</strong>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 nav:grid-cols-[1.65fr_1fr]">
        <section className="rounded-lg border border-line bg-surface-2 p-5.5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold">
                <CoinName
                  name={`${coin.name} price chart`}
                  as="span"
                  className="max-w-70"
                />
              </h2>
              {!marketData && <p className="mt-1 text-[13px] text-muted">Interactive market overview</p>}
            </div>
            {!marketData && (
              <div className="flex gap-0.75">
                {RANGES.map((item) => (
                  <button
                    key={item}
                    className={`rounded px-2 py-1.25 text-[12px] ${range === item ? "bg-accent-soft text-ink" : "text-muted"}`}
                    onClick={() => setRange(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          {marketData ? (
            <p className="mt-5.5 grid h-62.5 place-items-center text-center text-md text-muted">
              {t.detail.noHistory}
            </p>
          ) : (
            <div className="relative mt-5.5 pe-12.5">
              <Sparkline
                data={coin.sparkline}
                positive={coin.change24h >= 0}
                showGrid
                className="h-62.5"
              />
              <div className="absolute inset-y-0 inset-e-0 flex flex-col justify-between text-end text-[9px] text-muted">
                <span>{formatPrice(yMax, lang)}</span>
                <span>{formatPrice((yMax + yMin) / 2, lang)}</span>
                <span>{formatPrice(yMin, lang)}</span>
              </div>
            </div>
          )}
        </section>
        <aside className="rounded-lg border border-line bg-surface-2 p-5.5">
          <h2 className="font-display text-base font-semibold">
            <CoinName
              name={t.detail.statsTitle(coin.name)}
              as="span"
              className="max-w-70"
            />
          </h2>
          <div className="my-5">
            <StatRow label={t.detail.high}>{price(ath)}</StatRow>
            <StatRow label={t.detail.athDate}>{date(marketData?.ath_date)}</StatRow>
            <StatRow label={t.detail.low}>{price(atl)}</StatRow>
            <StatRow label={t.detail.atlDate}>{date(marketData?.atl_date)}</StatRow>
            <StatRow label={t.detail.dayHigh}>{marketData?.high_24h ? price(marketData.high_24h) : unavailable}</StatRow>
            <StatRow label={t.detail.dayLow}>{marketData?.low_24h ? price(marketData.low_24h) : unavailable}</StatRow>
            <StatRow label={t.detail.supply}>{supply(circulatingSupply)}</StatRow>
            <StatRow label={t.detail.totalSupply}>{supply(marketData?.total_supply)}</StatRow>
            <StatRow label={t.detail.max}>{supply(maxSupply)}</StatRow>
            <StatRow label={t.detail.fdv}>{money(fdv)}</StatRow>
          </div>
        </aside>
      </div>

      <section className="mt-10 flex gap-6 overflow-x-auto border-b border-line">
        <button
          className={`whitespace-nowrap py-3.25 text-md ${tab === "overview" ? "border-b-2 border-gold text-ink" : "text-muted"}`}
          onClick={() => setTab("overview")}
        >
          {t.detail.overview}
        </button>
        <button
          className={`whitespace-nowrap py-3.25 text-md ${tab === "markets" ? "border-b-2 border-gold text-ink" : "text-muted"}`}
          onClick={() => setTab("markets")}
        >
          {t.detail.markets}
        </button>
        <button
          className={`whitespace-nowrap py-3.25 text-md ${tab === "about" ? "border-b-2 border-gold text-ink" : "text-muted"}`}
          onClick={() => setTab("about")}
        >
          {t.detail.about}
        </button>
      </section>

      {tab === "overview" && (
        <div className="grid gap-8 py-7 nav:grid-cols-2">
          <section>
            <h2 className="font-display text-base font-semibold">{t.detail.overview}</h2>
            <div className="mt-3">
              <StatRow label={t.detail.dayPriceChange}>
                {price(marketData?.price_change_24h_in_currency ?? marketData?.price_change_24h)}
              </StatRow>
              <StatRow label={t.detail.dayMarketCapChange}>
                {money(marketData?.market_cap_change_24h_in_currency ?? marketData?.market_cap_change_24h)}
              </StatRow>
              <StatRow label={t.detail.dayMarketCapChangePercent}>
                {percent(marketData?.market_cap_change_percentage_24h)}
              </StatRow>
              <StatRow label={t.detail.updated}>{date(marketData?.last_updated)}</StatRow>
            </div>
          </section>
          <section>
            <h2 className="font-display text-base font-semibold">{t.detail.about} {coin.name}</h2>
            <p className="mt-3 text-[13px] leading-[1.9] text-muted">{t.detail.noDescription}</p>
          </section>
        </div>
      )}

      {tab === "markets" && (
        <p className="py-7 text-md text-muted">{t.detail.noMarkets}</p>
      )}

      {tab === "about" && (
        <div className="grid gap-8 py-7 nav:grid-cols-2">
          <section>
            <h2 className="font-display text-base font-semibold">{t.detail.about} {coin.name}</h2>
            <div className="mt-3">
              <StatRow label={t.detail.platform}>{marketData?.asset_platform_id || unavailable}</StatRow>
              <StatRow label={t.detail.address}>
                <span className="en break-all" title={address ?? undefined}>{address || unavailable}</span>
              </StatRow>
              <StatRow label={t.detail.decimals}>{marketData?.decimal_place ?? unavailable}</StatRow>
              <StatRow label={t.detail.genesisDate}>{date(marketData?.genesis_date)}</StatRow>
              <StatRow label={t.detail.blockTime}>
                {marketData?.block_time_in_minutes || unavailable}
              </StatRow>
            </div>
          </section>
          <section>
            <h2 className="font-display text-base font-semibold">{t.detail.links}</h2>
            {linkGroups.length === 0 ? (
              <p className="mt-3 text-[13px] text-muted">{unavailable}</p>
            ) : (
              <div className="mt-3 space-y-4">
                {linkGroups.map(({ label, urls }) => (
                  <div key={label}>
                    <h3 className="mb-1.5 text-[13px] text-muted">{label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {urls.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={url}
                          className="inline-flex max-w-full items-center gap-1 truncate rounded-md border border-line px-2.5 py-1.5 text-[13px] text-ink hover:bg-accent-soft"
                        >
                          <span className="truncate en">{new URL(url).hostname}</span>
                          <ExternalLink size={13} className="shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
