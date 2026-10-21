import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Search } from "lucide-react";

import { TokenAvatar } from "@/components/TokenAvatar";
import { WDOTO } from "@/data/contracts/addresses";
import { LIFI_NETWORKS, type SwapNetwork } from "@/config/networks";
import type {
  BscPool,
  Pool,
  TokenInfo,
  V2PoolSelection,
  V3PoolInfo,
  V3PoolSelection,
} from "@/domain/types";
import { CURATED_TOKENS } from "@/domain/tokens";
import { feeToPercent, sqrtPriceToPrice } from "@/domain/v3-math";
import { useBscPools } from "@/hooks/useBscPools";
import { useNetworkPools } from "@/hooks/useNetworkPools";
import { useV2Pools } from "@/hooks/useV2Pools";
import { useV3Pools } from "@/hooks/useV3Pools";
import {
  addressUrl,
  formatCompact,
  shortAddress,
  toDecimalString,
} from "@/lib/format";

type VersionFilter = "all" | "v3" | "v2";
type SortDir = "asc" | "desc";
type NetworkFilter = SwapNetwork | "all";
type Selection =
  | { version: "v3"; sel: V3PoolSelection }
  | { version: "v2"; sel: V2PoolSelection }
  | null;

/**
 * React + Vite port of the original PoolsExplorer.
 * Navigation is injected so this component does not depend on Next.js or a
 * particular router. `onOpenSwap` should set the pending pair/network and
 * navigate to your swap page.
 */
export interface PoolsExplorerProps {
  onOpenSwap: (args: {
    network: Exclude<SwapNetwork, "dotone">;
    tokenA: TokenInfo;
    tokenB: TokenInfo;
  }) => void;
  onCreatePool: () => void;
  onAddLiquidity: () => void;
  renderPositions?: () => ReactNode;
  renderTransactions?: () => ReactNode;
  renderV2Liquidity?: (selection: V2PoolSelection) => ReactNode;
  renderV3Liquidity?: (selection: V3PoolSelection) => ReactNode;
}

const NETWORK_FILTERS: { id: NetworkFilter; label: string }[] = [
  { id: "all", label: "All networks" },
  { id: "dotone", label: "DotOne Chain" },
  ...LIFI_NETWORKS.map((n) => ({ id: n.id, label: n.label })),
];

const REAL_TOKEN_ADDRESSES = new Set(
  [
    ...CURATED_TOKENS.filter(
      (t) => !t.name?.toLowerCase().includes("test"),
    ).map((t) => t.address),
    WDOTO,
  ].map((a) => a.toLowerCase()),
);

function isRealToken(token: TokenInfo) {
  // If the curated list has not been copied yet, do not silently hide every pool.
  // Add the original CURATED_TOKENS list to restore strict production filtering.
  return (
    REAL_TOKEN_ADDRESSES.size <= 1 ||
    REAL_TOKEN_ADDRESSES.has(token.address.toLowerCase())
  );
}

type Row =
  | {
      key: string;
      source: "dotone";
      version: "v2" | "v3";
      token0: TokenInfo;
      token1: TokenInfo;
      typeLabel: string;
      liquidityLabel: string;
      liquidityScore: number;
      detailLabel: string;
      address: `0x${string}`;
    }
  | {
      key: string;
      source: "lifi";
      network: Exclude<SwapNetwork, "dotone">;
      token0: TokenInfo;
      token1: TokenInfo;
      typeLabel: string;
      liquidityLabel: string;
      liquidityScore: number;
      detailLabel: string;
      apy: number | null;
      pool: BscPool;
    };

