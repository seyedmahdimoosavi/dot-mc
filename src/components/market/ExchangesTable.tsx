import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId, useState } from "react";
import {
  useOrderBooks,
  usePricingSymbols,
} from "@/hooks/useExchangeMarketData";

import { ShoppingCart } from "lucide-react";
import bitbankLogo from "@/assets/bitbank-logo.png";
import { useI18n } from "../../i18n/I18nContext";

const COIN_API_IMAGE_URL =
  import.meta.env.VITE_COIN_API_IMAGE_URL || "https://pricing.dotone.online";

function formatFee(value: number | null, lang: "en" | "fa") {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
    maximumFractionDigits: 4,
  }).format(value)}%`;
}

// I want to refresh project on vercel

function formatMarketPrice(value: number, lang: "en" | "fa") {
  const digits =
    value >= 1
      ? 2
      : value >= 0.01
        ? 4
        : Math.min(
            18,
            Math.max(8, Math.ceil(-Math.log10(Math.abs(value))) + 4),
          );

  return new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function ExchangesTable({ fixedSymbol }: { fixedSymbol?: string }) {
  const { lang, t } = useI18n();
  const headingId = useId();
  const [selectedSymbol, setSymbol] = useState("BTC");
  const symbol =
    fixedSymbol === undefined
      ? selectedSymbol
      : fixedSymbol.trim().toUpperCase();
  const [selectedPair, setPair] = useState<"USDT" | "TMN">(
    fixedSymbol === undefined ? "USDT" : "TMN",
  );
  const pair =
    fixedSymbol !== undefined && symbol === "USDT" ? "TMN" : selectedPair;
  const availablePairs: ("USDT" | "TMN")[] =
    symbol === "USDT" ? ["TMN"] : ["USDT", "TMN"];

  const symbolsQuery = usePricingSymbols(fixedSymbol === undefined);
  const orderBooksQuery = useOrderBooks(symbol, pair);
  const orderBooks = orderBooksQuery.data ?? [];
  const nobitex = orderBooks.find((item) => item.exchange === "nobitex");
  const displayedOrderBooks = nobitex
    ? [
        ...orderBooks.filter((item) => item.exchange !== "bitbank"),
        {
          exchange: "bitbank",
          buy: nobitex.buy,
          sell: nobitex.sell,
          exchangeDetails: {
            title: "بیت بانک",
            logo: bitbankLogo,
            type: nobitex.exchangeDetails.type,
            minMarketFeeForUSDT: 0.0035,
            maxMarketFeeForUSDT: 0.004,
          },
        },
      ]
    : orderBooks;

  const symbols = (
    symbolsQuery.data?.length ? symbolsQuery.data : [symbol]
  ).filter((item) => item !== pair);
  const isPersian = lang === "fa";
  const firstColumnAlignment = isPersian ? "text-right" : "text-left";
  const remainingColumnAlignment = isPersian ? "text-center" : "text-left";

  return (
    <section aria-labelledby={headingId}>
      <div
        className="mb-5 flex scroll-mt-24 flex-wrap items-end justify-between gap-4"
        id={fixedSymbol === undefined ? "cex" : undefined}
      >
        <div>
          <h2
            id={headingId}
            className="font-display text-xl font-semibold tracking-[-0.01em] nav:text-2xl"
          >
            {t.exchanges.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{t.exchanges.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {fixedSymbol === undefined ? (
            <>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
                {t.exchanges.currency}
                <Select
                  value={symbol}
                  onValueChange={(value) => value && setSymbol(value)}
                  disabled={symbolsQuery.isLoading || symbolsQuery.isError}
                >
                  <SelectTrigger className="h-10 w-38 min-w-38 border-line bg-surface-2 px-3 text-md font-semibold text-ink shadow-sm transition-all duration-200 hover:border-accent focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20">
                    <SelectValue className="truncate pe-2" />
                  </SelectTrigger>
                  <SelectContent className="border-line bg-surface-2 text-ink shadow-(--shadow) duration-200">
                    {symbols.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="cursor-pointer px-3 py-2 text-md text-left data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
                {t.exchanges.marketBase}
                <Select
                  value={pair}
                  onValueChange={(value) =>
                    value && setPair(value as "USDT" | "TMN")
                  }
                >
                  <SelectTrigger className="h-10 w-38 min-w-38 border-line bg-surface-2 px-3 text-md font-semibold text-ink shadow-sm transition-all duration-200 hover:border-accent focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20">
                    <SelectValue className="truncate pe-2" />
                  </SelectTrigger>
                  <SelectContent className="border-line bg-surface-2 text-ink shadow-(--shadow) duration-200">
                    <SelectItem
                      value="USDT"
                      className="cursor-pointer px-3 py-2 text-md data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink"
                    >
                      USDT
                    </SelectItem>
                    <SelectItem
                      value="TMN"
                      className="cursor-pointer px-3 py-2 text-md data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink"
                    >
                      TMN
                    </SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </>
          ) : (
            <div className="flex flex-col gap-1.5 text-sm font-medium text-muted">
              <span>{t.exchanges.marketBase}</span>
              <div
                className="flex gap-1 rounded-md border border-line bg-surface-2 p-1"
                role="group"
                aria-label={t.exchanges.marketBase}
              >
                {availablePairs.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={pair === value}
                    onClick={() => setPair(value)}
                    className={`en rounded-md px-4 py-2 text-sm font-semibold transition-colors ${pair === value ? "bg-accent text-accent-ink" : "text-muted hover:bg-accent-soft hover:text-ink"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {(fixedSymbol === undefined && symbolsQuery.isError) ||
      orderBooksQuery.isError ? (
        <p className="rounded-md border border-red/30 bg-red-soft px-4 py-3 text-sm text-red">
          {t.exchanges.error}
        </p>
      ) : orderBooksQuery.isLoading ? (
        <p className="py-8 text-center text-sm text-muted">
          {t.exchanges.loading}
        </p>
      ) : !orderBooksQuery.data?.length ? (
        <p className="py-8 text-center text-sm text-muted">
          {t.exchanges.empty}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface-2">
          <table className="w-full min-w-220 border-collapse text-md">
            <thead>
              <tr>
                <th
                  className={`whitespace-nowrap bg-table-head px-4 py-3 text-[12px] font-semibold uppercase tracking-[.08em] text-muted ${firstColumnAlignment}`}
                >
                  {t.exchanges.exchange}
                </th>
                <th
                  className={`whitespace-nowrap bg-table-head px-4 py-3 text-[12px] font-semibold uppercase tracking-[.08em] text-muted ${remainingColumnAlignment}`}
                >
                  {t.exchanges.type}
                </th>
                <th
                  className={`whitespace-nowrap bg-table-head px-4 py-3 text-[12px] font-semibold uppercase tracking-[.08em] text-muted ${remainingColumnAlignment}`}
                >
                  {t.exchanges.minFee}
                </th>
                <th
                  className={`whitespace-nowrap bg-table-head px-4 py-3 text-[12px] font-semibold uppercase tracking-[.08em] text-muted ${remainingColumnAlignment}`}
                >
                  {t.exchanges.maxFee}
                </th>
                <th
                  className={`whitespace-nowrap bg-table-head px-4 py-3 text-[12px] font-semibold uppercase tracking-[.08em] text-muted ${remainingColumnAlignment}`}
                >
                  {t.exchanges.buy}
                </th>
                <th
                  className={`whitespace-nowrap bg-table-head px-4 py-3 text-[12px] font-semibold uppercase tracking-[.08em] text-muted ${remainingColumnAlignment}`}
                >
                  {t.exchanges.sell}
                </th>
                <th
                  aria-label={t.exchanges.actions}
                  className="w-12 px-4 py-3.5"
                />
              </tr>
            </thead>
            <tbody>
              {displayedOrderBooks.map((orderBook) => {
                const details = orderBook.exchangeDetails;
                return (
                  <tr
                    key={orderBook.exchange}
                    className="border-t border-line transition-colors hover:bg-accent-soft/40"
                  >
                    <td className={`px-4 py-4 ${firstColumnAlignment}`}>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            orderBook.exchange === "bitbank"
                              ? bitbankLogo
                              : COIN_API_IMAGE_URL +
                                orderBook.exchangeDetails.logo
                          }
                          alt=""
                          className="size-9 rounded-full border border-line bg-surface-2 object-contain p-1"
                          loading="lazy"
                          onError={(event) => {
                            const image = event.currentTarget;
                            if (image.dataset.webpFallbackApplied) {
                              image.style.visibility = "hidden";
                              return;
                            }
                            image.dataset.webpFallbackApplied = "true";
                            image.src = image.src.replace(
                              /\.webp(?=$|\?)/i,
                              ".png",
                            );
                          }}
                        />
                        <span className="font-semibold">
                          {isPersian
                            ? details.title || orderBook.exchange
                            : orderBook.exchange}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-4 text-muted ${remainingColumnAlignment}`}
                    >
                      {details.type || "—"}
                    </td>
                    <td className={`px-4 py-4 ${remainingColumnAlignment}`}>
                      {formatFee(details.minMarketFeeForUSDT, lang)}
                    </td>
                    <td className={`px-4 py-4 ${remainingColumnAlignment}`}>
                      {formatFee(details.maxMarketFeeForUSDT, lang)}
                    </td>
                    <td
                      className={`px-4 py-4 font-semibold text-green ${remainingColumnAlignment}`}
                    >
                      {orderBook.buy === null
                        ? "—"
                        : formatMarketPrice(orderBook.buy, lang)}
                    </td>
                    <td
                      className={`px-4 py-4 font-semibold text-red ${remainingColumnAlignment}`}
                    >
                      {orderBook.sell === null
                        ? "—"
                        : formatMarketPrice(orderBook.sell, lang)}
                    </td>
                    <td className="px-4 py-4 text-center text-muted">
                      <ShoppingCart
                        className="mx-auto size-4.5"
                        aria-hidden="true"
                      />
                    </td>
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
