import { Check, Copy } from "lucide-react";
import type { MarketSort, Quote } from "@/lib/pricecatcher";
import {
  formatPercent,
  formatQuotedCompact,
  formatQuotedPrice,
} from "../../lib/format";

import type { Coin } from "../../lib/types";
import { CoinIcon } from "../CoinIcon";
import { CoinName } from "../CoinName";
import { Icon } from "../icons/Icon";
import { Link } from "react-router-dom";
import { Sparkline } from "../Sparkline";
import { useI18n } from "../../i18n/I18nContext";
import { useState } from "react";
import { useWatchlist } from "../../lib/WatchlistContext";

function Change({ value, lang }: { value: number; lang: "en" | "fa" }) {
  return (
    <span
      className={
        !Number.isFinite(value)
          ? "text-muted"
          : value >= 0
            ? "text-green"
            : "text-red"
      }
    >
      {formatPercent(value, lang)}
    </span>
  );
}

const th =
  "whitespace-nowrap px-2.5 py-4 text-[14px] font-medium uppercase tracking-[.04em] text-muted";

const td = "whitespace-nowrap border-t border-line px-2.5 py-3.5 text-[14px]";
const start = "text-start";
const middle = "text-center";
const end = "text-end";

type CoinRowProps = {
  coin: Coin;
  isWatched: boolean;
  toggle: (id: string) => void;
  lang: "en" | "fa";
  index: number;
  quote?: Quote;
};

function CoinRow({
  coin,
  isWatched,
  toggle,
  lang,
  quote = "USD",
}: CoinRowProps) {
  /*
   * Copy address state
   */
  const [copied, setCopied] = useState(false);

  const shortAddress =
    coin.address.length > 10
      ? `${coin.address.slice(0, 6)}...${coin.address.slice(-4)}`
      : coin.address;

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(coin.address);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  return (
    <tr
      className="group hover:bg-surface"
      title={
        coin.stale
          ? lang === "fa"
            ? "داده به‌روز نیست"
            : "Stale data"
          : undefined
      }
    >
      {/* Rank */}
      <td className={`${td} ${start} text-muted`}>
        <div className="flex en items-center gap-1.5">
          <button
            className={`grid place-items-center p-0 ${
              isWatched ? "text-gold" : "text-line-2 hover:text-gold"
            }`}
            onClick={() => toggle(coin.id)}
            aria-label="Toggle watchlist"
          >
            <Icon name={isWatched ? "starFilled" : "star"} size={16} />
          </button>

          {Number.isFinite(coin.rank) ? coin.rank : "—"}
        </div>
      </td>

      {/* Token */}
      <td className={`${td} ${middle}`}>
        <Link
          className="flex min-w-0 items-start gap-1.5"
          to={`/currencies/${coin.id}/${coin.symbol}`}
        >
          <CoinIcon coin={coin} transparent />

          <span className="flex min-w-0 max-w-50 flex-col gap-1">
            <CoinName
              name={coin.name}
              as="strong"
              className="text-md en font-semibold"
            />

            <small className="truncate en text-md uppercase text-muted">
              {coin.symbol}
            </small>

            {/* Address + Copy */}
            {coin.address && (
              <div className="flex min-w-0 items-center gap-1">
                <span
                  className="truncate en text-md text-muted"
                  title={coin.address}
                >
                  {shortAddress}
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 text-muted transition-colors hover:text-primary"
                  title={copied ? "Copied" : "Copy address"}
                  aria-label={copied ? "Address copied" : "Copy address"}
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </div>
            )}

            {/* <span className="text-[10px] text-muted">Token</span> */}
          </span>
        </Link>
      </td>

      {/* Price */}
      <td className={`${td} ${middle} font-semibold`}>
        {formatQuotedPrice(coin.price, quote, lang)}
      </td>

      {/* 1h */}
      <td className={`${td} ${middle}`}>
        <Change value={coin.change1h} lang={lang} />
      </td>

      {/* 24h */}
      <td className={`${td} ${middle}`}>
        <Change value={coin.change24h} lang={lang} />
      </td>

      {/* 7d */}
      <td className={`${td} ${middle}`}>
        <Change value={coin.change7d} lang={lang} />
      </td>

      {/* Market Cap */}
      <td className={`${td} ${middle}`}>
        {formatQuotedCompact(coin.marketCap, quote, lang)}
      </td>

      {/* Volume 24h */}
      <td className={`${td} ${middle}`}>
        {formatQuotedCompact(coin.volume24h, quote, lang)}
      </td>

      {/* Sparkline (7d) */}
      <td className={`${td} ${end} min-w-[120px]`}>
        {coin.sparkline.some(
          (value) => value !== null && Number.isFinite(value),
        ) ? (
          <Sparkline
            data={coin.sparkline}
            timestamps={coin.sparklineTimestamps}
            trimEmptyEdges
            positive={coin.change7d >= 0}
            className="h-8 min-w-[100px]"
          />
        ) : (
          <span className="en flex h-8 min-w-[100px] items-center justify-center text-sm text-muted">
            No Data
          </span>
        )}
      </td>
    </tr>
  );
}