function toV3Row(pool: V3PoolInfo): Row {
  const price = sqrtPriceToPrice(
    pool.sqrtPriceX96,
    pool.token0.decimals,
    pool.token1.decimals,
  );
  return {
    key: `v3-${pool.address}`,
    source: "dotone",
    version: "v3",
    token0: pool.token0,
    token1: pool.token1,
    typeLabel: `V3${pool.fee ? ` | ${feeToPercent(pool.fee)}` : ""}`,
    liquidityLabel:
      pool.liquidity > 0n ? `${formatCompact(pool.liquidity, 0)} L` : "—",
    liquidityScore: Number(pool.liquidity),
    detailLabel:
      price > 0
        ? `1 ${pool.token0.symbol} = ${price.toFixed(6)} ${pool.token1.symbol}`
        : "Not initialized",
    address: pool.address,
  };
}

function toV2Row(pool: Pool): Row {
  const score =
    Number(toDecimalString(pool.reserve0, pool.token0.decimals)) +
    Number(toDecimalString(pool.reserve1, pool.token1.decimals));
  const price =
    pool.reserve0 > 0n
      ? Number(toDecimalString(pool.reserve1, pool.token1.decimals)) /
        Number(toDecimalString(pool.reserve0, pool.token0.decimals))
      : 0;
  return {
    key: `v2-${pool.address}`,
    source: "dotone",
    version: "v2",
    token0: pool.token0,
    token1: pool.token1,
    typeLabel: "V2",
    liquidityLabel: `${formatCompact(pool.reserve0, pool.token0.decimals)} ${pool.token0.symbol} + ${formatCompact(pool.reserve1, pool.token1.decimals)} ${pool.token1.symbol}`,
    liquidityScore: score,
    detailLabel:
      price > 0
        ? `1 ${pool.token0.symbol} = ${price.toFixed(6)} ${pool.token1.symbol}`
        : "Not initialized",
    address: pool.address,
  };
}

