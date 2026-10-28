import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

import { TokenAvatar } from "@/components/TokenAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SWAP_APP_URL } from "@/config/env";
import { LIFI_NETWORKS, type SwapNetwork } from "@/config/networks";
import { WDOTO } from "@/data/contracts/addresses";
import type { BscPool, Pool, TokenInfo, V3PoolInfo } from "@/domain/types";
import { CURATED_TOKENS } from "@/domain/tokens";
import { feeToPercent, sqrtPriceToPrice } from "@/domain/v3-math";
import { resolveTokenLogo, trustWalletLogo } from "@/data/tokenLogos";
import { useBscPools } from "@/hooks/useBscPools";
import { useNetworkPools } from "@/hooks/useNetworkPools";
import { useV2Pools } from "@/hooks/useV2Pools";
import { useV3Pools } from "@/hooks/useV3Pools";
import {
  addressUrl,
  formatCompact,
  formatUsd,
  shortAddress,
  toDecimalString,
} from "@/lib/format";

// Pool rows start at this many and grow by the same amount per "Show more":
// a network can list several hundred pools (Ethereum's Uniswap V3 alone has
// 300+), and rendering them all up front makes the page sluggish on mobile.
const PAGE_SIZE = 50;

type VersionFilter = "all" | "v3" | "v2";
type SortDir = "asc" | "desc";
type NetworkFilter = SwapNetwork | "all";

// Pool details live in the swap app, not here: clicking one of our own pools
// opens its pool page there, carrying the pool address in the query string.
const SWAP_POOLS_URL = `${SWAP_APP_URL.replace(/\/+$/, "")}/pools`;

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
}

const NETWORK_FILTERS: { id: NetworkFilter; label: string }[] = [
  { id: "all", label: "All networks" },
  { id: "dotone", label: "DotOne Chain" },
  ...LIFI_NETWORKS.map((n) => ({ id: n.id, label: n.label })),
];

// Base UI needs the value/label pairs to render the selected label (instead of
// the raw id, e.g. "bsc") inside the trigger after a choice is made.
const NETWORK_ITEMS = NETWORK_FILTERS.map(({ id, label }) => ({
  value: id,
  label,
}));

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
      feeLabel: string | null;
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
    feeLabel: feeToPercent(pool.fee),
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
    feeLabel: null,
    address: pool.address,
  };
}

/** Pool rows for the LI.FI-routed chains carry symbols straight from
 * DeFiLlama, so a token's own logo has to be attached here: the symbol-keyed
 * map first (matches the swap app), then Trust Wallet's per-address asset for
 * anything the map doesn't know. Tokens with neither keep the generated
 * initials in TokenAvatar. */
function withLogo(
  token: TokenInfo,
  network: Exclude<SwapNetwork, "dotone">,
): TokenInfo {
  if (token.logoUrl) return token;
  return {
    ...token,
    logoUrl:
      resolveTokenLogo(token.symbol) ?? trustWalletLogo(network, token.address),
  };
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
    token0: withLogo(pool.token0, network),
    token1: withLogo(pool.token1, network),
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
      <div className="-ms-2.5">
        <TokenAvatar
          symbol={token1.symbol}
          address={token1.address}
          logoUrl={token1.logoUrl}
          size={30}
          className="ring-2 ring-surface-2 "
        />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 border-b border-line px-3 py-3.5 last:border-b-0 sm:px-4">
      <div className="flex shrink-0 items-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-line " />
        <div className="-ms-2.5 h-8 w-8 animate-pulse rounded-full bg-line-2 ring-2 ring-surface-2 " />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-28 animate-pulse rounded bg-line " />
        <div className="h-3 w-16 animate-pulse rounded bg-surface " />
      </div>
      <div className="hidden h-4 w-14 animate-pulse rounded bg-line sm:block" />
      <div className="hidden h-4 w-28 animate-pulse rounded bg-line md:block" />
      <div className="hidden h-4 w-36 animate-pulse rounded bg-line lg:block" />
    </div>
  );
}

