import { formatCompactUsd, formatPercent } from "../../lib/format";
import { useBitcoin } from "@/hooks/useBitcoin";
import {
  useOrderBooks,
} from "@/hooks/useExchangeMarketData";
import { useI18n } from "../../i18n/I18nContext";
import { useMarkets } from "@/hooks/usePricingApi";

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
    <div className="overflow-x-auto border-b border-line bg-surface">
      <div className="mx-auto flex max-w-310 items-center justify-center gap-3.5 whitespace-nowrap px-6 py-2.5 text-[13px] text-muted">
        <span>
          <strong className="font-bold text-ink">
            {symbolsQuery.data?.meta.total.toLocaleString(lang === "fa" ? "fa-IR" : "en-US") ?? "—"}
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
