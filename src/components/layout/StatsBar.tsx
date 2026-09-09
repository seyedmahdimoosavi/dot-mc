import { formatCompactUsd, formatPercent } from "../../lib/format";

import { globalStats } from "../../lib/mockCoins";
import { useI18n } from "../../i18n/I18nContext";

function Sep() {
  return <span className="h-3 w-px shrink-0 bg-line" />;
}

export function StatsBar() {
  const { t, lang } = useI18n();
  return (
    <div className="overflow-x-auto border-b border-line bg-surface">
      <div className="mx-auto flex max-w-310 items-center gap-3.5 whitespace-nowrap px-6 py-2.5 text-[13px] text-muted justify-center">
        <span>
          <strong className="font-bold text-ink">
            {globalStats.cryptoCount.toLocaleString()}
          </strong>{" "}
          {t.statsBar.cryptos}
        </span>
        <Sep />
        <span>
          <strong className="font-bold text-ink">
            {globalStats.exchangeCount.toLocaleString()}
          </strong>{" "}
          {t.statsBar.exchanges}
        </span>
        <Sep />
        <span>
          {t.statsBar.marketCap}:{" "}
          <strong className="font-bold text-ink">
            {formatCompactUsd(globalStats.totalMarketCap, lang)}
          </strong>{" "}
          <em className="text-green not-italic">
            {formatPercent(globalStats.marketCapChange24h, lang)}
          </em>
        </span>
        <Sep />
        <span>
          {t.statsBar.volume24h}:{" "}
          <strong className="font-bold text-ink">
            {formatCompactUsd(globalStats.totalVolume24h, lang)}
          </strong>
        </span>
        <Sep />
        <span>
          {t.statsBar.dominance}:{" "}
          <strong className="font-bold text-ink">
            BTC {globalStats.btcDominance.toFixed(1)}%
          </strong>{" "}
          <strong className="font-bold text-ink">
            ETH {globalStats.ethDominance.toFixed(1)}%
          </strong>
        </span>
        <Sep />
        <span>
          ⛽ {t.statsBar.gas}:{" "}
          <strong className="font-bold text-ink">
            {globalStats.gasGwei} Gwei
          </strong>
        </span>
      </div>
    </div>
  );
}
