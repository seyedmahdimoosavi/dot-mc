import { Check, Copy } from "lucide-react";
import {
  formatQuotedCompact,
  formatPercent,
  formatQuotedPrice,
} from "../../lib/format";

import type { Coin } from "../../lib/types";
import { CoinIcon } from "../CoinIcon";
import { CoinName } from "../CoinName";
import { Icon } from "../icons/Icon";
import { Link } from "react-router-dom";
import { Sparkline } from "../Sparkline";
import { useI18n } from "../../i18n/I18nContext";
import type { Quote } from "@/lib/pricecatcher";
import { useState } from "react";
import { useWatchlist } from "../../lib/WatchlistContext";

function Change({ value, lang }: { value: number; lang: "en" | "fa" }) {
  return (
    <span className={!Number.isFinite(value) ? "text-muted" : value >= 0 ? "text-green" : "text-red"}>
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
    <tr className="group hover:bg-surface" title={coin.stale ? (lang === "fa" ? "داده به‌روز نیست" : "Stale data") : undefined}>
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
          to={`/currencies/${coin.slug}`}
        >
          <CoinIcon coin={coin} />

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
            {coin.address && <div className="flex min-w-0 items-center gap-1">
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
            </div>}

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
      <td className={`${td} ${end} w-25`}>
        <Sparkline
          data={coin.sparkline}
          timestamps={coin.sparklineTimestamps}
          positive={coin.change7d >= 0}
          className="h-8"
        />
      </td>
    </tr>
  );
}

export function CoinTable({ coins, quote }: { coins: Coin[]; quote?: Quote }) {
  const { t, lang } = useI18n();
  const { isWatched, toggle } = useWatchlist();

  if (coins.length === 0) {
    return (
      <p className="py-7.5 text-center text-sm text-muted">
        {t.table.noResults}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-300 border-collapse text-md">
        <thead>
          <tr>
            <th className={`${th} ${start}`}>{t.table.rank}</th>

            <th className={`${th} ${middle}`}>{t.table.name}</th>

            <th className={`${th} ${middle}`}>{t.table.price}</th>

            <th className={`${th} ${middle}`}>{t.table.change1h}</th>

            <th className={`${th} ${middle}`}>{t.table.change24h}</th>

            <th className={`${th} ${middle}`}>{t.table.change7d}</th>

            <th className={`${th} ${middle}`}>{t.table.marketCap}</th>

            <th className={`${th} ${middle}`}>{t.table.volume24h}</th>

            <th className={`${th} ${end}`}>{t.table.last7d}</th>
          </tr>
        </thead>

        <tbody>
          {coins.map((coin, index) => (
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