export function CoinTable({
  coins,
  quote,
  sort = "rank",
  order = "asc",
  onSort,
  loading = false,
}: {
  coins: Coin[];
  quote?: Quote;
  sort?: MarketSort;
  order?: "asc" | "desc";
  onSort?: (sort: MarketSort) => void;
  loading?: boolean;
}) {
  const { t, lang } = useI18n();
  const { isWatched, toggle } = useWatchlist();
  const columns: { key: MarketSort; label: string }[] = [
    { key: "rank", label: t.table.rank },
    { key: "name", label: t.table.name },
    { key: "price", label: t.table.price },
    { key: "change_1h", label: t.table.change1h },
    { key: "change_24h", label: t.table.change24h },
    { key: "change_7d", label: t.table.change7d },
    { key: "market_cap", label: t.table.marketCap },
    { key: "volume_24h", label: t.table.volume24h },
  ];

  if (coins.length === 0 && !loading) {
    return (
      <p className="py-7.5 text-center text-sm text-muted">
        {t.table.noResults}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full min-w-300 border-collapse text-md"
        aria-busy={loading}
      >
        <thead>
          <tr>
            {columns.map((column) => {
              const disabled =
                !onSort ||
                (quote === "IRR" &&
                  !["rank", "name", "price"].includes(column.key));
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={`${th} ${column.key === "rank" ? start : middle}`}
                  aria-sort={
                    sort === column.key
                      ? order === "desc"
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSort?.(column.key)}
                    className={`inline-flex items-center gap-1 disabled:cursor-default disabled:opacity-50 ${sort === column.key ? "text-ink" : "hover:text-ink"}`}
                  >
                    {column.label}
                    {sort === column.key && (
                      <span aria-hidden="true">
                        {order === "desc" ? "↓" : "↑"}
                      </span>
                    )}
                  </button>
                </th>
              );
            })}

            <th className={`${th} ${end}`}>{t.table.last7d}</th>
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: 10 }, (_, index) => (
                <tr key={`skeleton-${index}`} aria-hidden="true">
                  <td className={`${td} ${start}`}>
                    <div className="h-4 w-10 animate-pulse rounded bg-line motion-reduce:animate-none" />
                  </td>
                  <td className={td}>
                    <div className="flex items-center gap-1.5">
                      <div className="size-8 shrink-0 animate-pulse rounded-full bg-line motion-reduce:animate-none" />
                      <div className="flex flex-col gap-1">
                        <div className="h-4 w-28 animate-pulse rounded bg-line motion-reduce:animate-none" />
                        <div className="h-3.5 w-12 animate-pulse rounded bg-line motion-reduce:animate-none" />
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 6 }, (_, cell) => (
                    <td key={cell} className={`${td} ${middle}`}>
                      <div
                        className={`mx-auto h-4 animate-pulse rounded bg-line motion-reduce:animate-none ${cell >= 4 ? "w-20" : "w-16"}`}
                      />
                    </td>
                  ))}
                  <td className={`${td} ${end} min-w-[120px]`}>
                    <div className="h-8 min-w-[100px] animate-pulse rounded bg-line motion-reduce:animate-none" />
                  </td>
                </tr>
              ))
            : coins.map((coin, index) => (
                <CoinRow
                  key={coin.id}
                  coin={coin}
                  quote={quote}
                  index={index}
                  isWatched={isWatched(coin.id)}
                  toggle={toggle}
                  lang={lang}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
}
