import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";
import { Hero } from "../components/market/Hero";
import { TrendingPanel } from "../components/market/TrendingPanel";
import { FilterTabs } from "../components/market/FilterTabs";
import { CoinTable } from "../components/market/CoinTable";
import { Pagination } from "../components/market/Pagination";
import { ExchangesTable } from "../components/market/ExchangesTable";
import { useDebouncedValue, useMarkets } from "@/hooks/usePricingApi";
import { priceToCoin, type MarketFilters } from "@/lib/pricecatcher";
import { PoolsExplorer } from "@/features/pools/PoolsExplorer";

type MarketTab = "cryptocurrencies" | "dexExchanges" | "cexExchanges";

function tabFromHash(hash: string): MarketTab | undefined {
  if (hash === "#dex") return "dexExchanges";
  if (hash === "#cex") return "cexExchanges";
  return undefined;
}

export function MarketPage() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<MarketFilters>({
    sort: "rank",
    order: "asc",
    quote: "USD",
  });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(20);
  const [mainTab, setMainTab] = useState<MarketTab>(
    () => tabFromHash(location.hash) ?? "cryptocurrencies",
  );
  const [lastLocationKey, setLastLocationKey] = useState(location.key);
  if (lastLocationKey !== location.key) {
    setLastLocationKey(location.key);
    const requestedTab = tabFromHash(location.hash);
    if (requestedTab) setMainTab(requestedTab);
  }

  useEffect(() => {
    if (!tabFromHash(location.hash)) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key]);
  const debouncedFilters = useDebouncedValue(filters);
  // Reset pagination when filters settle, so every request uses a coherent filter/page combination.
  const [lastFilters, setLastFilters] = useState(debouncedFilters);
  if (lastFilters !== debouncedFilters) {
    setLastFilters(debouncedFilters);
    setPage(1);
  }
  const markets = useMarkets(
    { ...debouncedFilters, page, page_size: rows },
    mainTab === "cryptocurrencies",
  );
  const pageCoins = markets.data?.data.map((item) => priceToCoin(item)) ?? [];
  const totalPages = Math.max(1, markets.data?.meta.total_pages ?? 1);
  return (
    <main className="mx-auto w-full">
      <Hero />
      <TrendingPanel />
      <section className="px-5 pb-21 pt-2.5 nav:px-7.5">
        <div className="mb-5.5 overflow-x-auto border-b border-line">
          <div className="flex w-max min-w-full items-center gap-6">
            {(
              ["cryptocurrencies", "dexExchanges", "cexExchanges"] as const
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMainTab(tab);
                  if (tabFromHash(location.hash)) {
                    navigate({ pathname: location.pathname, search: location.search }, { replace: true });
                  }
                }}
                className={`relative whitespace-nowrap py-3 text-lg font-semibold transition-colors ${mainTab === tab ? "border-b-2 border-gold text-ink" : "text-muted hover:text-gold"}`}
              >
                {t.marketTabs[tab]}
              </button>
            ))}
          </div>
        </div>
        {mainTab === "cexExchanges" ? (
          <ExchangesTable />
        ) : mainTab === "dexExchanges" ? (
          <>
            <PoolsExplorer
              onOpenSwap={({ network, tokenA, tokenB }) => {
                window.alert(
                  `Connect your swap route: ${network} — ${tokenA.symbol}/${tokenB.symbol}`,
                );
              }}
            />
          </>
        ) : (
          <>
            <h2 className="mb-5.5 font-display text-xl font-semibold tracking-[-0.01em] nav:text-2xl">
              {t.table.sectionTitle}
            </h2>
            <FilterTabs filters={filters} onChange={setFilters} />
            {(markets.isFetching || !markets.error || pageCoins.length > 0) && (
              <CoinTable
                coins={pageCoins}
                loading={markets.isFetching}
                quote={debouncedFilters.quote}
                sort={filters.sort}
                order={filters.order}
                onSort={(sort) => {
                  setFilters((current) => ({
                    ...current,
                    sort,
                    order:
                      current.sort === sort && current.order === "desc"
                        ? "asc"
                        : "desc",
                  }));
                }}
              />
            )}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPage={setPage}
              rows={rows}
              onRows={(next) => {
                setRows(next);
                setPage(1);
              }}
            />
          </>
        )}
      </section>
    </main>
  );
}