function formatUsd(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function toLifiRow(
  pool: BscPool,
  network: Exclude<SwapNetwork, "dotone">,
): Row {
  const label = LIFI_NETWORKS.find((n) => n.id === network)?.label ?? network;
  return {
    key: `${network}-${pool.id}`,
    source: "lifi",
    network,
    token0: pool.token0,
    token1: pool.token1,
    typeLabel: label,
    liquidityLabel: formatUsd(pool.tvlUsd),
    liquidityScore: pool.tvlUsd,
    detailLabel: pool.apy != null ? `${pool.apy.toFixed(2)}% APY` : "—",
    apy: pool.apy,
    pool,
  };
}

function PairAvatars({
  token0,
  token1,
}: {
  token0: TokenInfo;
  token1: TokenInfo;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <TokenAvatar
        symbol={token0.symbol}
        address={token0.address}
        logoUrl={token0.logoUrl}
        size={30}
      />
      <div className="-ml-2.5">
        <TokenAvatar
          symbol={token1.symbol}
          address={token1.address}
          logoUrl={token1.logoUrl}
          size={30}
          className="ring-2 ring-white dark:ring-slate-900"
        />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 px-3 py-3.5 last:border-b-0 dark:border-slate-800 sm:px-4">
      <div className="flex shrink-0 items-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="-ml-2.5 h-8 w-8 animate-pulse rounded-full bg-slate-300 ring-2 ring-white dark:bg-slate-600 dark:ring-slate-900" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-16 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="hidden h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-700 sm:block" />
      <div className="hidden h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700 md:block" />
      <div className="hidden h-4 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700 lg:block" />
    </div>
  );
}

function Placeholder({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-6 dark:border-slate-700">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="font-semibold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

export function PoolsExplorer({
  onOpenSwap,
  onCreatePool,
  onAddLiquidity,
  renderPositions,
  renderTransactions,
}: PoolsExplorerProps) {
  const v3 = useV3Pools();
  const v2 = useV2Pools();
  const bsc = useBscPools();
  const ethereum = useNetworkPools("ethereum");
  const polygon = useNetworkPools("polygon");
  const arbitrum = useNetworkPools("arbitrum");

  const [tab, setTab] = useState<"all" | "positions" | "transactions">("all");
  const [network, setNetwork] = useState<NetworkFilter>("all");
  const [version, setVersion] = useState<VersionFilter>("all");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selection, setSelection] = useState<Selection>(null);

  const isLoading = v3.isLoading || v2.isLoading;
  const hasError = Boolean(v3.error || v2.error);

  const dotoneRows = useMemo(() => {
    const v3Rows = (v3.data?.pools ?? [])
      .filter((p) => isRealToken(p.token0) && isRealToken(p.token1))
      .map(toV3Row);
    const v2Rows = (v2.data ?? [])
      .filter((p) => isRealToken(p.token0) && isRealToken(p.token1))
      .map(toV2Row);
    return [...v3Rows, ...v2Rows];
  }, [v3.data, v2.data]);
  const bnbRows = useMemo(
    () => (bsc.data ?? []).map((p) => toLifiRow(p, "bsc")),
    [bsc.data],
  );
  const ethereumRows = useMemo(
    () => (ethereum.data ?? []).map((p) => toLifiRow(p, "ethereum")),
    [ethereum.data],
  );
  const polygonRows = useMemo(
    () => (polygon.data ?? []).map((p) => toLifiRow(p, "polygon")),
    [polygon.data],
  );
  const arbitrumRows = useMemo(
    () => (arbitrum.data ?? []).map((p) => toLifiRow(p, "arbitrum")),
    [arbitrum.data],
  );
  const allLifiRows = useMemo(
    () => [...bnbRows, ...ethereumRows, ...polygonRows, ...arbitrumRows],
    [bnbRows, ethereumRows, polygonRows, arbitrumRows],
  );
  const topPools = useMemo(
    () =>
      [...dotoneRows]
        .sort((a, b) => b.liquidityScore - a.liquidityScore)
        .slice(0, 3),
    [dotoneRows],
  );

  const rows = useMemo(() => {
    const byNetwork: Record<Exclude<SwapNetwork, "dotone">, Row[]> = {
      bsc: bnbRows,
      ethereum: ethereumRows,
      polygon: polygonRows,
      arbitrum: arbitrumRows,
    };
    let dotone = network === "all" || network === "dotone" ? dotoneRows : [];
    let lifi: Row[] =
      network === "all"
        ? allLifiRows
        : network === "dotone"
          ? []
          : byNetwork[network];
    if (version !== "all") {
      dotone = dotone.filter(
        (row) => row.source === "dotone" && row.version === version,
      );
      lifi = [];
    }
    const q = search.trim().toLowerCase();
    const matches = (row: Row) =>
      row.token0.symbol.toLowerCase().includes(q) ||
      row.token1.symbol.toLowerCase().includes(q) ||
      row.token0.address.toLowerCase().includes(q) ||
      row.token1.address.toLowerCase().includes(q) ||
      (row.source === "dotone" && row.address.toLowerCase().includes(q));
    if (q) {
      dotone = dotone.filter(matches);
      lifi = lifi.filter(matches);
    }
    const sort = (a: Row, b: Row) =>
      sortDir === "desc"
        ? b.liquidityScore - a.liquidityScore
        : a.liquidityScore - b.liquidityScore;
    // Keep network groups separate: DotOne raw liquidity units and LI.FI TVL are not comparable.
    return [...dotone.sort(sort), ...lifi.sort(sort)];
  }, [
    dotoneRows,
    allLifiRows,
    bnbRows,
    ethereumRows,
    polygonRows,
    arbitrumRows,
    network,
    version,
    search,
    sortDir,
  ]);

  function selectRow(row: Row, nonce: number) {
    if (row.source === "lifi") {
      onOpenSwap({
        network: row.network,
        tokenA: row.token0,
        tokenB: row.token1,
      });
      return;
    }
    if (row.version === "v3") {
      const pool = v3.data?.pools.find((p) => p.address === row.address);
      if (pool)
        setSelection({
          version: "v3",
          sel: {
            token0: pool.token0,
            token1: pool.token1,
            fee: pool.fee,
            nonce,
          },
        });
    } else {
      const pool = v2.data?.find((p) => p.address === row.address);
      if (pool)
        setSelection({
          version: "v2",
          sel: { token0: pool.token0, token1: pool.token1, nonce },
        });
    }
  }

  const buttonBase = "rounded-full px-4 py-2 text-sm font-medium transition";
  const tabButton = (active: boolean) =>
    `${buttonBase} ${active ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`;

  return (
    <div className="mx-auto w-full max-w-[1600px] pb-6 text-slate-900 dark:text-white">
      <section className="mb-6 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Earn from <span className="text-amber-500">Liquidity Pools</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Stat
              label="Total DotOne Pools"
              value={isLoading ? "—" : dotoneRows.length}
            />
            {[
              {
                label: "V3",
                value: isLoading ? "—" : (v3.data?.pools.length ?? 0),
              },
              { label: "V2", value: isLoading ? "—" : (v2.data?.length ?? 0) },
              { label: "BNB", value: bsc.isLoading ? "—" : bnbRows.length },
              {
                label: "Ethereum",
                value: ethereum.isLoading ? "—" : ethereumRows.length,
              },
              {
                label: "Polygon",
                value: polygon.isLoading ? "—" : polygonRows.length,
              },
              {
                label: "Arbitrum",
                value: arbitrum.isLoading ? "—" : arbitrumRows.length,
              },
            ].map((tile) => (
              <Fragment key={tile.label}>
                <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs dark:border-slate-700">
                    {tile.label}
                  </span>
                  <Stat label="Pools" value={tile.value} />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        {topPools.length > 0 && (
          <div className="min-w-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-500">
              Top Pools by Liquidity
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {topPools.map((row) => (
                <div
                  key={row.key}
                  className="w-44 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between">
                    <PairAvatars token0={row.token0} token1={row.token1} />
                    <span className="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] dark:border-slate-700">
                      {row.typeLabel.split(" | ")[0]}
                    </span>
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold">
                    {row.token0.symbol} / {row.token1.symbol}
                  </div>
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {row.liquidityLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* <div className="flex flex-wrap gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          <button
            className={tabButton(tab === "all")}
            onClick={() => setTab("all")}
          >
            All Pools
          </button>
          <button
            className={tabButton(tab === "positions")}
            onClick={() => setTab("positions")}
          >
            My Positions
          </button>
          <button
            className={tabButton(tab === "transactions")}
            onClick={() => setTab("transactions")}
          >
            Transactions
          </button>
        </div> */}
        <div className="flex gap-2">
          {/* <button
            type="button"
            onClick={onCreatePool}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Create Pool
          </button>
          <button
            type="button"
            onClick={onAddLiquidity}
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"
          >
            Add Liquidity +
          </button> */}
        </div>
      </div>

      {selection ? (
        <div className="w-full max-w-[480px] space-y-3">
          {/* <button
            type="button"
            onClick={() => setSelection(null)}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            ← Back to pools
          </button>
          {selection.version === "v3" ? (
            renderV3Liquidity ? (
              renderV3Liquidity(selection.sel)
            ) : (
              <Placeholder
                title="Add V3 liquidity"
                message="Pass renderV3Liquidity to connect your existing LiquidityWizard."
              />
            )
          ) : renderV2Liquidity ? (
            renderV2Liquidity(selection.sel)
          ) : (
            <Placeholder
              title="Add V2 liquidity"
              message="Pass renderV2Liquidity to connect your existing LiquidityPanel."
            />
          )} */}
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="relative">
              <label className="sr-only" htmlFor="pool-network-filter">
                Network
              </label>
              <select
                id="pool-network-filter"
                value={network}
                onChange={(e) => setNetwork(e.target.value as NetworkFilter)}
                className="h-10 max-w-[190px] appearance-none rounded-full border border-slate-300 bg-slate-50 py-2 pl-3 pr-9 text-sm font-medium dark:border-slate-700 dark:bg-slate-950"
              >
                {NETWORK_FILTERS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
            <div className="relative w-full sm:max-w-[280px] sm:flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or paste address"
                className="h-10 w-full rounded-full border border-slate-300 bg-transparent pl-9 pr-3 text-sm outline-none focus:border-amber-500 dark:border-slate-700"
              />
            </div>
            {(network === "all" || network === "dotone") && (
              <div className="ml-auto flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
                {(["all", "v3", "v2"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setVersion(item)}
                    className={`${buttonBase} px-4 py-1.5 ${version === item ? "bg-amber-500 text-black" : "text-slate-600 dark:text-slate-300"}`}
                  >
                    {item.toUpperCase() === "ALL" ? "All" : item.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="hidden items-center gap-3 border-b border-slate-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:border-slate-800 sm:flex">
              <div className="flex-1">Pool</div>
              <div className="w-20 shrink-0">Type</div>
              <button
                type="button"
                onClick={() =>
                  setSortDir((d) => (d === "desc" ? "asc" : "desc"))
                }
                className="hidden w-32 shrink-0 items-center gap-1 text-left hover:text-slate-900 dark:hover:text-white md:flex"
              >
                Liquidity{" "}
                {sortDir === "desc" ? (
                  <ArrowDown className="h-3 w-3" />
                ) : (
                  <ArrowUp className="h-3 w-3" />
                )}
              </button>
              <div className="hidden w-40 shrink-0 lg:block">Price / APY</div>
              <div className="w-14 shrink-0" />
            </div>
            {isLoading ||
            bsc.isLoading ||
            ethereum.isLoading ||
            polygon.isLoading ||
            arbitrum.isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : hasError ? (
              <p className="p-6 text-center text-sm text-red-600">
                Failed to load pools.
              </p>
            ) : rows.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {search ? "No pools match your search." : "No pools found yet."}
              </p>
            ) : (
              rows.map((row, i) => (
                <button
                  key={row.key}
                  type="button"
                  onClick={() => selectRow(row, Date.now())}
                  className="flex w-full animate-in items-center gap-3 border-b border-slate-200 px-3 py-3 text-left transition hover:bg-slate-50 last:border-b-0 dark:border-slate-800 dark:hover:bg-slate-800/60 sm:px-4"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <PairAvatars token0={row.token0} token1={row.token1} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {row.token0.symbol} / {row.token1.symbol}
                      </div>
                      {row.source === "dotone" ? (
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>{shortAddress(row.address, 4, 4)}</span>
                          <a
                            href={addressUrl(row.address)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-slate-900 dark:hover:text-white"
                          >
                            ↗
                          </a>
                        </div>
                      ) : (
                        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {
                            LIFI_NETWORKS.find((n) => n.id === row.network)
                              ?.defiLlama.projectLabel
                          }{" "}
                          · {row.typeLabel}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-20 shrink-0">
                    <span className="block truncate rounded-full border border-slate-300 px-2 py-1 text-center text-xs dark:border-slate-700">
                      {row.typeLabel}
                    </span>
                  </div>
                  <div className="hidden w-32 shrink-0 truncate text-sm md:block">
                    {row.liquidityLabel}
                  </div>
                  <div
                    className={`hidden w-40 shrink-0 truncate text-xs lg:block ${row.source === "lifi" && row.apy != null ? "font-semibold text-emerald-600" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {row.detailLabel}
                  </div>
                  <div className="w-14 shrink-0 text-right text-xs text-slate-500">
                    {row.source === "lifi" ? "Swap →" : "Add →"}
                  </div>
                </button>
              ))
            )}
          </div>
          {v3.data && !v3.data.scanComplete && (
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Still scanning chain history for V3 pools — list will grow…
            </p>
          )}
        </>
      )}
    </div>
  );
}
