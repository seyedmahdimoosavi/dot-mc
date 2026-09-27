import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formatPrice } from "../../lib/format";
import { useI18n } from "../../i18n/I18nContext";

const PRICING_API_BASE_URL = "https://pricing.dotone.online/api";

interface ExchangeDetails {
  title: string;
  logo: string | null;
  type: string | null;
  minMarketFeeForUSDT: number | null;
  maxMarketFeeForUSDT: number | null;
}

interface OrderBook {
  exchange: string;
  buy: number | null;
  sell: number | null;
  exchangeDetails: ExchangeDetails;
}

function formatFee(value: number | null, lang: "en" | "fa") {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function ExchangesTable() {
  const { lang, t } = useI18n();
  const [symbol, setSymbol] = useState("BTC");

  const symbolsQuery = useQuery<string[]>({
    queryKey: ["pricing-symbols"],
    staleTime: 5 * 60_000,
    retry: false,
    queryFn: async () => {
      const response = await fetch(`${PRICING_API_BASE_URL}/symbols`);
      if (!response.ok) throw new Error("Could not load symbols.");
      return response.json() as Promise<string[]>;
    },
  });

  const orderBooksQuery = useQuery<OrderBook[]>({
    queryKey: ["pricing-orderbooks", symbol],
    enabled: Boolean(symbol),
    staleTime: 30_000,
    refetchInterval: 120_000,
    refetchIntervalInBackground: true,
    retry: false,
    queryFn: async () => {
      const params = new URLSearchParams({ symbol, pair: "USDT" });
      const response = await fetch(`${PRICING_API_BASE_URL}/orderbooks?${params}`);
      if (!response.ok) throw new Error("Could not load exchange prices.");
      return response.json() as Promise<OrderBook[]>;
    },
  });

  const symbols = (symbolsQuery.data?.length ? symbolsQuery.data : [symbol]).filter(
    (item) => item !== "USDT",
  );
  const isPersian = lang === "fa";
  const firstColumnAlignment = isPersian ? "text-right" : "text-left";
  const remainingColumnAlignment = isPersian ? "text-center" : "text-left";

  return (
    <section aria-labelledby="exchanges-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="exchanges-heading" className="font-display text-xl font-bold tracking-[-0.04em] nav:text-2xl">
            {t.exchanges.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{t.exchanges.subtitle}</p>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
          {t.exchanges.currency}
          <select
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            disabled={symbolsQuery.isLoading || symbolsQuery.isError}
            className="min-w-32 rounded-md border border-line bg-surface px-3 py-2 text-md font-semibold text-ink outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {symbols.map((item) => (
              <option key={item} value={item}>{item}/USDT</option>
            ))}
          </select>
        </label>
      </div>

      {symbolsQuery.isError || orderBooksQuery.isError ? (
        <p className="rounded-md border border-red/30 bg-red-soft px-4 py-3 text-sm text-red">
          {t.exchanges.error}
        </p>
      ) : orderBooksQuery.isLoading ? (
        <p className="py-8 text-center text-sm text-muted">{t.exchanges.loading}</p>
      ) : !orderBooksQuery.data?.length ? (
        <p className="py-8 text-center text-sm text-muted">{t.exchanges.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-220 border-collapse text-md">
            <thead>
              <tr>
                <th className={`whitespace-nowrap px-4 py-3.5 text-[13px] font-medium uppercase tracking-[.04em] text-muted ${firstColumnAlignment}`}>{t.exchanges.exchange}</th>
                <th className={`whitespace-nowrap px-4 py-3.5 text-[13px] font-medium uppercase tracking-[.04em] text-muted ${remainingColumnAlignment}`}>{t.exchanges.type}</th>
                <th className={`whitespace-nowrap px-4 py-3.5 text-[13px] font-medium uppercase tracking-[.04em] text-muted ${remainingColumnAlignment}`}>{t.exchanges.fee}</th>
                <th className={`whitespace-nowrap px-4 py-3.5 text-[13px] font-medium uppercase tracking-[.04em] text-muted ${remainingColumnAlignment}`}>{t.exchanges.buy}</th>
                <th className={`whitespace-nowrap px-4 py-3.5 text-[13px] font-medium uppercase tracking-[.04em] text-muted ${remainingColumnAlignment}`}>{t.exchanges.sell}</th>
              </tr>
            </thead>
            <tbody>
              {orderBooksQuery.data.map((orderBook) => {
                const details = orderBook.exchangeDetails;
                return (
                  <tr key={orderBook.exchange} className="border-t border-line transition-colors hover:bg-surface-2">
                    <td className={`px-4 py-4 ${firstColumnAlignment}`}>
                      <div className="flex items-center gap-3">
                        {details.logo ? (
                          <img
                            src={details.logo}
                            alt=""
                            className="size-9 rounded-full border border-line bg-surface-2 object-contain p-1"
                            loading="lazy"
                          />
                        ) : (
                          <div className="grid size-9 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                            {details.title?.slice(0, 1) || orderBook.exchange.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold">
                          {isPersian ? details.title || orderBook.exchange : orderBook.exchange}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-4 text-muted ${remainingColumnAlignment}`}>{details.type || "—"}</td>
                    <td className={`px-4 py-4 ${remainingColumnAlignment}`}>
                      {formatFee(details.minMarketFeeForUSDT, lang)} – {formatFee(details.maxMarketFeeForUSDT, lang)}
                    </td>
                    <td className={`px-4 py-4 font-semibold text-green ${remainingColumnAlignment}`}>{orderBook.buy === null ? "—" : formatPrice(orderBook.buy, lang)}</td>
                    <td className={`px-4 py-4 font-semibold text-red ${remainingColumnAlignment}`}>{orderBook.sell === null ? "—" : formatPrice(orderBook.sell, lang)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
