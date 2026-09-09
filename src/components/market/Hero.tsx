import { formatCompactUsd, formatPercent } from "../../lib/format";
import { globalStats, marketCapSeries } from "../../lib/mockCoins";

import { Sparkline } from "../Sparkline";
import { getOneMonthDateRange } from "@/hooks/lastMonthDate";
import { useI18n } from "../../i18n/I18nContext";

export function Hero() {
  const { t, lang } = useI18n();
  const { from, to } = getOneMonthDateRange();
  return (
    <section className="grid gap-10 px-5 py-11 nav:grid-cols-[1fr_1.1fr] nav:items-center nav:gap-15 nav:px-7.5 nav:py-14">
      <div>
        {/* <p className="mb-3.5 flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[.14em] text-gold">
          <span className="text-sm">✦</span> {t.hero.eyebrow}
        </p> */}
        <h1 className="font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.06em] nav:text-[58px]">
          {t.hero.titleLine1}
          <br />
          <em className="not-italic text-green">{t.hero.titleLine2Em}</em>
        </h1>
        <p className="my-5.5 max-w-95 text-sm leading-[1.8] text-muted">
          {t.hero.copy}
        </p>
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-0.5">
            <strong className="font-display text-lg font-bold">
              {formatCompactUsd(globalStats.totalMarketCap, lang)}
            </strong>
            <span className="text-[10px] text-muted">
              {t.hero.marketCapLabel}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="font-display text-lg font-bold text-green">
              {formatPercent(globalStats.marketCapChange24h, lang)}
            </strong>
            <span className="text-[10px] text-muted">{t.hero.changeLabel}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="font-display text-lg font-bold">
              {formatCompactUsd(globalStats.totalVolume24h, lang)}
            </strong>
            <span className="text-[10px] text-muted">{t.hero.volumeLabel}</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-surface-2 px-6 pb-4 pt-5.5 shadow-(--shadow)">
        <div className="flex justify-between text-[11px] text-muted">
          <span>{t.hero.chartTitle}</span>
          <strong className="font-medium">{t.hero.chartSubtitle}</strong>
        </div>
        <Sparkline data={marketCapSeries} positive className="mt-5.5 h-55" />
        <div className="mt-0.5 flex justify-between text-[11px] text-muted">
          <span>{from}</span>
          <span>{to}</span>
        </div>
      </div>
    </section>
  );
}
