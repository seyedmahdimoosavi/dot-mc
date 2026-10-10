import { useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { Hero } from "../components/market/Hero";
import { TrendingPanel } from "../components/market/TrendingPanel";
import { FilterTabs } from "../components/market/FilterTabs";
import { CoinTable } from "../components/market/CoinTable";
import { Pagination } from "../components/market/Pagination";
import { ExchangesTable } from "../components/market/ExchangesTable";
import { ApiNotice } from "@/components/ApiNotice";
import { useDebouncedValue, useMarkets } from "@/hooks/usePricingApi";
import { priceToCoin, type MarketFilters } from "@/lib/pricecatcher";

export function MarketPage() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<MarketFilters>({ sort: "rank", order: "asc", quote: "USD" });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);
  const [mainTab, setMainTab] = useState<"cryptocurrencies" | "exchanges">("cryptocurrencies");
  const debouncedFilters = useDebouncedValue(filters);
  // Reset pagination when filters settle, so every request uses a coherent filter/page combination.
  const [lastFilters, setLastFilters] = useState(debouncedFilters);
  if (lastFilters !== debouncedFilters) {
    setLastFilters(debouncedFilters);
    setPage(1);
  }
  const markets = useMarkets({ ...debouncedFilters, page, page_size: rows }, mainTab === "cryptocurrencies");
  const pageCoins = markets.data?.data.map(item => priceToCoin(item)) ?? [];
  const totalPages = Math.max(1, markets.data?.meta.total_pages ?? 1);
  return (
    <main className="mx-auto w-full">
      <Hero /><TrendingPanel />
      <section className="px-5 pb-21 pt-2.5 nav:px-7.5">
        <div className="mb-5.5 border-b border-line"><div className="flex items-center gap-6">
          {(["cryptocurrencies", "exchanges"] as const).map(tab => <button key={tab} type="button" onClick={() => setMainTab(tab)}
            className={`relative py-3 text-lg font-semibold transition-colors ${mainTab === tab ? "border-b-2 border-gold text-ink" : "text-muted hover:text-ink"}`}>{t.marketTabs[tab]}</button>)}
        </div></div>
        {mainTab === "exchanges" ? <ExchangesTable /> : <>
          <h2 className="mb-5.5 font-display text-xl font-bold tracking-[-0.04em] nav:text-2xl">{t.table.sectionTitle}</h2>
          <FilterTabs filters={filters} onChange={setFilters} />
          <ApiNotice error={markets.error} loading={markets.isLoading} stale={pageCoins.some(coin => coin.stale)} />
          {!markets.isLoading && (!markets.error || pageCoins.length > 0) && <CoinTable coins={pageCoins} quote={debouncedFilters.quote} />}
          <Pagination page={page} totalPages={totalPages} onPage={setPage} rows={rows} onRows={next => { setRows(next); setPage(1); }} />
        </>}
      </section>
    </main>
  );
}
