import { formatPercent, formatPrice } from "../../lib/format";
import { useState } from "react";

import type { Coin } from "../../lib/types";
import { CoinIcon } from "../CoinIcon";
import { CoinName } from "../CoinName";
import { Link } from "react-router-dom";
import { Sparkline } from "../Sparkline";
import { useMarkets } from "@/hooks/usePricingApi";
import { priceToCoin } from "@/lib/pricecatcher";
import { ApiNotice } from "@/components/ApiNotice";
import { useI18n } from "../../i18n/I18nContext";

type TabKey = "trending" | "gainers" | "losers" | "recentlyAdded";

function TrendingCoinCard({
  coin,
  index,
  lang,
}: {
  coin: Coin;
  index: number;
  lang: "en" | "fa";
}) {

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
        timestamps={coin.sparklineTimestamps}
        positive={coin.change24h >= 0}
        className="h-11"
      />

      <div className="flex justify-between text-md font-semibold">
        <span>{formatPrice(coin.price, lang)}</span>

        <span className={coin.change24h >= 0 ? "text-green" : "text-red"}>
          {formatPercent(coin.change24h, lang)}
        </span>
      </div>
    </Link>
  );
}

export function TrendingPanel() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TabKey>("gainers");

  const markets = useMarkets({ sort: "change_24h", order: tab === "losers" ? "asc" : "desc", page_size: 6 });
  const list = markets.data?.data.map(item => priceToCoin(item)) ?? [];

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
              className={`rounded-md px-2.75 py-1.75 text-[13px] disabled:opacity-35 ${
                tab === key
                  ? "bg-accent text-white"
                  : "bg-transparent text-muted hover:text-ink"
              }`}
              disabled={key === "trending" || key === "recentlyAdded"}
              title={key === "trending" || key === "recentlyAdded" ? t.detail.unavailable : undefined}
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

      <ApiNotice error={markets.error} loading={markets.isLoading} stale={list.some(coin => coin.stale)} />
      <div className="grid grid-cols-1 gap-3.5 min-[431px]:grid-cols-2 min-[801px]:grid-cols-6">
        {list.map((coin, i) => (
          <TrendingCoinCard key={coin.id} coin={coin} index={i} lang={lang} />
        ))}
      </div>
    </section>
  );
}
