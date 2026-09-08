import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { mockCoins } from "../lib/mockCoins";
import type { Coin } from "../lib/types";
import { Hero } from "../components/market/Hero";
import { TrendingPanel } from "../components/market/TrendingPanel";
import {
  FilterTabs,
  type CategoryFilter,
  type SortMode,
} from "../components/market/FilterTabs";
import { CoinTable } from "../components/market/CoinTable";
import { Pagination } from "../components/market/Pagination";

function sortCoins(coins: Coin[], mode: SortMode): Coin[] {
  const list = [...coins];
  switch (mode) {
    case "trending":
      return list.sort(
        (a, b) => b.volume24h / b.marketCap - a.volume24h / a.marketCap,
      );
    case "gainersLosers":
      return list.sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h));
    case "recentlyAdded":
      return list.sort((a, b) => b.rank - a.rank);
    case "mostVisited":
      return list.sort((a, b) => b.volume24h - a.volume24h);
    default:
      return list.sort((a, b) => a.rank - b.rank);
  }
}

export function MarketPage() {
  const { t } = useI18n();
  const [sortMode, setSortMode] = useState<SortMode>("top");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);

  function updateSortMode(mode: SortMode) {
    setSortMode(mode);
    setPage(1);
  }
  function updateCategory(next: CategoryFilter) {
    setCategory(next);
    setPage(1);
  }
  function updateQuery(next: string) {
    setQuery(next);
    setPage(1);
  }
  function updateRows(next: number) {
    setRows(next);
    setPage(1);
  }

  const filtered = useMemo(() => {
    let list = mockCoins;
    if (category !== "all")
      list = list.filter((c) => c.categories.includes(category));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) =>
        `${c.name} ${c.symbol}`.toLowerCase().includes(q),
      );
    }
    return sortCoins(list, sortMode);
  }, [category, query, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rows));
  const pageCoins = filtered.slice((page - 1) * rows, page * rows);

  return (
    <main className="mx-auto w-full sm:w-11/12 md:w-10/12 3xl:max-w-310">
      <Hero />
      <TrendingPanel />
      <section className="px-5 pb-21 pt-2.5 nav:px-7.5">
        <div className="mb-5.5 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-1.5 font-display text-[10px] font-bold uppercase tracking-[.14em] text-gold">
              {t.table.sectionEyebrow}
            </p>
            <h2 className="font-display text-xl font-bold tracking-[-0.04em] nav:text-2xl">
              {t.table.sectionTitle}
            </h2>
          </div>
        </div>
        <FilterTabs
          sortMode={sortMode}
          onSortMode={updateSortMode}
          category={category}
          onCategory={updateCategory}
          query={query}
          onQuery={updateQuery}
        />
        <CoinTable coins={pageCoins} />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={setPage}
          rows={rows}
          onRows={updateRows}
        />
      </section>
    </main>
  );
}
