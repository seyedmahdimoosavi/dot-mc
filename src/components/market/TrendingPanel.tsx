import { formatPercent, formatPrice } from "../../lib/format";
import { useMemo, useState } from "react";

import type { Coin } from "../../lib/types";
import { CoinIcon } from "../CoinIcon";
import { CoinName } from "../CoinName";
import { Link } from "react-router-dom";
import { Sparkline } from "../Sparkline";
import { mockCoins } from "../../lib/mockCoins";
import useChainlinkTokenPrice from "@/hooks/useChainlinkTokenPrice";
import { useI18n } from "../../i18n/I18nContext";

type TabKey = "trending" | "gainers" | "losers" | "recentlyAdded";

function pickList(coins: Coin[], tab: TabKey): Coin[] {
  switch (tab) {
    case "gainers":
      return [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, 6);

    case "losers":
      return [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, 6);

    case "recentlyAdded":
      return [...coins].sort((a, b) => b.rank - a.rank).slice(0, 6);

    default:
      return [...coins]
        .sort((a, b) => b.volume24h / b.marketCap - a.volume24h / a.marketCap)
        .slice(0, 6);
  }
}

function TrendingCoinCard({
  coin,
  index,
  lang,
}: {
  coin: Coin;
  index: number;
  lang: "en" | "fa";
}) {
  const { data: chainlinkPrice } = useChainlinkTokenPrice(coin.address);

  // Chainlink price اگر موجود باشد،
  // در غیر این صورت قیمت mock استفاده می‌شود.
  const price = chainlinkPrice?.price ?? coin.price;

  return (
    <Link
      className="flex flex-col gap-2 rounded-lg border border-line bg-surface-2 p-3.5 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-(--shadow)"
      to={`/currencies/${coin.slug}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="w-3.5 en shrink-0 text-[13px] text-muted">
          {index + 1}
        </span>

        <CoinIcon coin={coin} size={28} />

        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <CoinName
            name={coin.name}
            as="strong"
            className="text-md en font-semibold"
          />

          <small className="truncate en text-[13px] uppercase text-muted">
            {coin.symbol}
          </small>
        </span>
      </div>

      <Sparkline
        data={coin.sparkline}
        positive={coin.change24h >= 0}
        className="h-11"
      />

      <div className="flex justify-between text-md font-semibold">
        <span>{formatPrice(price, lang)}</span>

        <span className={coin.change24h >= 0 ? "text-green" : "text-red"}>
          {formatPercent(coin.change24h, lang)}
        </span>
      </div>
    </Link>
  );
}

export function TrendingPanel() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TabKey>("trending");

  const list = useMemo(() => pickList(mockCoins, tab), [tab]);

  const tabs: TabKey[] = ["trending", "gainers", "losers", "recentlyAdded"];

  return (
    <section className="px-5 pb-5 pt-1 nav:px-7.5">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          {/* <p className="mb-1.5 font-display text-[10px] font-bold uppercase tracking-[.14em] text-gold">
            {t.filters.trending}
          </p> */}

          <h2 className="font-display text-xl font-bold tracking-[-0.04em] nav:text-2xl">
            {t.trending.title}
          </h2>
        </div>

        <div className="flex flex-wrap gap-1">
          {tabs.map((key) => (
            <button
              key={key}
              className={`rounded-md px-2.75 py-1.75 text-[13px] ${
                tab === key
                  ? "bg-accent text-white"
                  : "bg-transparent text-muted hover:text-ink"
              }`}
              onClick={() => setTab(key)}
            >
              {t.trending.tabs[key]}
            </button>
          ))}
        </div>
      </div>

      <p className="-mt-3.5 mb-5 max-w-160 text-md text-muted">
        {t.trending.subtitle}
      </p>

      <div className="grid grid-cols-1 gap-3.5 min-[431px]:grid-cols-2 min-[801px]:grid-cols-6">
        {list.map((coin, i) => (
          <TrendingCoinCard key={coin.id} coin={coin} index={i} lang={lang} />
        ))}
      </div>
    </section>
  );
}
