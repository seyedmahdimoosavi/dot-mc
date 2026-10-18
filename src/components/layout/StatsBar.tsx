import { formatCompactUsd, formatPercent } from "../../lib/format";

import { useBitcoin } from "@/hooks/useBitcoin";
import { useI18n } from "../../i18n/I18nContext";
import { useMarkets } from "@/hooks/usePricingApi";
import { useOrderBooks } from "@/hooks/useExchangeMarketData";

function Sep() {
  return <span className="h-3 w-px shrink-0 bg-line" />;
}

export function StatsBar() {
  const { t, lang } = useI18n();
  const { coin: bitcoin } = useBitcoin();
  // Share the default market-list query; its pagination metadata includes the coin count.
  const symbolsQuery = useMarkets({
    sort: "rank",
    order: "asc",
    quote: "USD",
    page: 1,
    page_size: 20,
  });
  const orderBooksQuery = useOrderBooks("BTC", "USDT");
  const fees = (orderBooksQuery.data ?? [])
    .flatMap((orderBook) => [
      orderBook.exchangeDetails.minMarketFeeForUSDT,
      orderBook.exchangeDetails.maxMarketFeeForUSDT,
    ])
    .filter((fee): fee is number => fee !== null && Number.isFinite(fee));
  const minFee = fees.length ? Math.min(...fees) : null;
  const maxFee = fees.length ? Math.max(...fees) : null;
  const formatFee = (fee: number | null) =>
    fee === null
      ? "—"
      : `${new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
          maximumFractionDigits: 2,
        }).format(fee)}%`;

  return (
    <div
      className="w-full min-w-0 overflow-x-auto overscroll-x-contain border-b border-line bg-surface px-4"
      role="region"
      aria-label={lang === "fa" ? "آمار بازار" : "Market statistics"}
      tabIndex={0}
    >
      <div className="mx-auto flex w-max min-w-full items-center justify-center gap-3.5 whitespace-nowrap py-2.5 text-[13px] text-muted sm:px-6 [&>span]:shrink-0">
        <span>
          <strong className="font-bold text-ink">
            {symbolsQuery.data?.meta.total.toLocaleString(
              lang === "fa" ? "fa-IR" : "en-US",
            ) ?? "—"}
          </strong>{" "}
          {t.statsBar.cryptos}
        </span>
        <Sep />
        <span>
          <strong className="font-bold text-ink">
            {orderBooksQuery.data?.length?.toLocaleString() ?? "—"}
          </strong>{" "}
          {t.statsBar.exchanges}
        </span>
        <Sep />
        <span>
          {t.statsBar.marketCap}:{" "}
          <strong className="font-bold text-ink">
            {bitcoin ? formatCompactUsd(bitcoin.marketCap, lang) : "—"}
          </strong>{" "}
          <em className="text-green not-italic">
            {bitcoin ? formatPercent(bitcoin.change24h, lang) : "—"}
          </em>
        </span>
        <Sep />
        <span>
          {t.statsBar.volume24h}:{" "}
          <strong className="font-bold text-ink">
            {bitcoin ? formatCompactUsd(bitcoin.volume24h, lang) : "—"}
          </strong>
        </span>
        <Sep />
        <span>
          {t.statsBar.gas}:{" "}
          <strong className="font-bold text-ink">
            {formatFee(minFee)} – {formatFee(maxFee)}
          </strong>
        </span>
      </div>
    </div>
  );
}
