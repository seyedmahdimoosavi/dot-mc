import {
  formatCompactNumber,
  formatCompactUsd,
  formatPercent,
  formatPrice,
} from "../../lib/format";

import type { Coin } from "../../lib/types";
import { CoinIcon } from "../CoinIcon";
import { CoinName } from "../CoinName";
import { Icon } from "../icons/Icon";
import { Link } from "react-router-dom";
import { Sparkline } from "../Sparkline";
import useChainlinkTokenPrice from "@/hooks/useChainlinkTokenPrice";
import { useI18n } from "../../i18n/I18nContext";
import { useWatchlist } from "../../lib/WatchlistContext";

function Change({ value, lang }: { value: number; lang: "en" | "fa" }) {
  return (
    <span className={value >= 0 ? "text-green" : "text-red"}>
      {formatPercent(value, lang)}
    </span>
  );
}

const th =
  "whitespace-nowrap px-2.5 py-4 text-left text-[10px] font-medium uppercase tracking-[.04em] text-muted";

const td = "whitespace-nowrap border-t border-line px-2.5 py-3.5";

type CoinRowProps = {
  coin: Coin;
  isWatched: boolean;
  toggle: (id: string) => void;
  lang: "en" | "fa";
  index: number;
};

function CoinRow({ coin, isWatched, toggle, lang, index }: CoinRowProps) {
  const { data: chainlinkPrice, isLoading: isPriceLoading } =
    useChainlinkTokenPrice(coin.address);
  const price = chainlinkPrice?.price ?? coin.price;

  /*
   * Mock data
   */
  const holdersCount = Math.floor(1000 + index * 1378);

  return (
    <tr className="group hover:bg-surface">
      {/* Rank */}
      <td className={`${td} text-muted`}>
        <div className="flex items-center gap-1.5">
          <button
            className={`grid place-items-center p-0 ${
              isWatched ? "text-gold" : "text-line-2 hover:text-gold"
            }`}
            onClick={() => toggle(coin.id)}
            aria-label="Toggle watchlist"
          >
            <Icon name={isWatched ? "starFilled" : "star"} size={13} />
          </button>

          {index + 1}
        </div>
      </td>

      {/* Token */}
      <td className={td}>
        <Link
          className="flex min-w-0 items-start gap-2.75"
          to={`/currencies/${coin.slug}`}
        >
          <CoinIcon coin={coin} />

          <span className="flex min-w-0 max-w-50 flex-col gap-1">
            <CoinName
              name={coin.name}
              as="strong"
              className="text-xs font-semibold"
            />

            <small className="truncate text-[10px] uppercase text-muted">
              {coin.symbol}
            </small>

            <small className="truncate text-[10px] text-muted">
              {coin.address}
            </small>

            <span className="text-[10px] text-muted">Token</span>
          </span>
        </Link>
      </td>

      {/* Price */}
      <td className={`${td} text-center font-semibold`}>
        {isPriceLoading ? (
          <span className="text-muted">...</span>
        ) : (
          formatPrice(price, lang)
        )}
      </td>

      {/* 1h */}
      <td className={td}>
        <Change value={coin.change1h} lang={lang} />
      </td>

      {/* 24h */}
      <td className={td}>
        <Change value={coin.change24h} lang={lang} />
      </td>

      {/* 7d */}
      <td className={td}>
        <Change value={coin.change7d} lang={lang} />
      </td>

      {/* Market Cap - mock */}
      <td className={td}>{formatCompactUsd(coin.marketCap, lang)}</td>

      {/* Volume 24h - mock */}
      <td className={td}>{formatCompactUsd(coin.volume24h, lang)}</td>

      {/* Circulating Supply - mock */}
      <td className={td}>
        {formatCompactNumber(coin.circulatingSupply, lang)} {coin.symbol}
      </td>

      {/* Holders - mock */}
      <td className={`${td} text-right`}>{holdersCount.toLocaleString()}</td>

      {/* Sparkline */}
      <td className={`${td} w-25`}>
        <Sparkline
          data={coin.sparkline}
          positive={coin.change7d >= 0}
          className="h-8"
        />
      </td>
    </tr>
  );
}

export function CoinTable({ coins }: { coins: Coin[] }) {
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
      <table className="w-full min-w-300 border-collapse text-xs">
        <thead>
          <tr>
            <th className={th}>{t.table.rank}</th>

            <th className={th}>{t.table.name}</th>

            <th className={`${th} text-center`}>{t.table.price}</th>

            <th className={th}>{t.table.change1h}</th>

            <th className={th}>{t.table.change24h}</th>

            <th className={th}>{t.table.change7d}</th>

            <th className={th}>{t.table.marketCap}</th>

            <th className={th}>{t.table.volume24h}</th>

            <th className={th}>{t.table.circulatingSupply}</th>

            <th className={`${th} text-right`}>Holders</th>

            <th className={th}>{t.table.last7d}</th>
          </tr>
        </thead>

        <tbody>
          {coins.map((coin, index) => (
            <CoinRow
              key={coin.id}
              coin={coin}
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