/** Placeholder for a single numeric stat (the pool counts in the header)
 * while that source is still loading — keeps the row from jumping when the
 * numbers arrive, instead of printing an em dash. */
function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 animate-pulse rounded bg-line align-middle ${className}`}
    />
  );
}

/** Same box as a real "Top Pools by Liquidity" card, so the header keeps its
 * height and the cards don't pop in. */
function TopPoolSkeleton() {
  return (
    <div className="w-40 shrink-0 rounded-lg border border-line bg-surface p-3">
      <div className="flex items-center justify-between">
        <div className="flex shrink-0 items-center">
          <div className="h-[30px] w-[30px] animate-pulse rounded-full bg-line " />
          <div className="-ms-2.5 h-[30px] w-[30px] animate-pulse rounded-full bg-line-2 ring-2 ring-surface-2 " />
        </div>
        <div className="h-4 w-8 animate-pulse rounded-full bg-line " />
      </div>
      <div className="mt-2 h-4 w-24 animate-pulse rounded bg-line " />
      <div className="mt-1.5 h-3 w-16 animate-pulse rounded bg-surface " />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted ">{label}</div>
      <div className="font-semibold text-ink ">{value}</div>
    </div>
  );
}

export function PoolsExplorer({ onOpenSwap }: PoolsExplorerProps) {
  const v3 = useV3Pools();
  const v2 = useV2Pools();
  const bsc = useBscPools();
  const ethereum = useNetworkPools("ethereum");
  const polygon = useNetworkPools("polygon");
  const arbitrum = useNetworkPools("arbitrum");

  const [network, setNetwork] = useState<NetworkFilter>("all");
  const [version, setVersion] = useState<VersionFilter>("all");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Every filter below resets paging explicitly (rather than with an effect on
  // the filter values), so a new selection always starts at the first page.

  const isLoading = v3.isLoading || v2.isLoading;
  const isAllLoading =
    isLoading ||
    bsc.isLoading ||
    ethereum.isLoading ||
    polygon.isLoading ||
    arbitrum.isLoading;
  // Every source counts: a failed DeFiLlama fetch used to leave the external
  // networks silently empty ("No pools found yet"), which reads exactly like
  // "this network has no pools" rather than "the request failed".
  const hasError = Boolean(
    v3.error ||
    v2.error ||
    bsc.error ||
    ethereum.error ||
    polygon.error ||
    arbitrum.error,
  );

  function retryAll() {
    void v3.refetch();
    void v2.refetch();
    void bsc.refetch();
    void ethereum.refetch();
    void polygon.refetch();
    void arbitrum.refetch();
  }

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

  const visibleRows = rows.slice(0, visibleCount);

  // Our own pools have a real on-chain address, so their row is a link into
  // the swap app's pool page (details live there, not in this app). LI.FI
  // rows aren't ours — DeFiLlama identifies them by an opaque id, not an
  // address — so they keep routing through the injected onOpenSwap callback.
  function selectRow(row: Row) {
    if (row.source === "lifi") {
      onOpenSwap({
        network: row.network,
        tokenA: row.token0,
        tokenB: row.token1,
      });
      return;
    }
    window.open(
      `${SWAP_POOLS_URL}?address=${row.address}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const buttonBase =
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors";

  return (
    <div className="mx-auto w-full max-w-[1600px] scroll-mt-24 pb-6 text-ink" id="dex">
      <section className="mb-6 flex flex-col gap-5 rounded-xl border border-line bg-surface-2 p-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">
            Earn from <span className="text-gold">Liquidity Pools</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Stat
              label="Total Pools"
              value={
                isAllLoading ? (
                  <SkeletonBar className="w-10" />
                ) : (
                  dotoneRows.length + allLifiRows.length
                )
              }
            />
            {[
              {
                label: "DotOne",
                loading: isLoading,
                value: dotoneRows.length,
              },
              {
                label: "V3",
                loading: v3.isLoading,
                value: dotoneRows.filter(
                  (row) => row.source === "dotone" && row.version === "v3",
                ).length,
              },
              {
                label: "V2",
                loading: v2.isLoading,
                value: dotoneRows.filter(
                  (row) => row.source === "dotone" && row.version === "v2",
                ).length,
              },
              { label: "BNB", loading: bsc.isLoading, value: bnbRows.length },
              {
                label: "Ethereum",
                loading: ethereum.isLoading,
                value: ethereumRows.length,
              },
              {
                label: "Polygon",
                loading: polygon.isLoading,
                value: polygonRows.length,
              },
              {
                label: "Arbitrum",
                loading: arbitrum.isLoading,
                value: arbitrumRows.length,
              },
            ].map((tile) => (
              <Fragment key={tile.label}>
                <div className="hidden h-8 w-px bg-line sm:block" />
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-line-2 px-2 py-0.5 text-xs text-muted">
                    {tile.label}
                  </span>
                  <Stat
                    label="Pools"
                    value={
                      tile.loading ? (
                        <SkeletonBar className="w-6" />
                      ) : (
                        tile.value
                      )
                    }
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        {(topPools.length > 0 || isLoading) && (
          <div className="min-w-0 border-t border-line pt-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-gold">
              Top Pools by Liquidity
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {isLoading
                ? [0, 1, 2].map((i) => <TopPoolSkeleton key={i} />)
                : topPools.map((row) => (
                    <button
                      key={row.key}
                      type="button"
                      onClick={() => selectRow(row)}
                      aria-label={`Open ${row.token0.symbol}/${row.token1.symbol} pool`}
                      className="w-40 shrink-0 rounded-lg border border-line bg-surface p-3 text-start transition-colors hover:border-accent/50 hover:bg-accent-soft/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <div className="flex items-center justify-between">
                        <PairAvatars token0={row.token0} token1={row.token1} />
                        <span className="rounded-full border border-line-2 px-2 py-0.5 text-[10px] text-muted">
                          {row.typeLabel.split(" | ")[0]}
                        </span>
                      </div>
                      <div className="mt-2 truncate text-sm font-semibold">
                        {row.token0.symbol} / {row.token1.symbol}
                      </div>
                      <div className="truncate text-xs text-muted ">
                        {row.liquidityLabel}
                      </div>
                    </button>
                  ))}
            </div>
          </div>
        )}
      </section>

      <>
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface-2 p-3">
          <div>
            <label className="sr-only" htmlFor="pool-network-filter">
              Network
            </label>
            <Select
              value={network}
              items={NETWORK_ITEMS}
              onValueChange={(value) => {
                if (value == null) return;
                setNetwork(value as NetworkFilter);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              <SelectTrigger
                id="pool-network-filter"
                className="h-10 w-[170px] rounded-lg border-2 border-line-2 bg-surface px-3 text-sm font-semibold text-ink transition-colors hover:border-accent focus-visible:border-accent sm:w-[190px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                align="start"
                className="border-line bg-surface-2 text-ink shadow-(--shadow-xl)"
              >
                {NETWORK_FILTERS.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    className="cursor-pointer ps-3 pe-8 py-2 text-sm text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full sm:max-w-[280px] sm:flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search name or paste address"
              className="h-10 w-full rounded-lg border border-line-2 bg-transparent ps-9 pe-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-accent"
            />
          </div>
          {(network === "all" || network === "dotone") && (
            <div className="ms-auto flex rounded-lg bg-surface p-1">
              {(["all", "v3", "v2"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setVersion(item);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`${buttonBase} px-4 py-1.5 ${version === item ? "bg-accent text-accent-ink" : "text-muted hover:text-gold"}`}
                >
                  {item.toUpperCase() === "ALL" ? "All" : item.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="overflow-hidden rounded-xl border border-line bg-surface-2">
          <div className="hidden items-center gap-3 border-b border-line bg-table-head px-4 py-3 text-[12px] font-semibold uppercase tracking-[.08em] text-muted sm:flex">
            <div className="flex-1">Pool</div>
            <div className="w-24 shrink-0 text-center">Type</div>
            <button
              type="button"
              onClick={() => {
                setSortDir((d) => (d === "desc" ? "asc" : "desc"));
                setVisibleCount(PAGE_SIZE);
              }}
              className="hidden w-32 shrink-0 items-center gap-1 text-start transition-colors hover:text-gold md:flex"
            >
              Liquidity{" "}
              {sortDir === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUp className="h-3 w-3" />
              )}
            </button>
            <div className="hidden w-40 shrink-0 lg:block">Price</div>
            <div className="hidden w-24 shrink-0 lg:block">APY</div>
            <div className="hidden w-24 shrink-0 lg:block">Pool fee</div>
            <div className="w-14 shrink-0" />
          </div>
          {isAllLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          ) : hasError ? (
            <div className="p-6 text-center">
              <p className="text-sm text-red">Failed to load pools.</p>
              <button
                type="button"
                onClick={retryAll}
                className="mt-3 rounded-lg border border-line-2 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-accent hover:bg-accent-soft"
              >
                Retry
              </button>
            </div>
          ) : rows.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted ">
              {search ? "No pools match your search." : "No pools found yet."}
            </p>
          ) : (
            <>
              {visibleRows.map((row) => (
                <button
                  key={row.key}
                  type="button"
                  onClick={() => selectRow(row)}
                  className="flex w-full items-center gap-3 border-b border-line px-3 py-3.5 text-start transition-colors last:border-b-0 hover:bg-surface sm:px-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <PairAvatars token0={row.token0} token1={row.token1} />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {row.token0.symbol} / {row.token1.symbol}
                      </div>
                      <div className="text-xs text-muted lg:hidden">
                        APY: {row.source === "lifi" && row.apy != null ? `${row.apy.toFixed(2)}%` : "—"} · Pool fee: {row.source === "dotone" ? row.feeLabel ?? "—" : "—"}
                      </div>
                      {row.source === "dotone" ? (
                        <div className="flex items-center gap-1 text-xs text-muted ">
                          <span>{shortAddress(row.address, 4, 4)}</span>
                          <a
                            href={addressUrl(row.address)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="transition-colors hover:text-gold"
                          >
                            ↗
                          </a>
                        </div>
                      ) : (
                        <div className="truncate text-xs text-muted ">
                          {
                            LIFI_NETWORKS.find((n) => n.id === row.network)
                              ?.defiLlama.projectLabel
                          }{" "}
                          · {row.typeLabel}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-24 flex justify-center">
                    <span className="block truncate rounded-full border border-line-2 px-2 py-1 text-center text-xs text-muted">
                      {row.typeLabel}
                    </span>
                  </div>
                  <div className="hidden w-32 shrink-0 truncate text-sm md:block">
                    {row.liquidityLabel}
                  </div>
                  <div
                    className={`hidden w-40 shrink-0 truncate text-xs lg:block ${row.source === "lifi" && row.apy != null ? "font-semibold text-green" : "text-muted "}`}
                  >
                    {row.source === "dotone" ? row.detailLabel : "—"}
                  </div>
                  <div className="hidden w-24 shrink-0 text-xs lg:block">
                    {row.source === "lifi" && row.apy != null ? `${row.apy.toFixed(2)}%` : "—"}
                  </div>
                  <div className="hidden w-24 shrink-0 text-xs text-muted lg:block">
                    {row.source === "dotone" ? row.feeLabel ?? "—" : "—"}
                  </div>
                  <div className="w-14 shrink-0 text-end text-xs text-muted">
                    {row.source === "lifi" ? "Swap →" : "View →"}
                  </div>
                </button>
              ))}
              {rows.length > visibleCount && (
                <div className="border-t border-line p-3 text-center ">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="rounded-lg border border-line-2 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-accent hover:bg-accent-soft"
                  >
                    Show more · {rows.length - visibleCount} remaining
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {v3.data && !v3.data.scanComplete && (
          <p className="mt-2 text-center text-xs text-muted ">
            Still scanning chain history for V3 pools — list will grow…
          </p>
        )}
      </>
    </div>
  );
}
