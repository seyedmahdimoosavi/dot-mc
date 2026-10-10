import type { MarketFilters, MarketSort, Quote } from "@/lib/pricecatcher";

import { useI18n } from "@/i18n/I18nContext";
import type { ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function FilterSelect({ value, onValueChange, disabled, children }: {
  value: string | number;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return <Select value={String(value) || "all"} disabled={disabled}
    onValueChange={next => { if (next != null) onValueChange(next === "all" ? "" : next); }}>
    <SelectTrigger className="h-10 w-full min-w-0 border-line bg-surface-2 px-3 text-md font-semibold text-ink shadow-sm transition-all duration-200 hover:border-accent focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20">
      <SelectValue className="truncate pe-2" />
    </SelectTrigger>
    <SelectContent alignItemWithTrigger={false} className="border-line bg-surface-2 text-ink shadow-(--shadow) duration-200">
      {children}
    </SelectContent>
  </Select>;
}

export function FilterTabs({
  filters,
  onChange,
}: {
  filters: MarketFilters;
  onChange: (filters: MarketFilters) => void;
}) {
  const { t, lang } = useI18n();
  const fa = lang === "fa";
  const irr = filters.quote === "IRR";
  const inputClass =
    "h-9 rounded-md border border-line bg-surface px-2 text-sm text-ink";
  const presets: { label: string; sort: MarketSort; order: "asc" | "desc" }[] =
    [
      { label: t.filters.top, sort: "rank", order: "asc" },
      {
        label: fa ? "بیشترین رشد" : "Gainers",
        sort: "change_24h",
        order: "desc",
      },
      {
        label: fa ? "بیشترین افت" : "Losers",
        sort: "change_24h",
        order: "asc",
      },
      {
        label: fa ? "بیشترین حجم" : "Highest volume",
        sort: "volume_24h",
        order: "desc",
      },
    ];
  const sortFields: [MarketSort, string][] = [
    ["rank", t.table.rank],
    ["name", t.table.name],
    ["price", t.table.price],
    ["change_1h", t.table.change1h],
    ["change_24h", t.table.change24h],
    ["change_7d", t.table.change7d],
    ["market_cap", t.table.marketCap],
    ["volume_24h", t.table.volume24h],
  ];
  const numericFields = [
    ["rank_max", fa ? "حداکثر رتبه" : "Maximum rank"],
    ["min_market_cap", fa ? "حداقل ارزش بازار" : "Minimum market cap"],
    ["min_volume_24h", fa ? "حداقل حجم ۲۴ ساعته" : "Minimum 24h volume"],
    [
      "min_change_24h",
      fa ? "حداقل تغییر ۲۴ ساعته (%)" : "Minimum 24h change (%)",
    ],
    [
      "max_change_24h",
      fa ? "حداکثر تغییر ۲۴ ساعته (%)" : "Maximum 24h change (%)",
    ],
  ] as const;
  const filterOptions = {
    rank_max: [
      ["10", "10"],
      ["20", "20"],
      ["50", "50"],
      ["100", "100"],
    ],
    min_market_cap: [
      ["1000000", "1M"],
      ["10000000", "10M"],
      ["100000000", "100M"],
      ["1000000000", "1B"],
    ],
    min_volume_24h: [
      ["1000000", "1M"],
      ["10000000", "10M"],
      ["100000000", "100M"],
    ],
    min_change_24h: [
      ["1", "1"],
      ["2", "2"],
      ["5", "5"],
      ["10", "10"],
      ["20", "20"],
      ["50", "50"],
    ],
    max_change_24h: [
      ["1", "1"],
      ["2", "2"],
      ["5", "5"],
      ["10", "10"],
      ["20", "20"],
      ["50", "50"],
    ],
  } as const;
  return (
    <>
      {/* <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="rounded-md border border-accent bg-accent px-3 py-2 text-sm text-white">{t.filters.all}</span>
    </div> */}
      <div className="mb-4 mt-4 flex flex-wrap gap-5 border-b border-line">
        {presets.map((preset) => (
          <button
            key={preset.label}
            disabled={irr && preset.sort !== "rank"}
            className={`relative py-3 text-sm disabled:opacity-40 ${filters.sort === preset.sort && filters.order === preset.order ? "border-b-2 border-gold text-ink" : "text-muted"}`}
            onClick={() =>
              onChange({ ...filters, sort: preset.sort, order: preset.order })
            }
          >
            {preset.label}
          </button>
        ))}
      </div>
      <details className="mb-4 rounded-md border border-line p-3 text-sm">
        <summary className="cursor-pointer text-muted">
          {fa ? "فیلترهای پیشرفته" : "Advanced filters"}
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1">
            {fa ? "واحد قیمت" : "Quote"}
            <FilterSelect
              className={inputClass}
              value={filters.quote ?? "USD"}
              onValueChange={(value) => {
                const quote = value as Quote;
                onChange(
                  quote === "IRR"
                    ? {
                        rank_max: filters.rank_max,
                        sort: "rank",
                        order: "asc",
                        quote,
                      }
                    : { ...filters, quote },
                );
              }}
            >
              {["USD", "BTC", "ETH", "IRR"].map((quote) => (
                <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" key={quote} value={quote}>{quote}</SelectItem>
              ))}
            </FilterSelect>
          </label>
          <label className="flex flex-col gap-1">
            {fa ? "مرتب‌سازی" : "Sort by"}
            <FilterSelect
              className={inputClass}
              value={filters.sort ?? "rank"}
              onValueChange={(value) =>
                onChange({ ...filters, sort: value as MarketSort })
              }
            >
              {sortFields.map(([value, label]) => (
                <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink"
                  key={value}
                  value={value}
                  disabled={irr && !["rank", "name", "price"].includes(value)}
                >
                  {label}
                </SelectItem>
              ))}
            </FilterSelect>
          </label>
          <label className="flex flex-col gap-1">
            {fa ? "ترتیب" : "Order"}
            <FilterSelect
              className={inputClass}
              value={filters.order ?? "asc"}
              onValueChange={(value) =>
                onChange({
                  ...filters,
                  order: value as "asc" | "desc",
                })
              }
            >
              <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" value="asc">{fa ? "صعودی" : "Ascending"}</SelectItem>
              <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" value="desc">{fa ? "نزولی" : "Descending"}</SelectItem>
            </FilterSelect>
          </label>
          <label className="flex flex-col gap-1">
            {fa ? "تازگی داده" : "Freshness"}
            <FilterSelect
              disabled={irr}
              className={inputClass}
              value={filters.stale ?? "include"}
              onValueChange={(value) =>
                onChange({
                  ...filters,
                  stale: value as MarketFilters["stale"],
                })
              }
            >
              <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" value="include">{fa ? "همه" : "All"}</SelectItem>
              <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" value="exclude">
                {fa ? "فقط به‌روز" : "Fresh only"}
              </SelectItem>
              <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" value="only">{fa ? "فقط قدیمی" : "Stale only"}</SelectItem>
            </FilterSelect>
          </label>
          {numericFields.map(([key, label]) => (
            <label key={key} className="flex flex-col gap-1">
              {label}
              <FilterSelect
                className={inputClass}
                disabled={irr && key !== "rank_max"}
                value={filters[key] ?? ""}
                onValueChange={(value) =>
                  onChange({
                    ...filters,
                    [key]:
                      value === ""
                        ? undefined
                        : key === "rank_max"
                          ? Number(value)
                          : value,
                  })
                }
              >
                <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" value="all">{fa ? "همه" : "All"}</SelectItem>
                {filterOptions[key].map(([value, text]) => (
                  <SelectItem className="cursor-pointer ps-3 pe-8 py-2 text-md text-start data-[highlighted]:bg-accent-soft data-[highlighted]:text-ink" key={value} value={value}>
                    {text}
                  </SelectItem>
                ))}
              </FilterSelect>
            </label>
          ))}
        </div>
        {irr && (
          <p className="mt-3 text-muted">
            {fa
              ? "برای ریال فقط حداکثر رتبه و مرتب‌سازی رتبه، نام و قیمت پشتیبانی می‌شوند."
              : "IRR supports maximum rank and sorting by rank, name or price only."}
          </p>
        )}
        <button
          className="mt-3 text-muted underline"
          onClick={() => onChange({ sort: "rank", order: "asc", quote: "USD" })}
        >
          {fa ? "پاک کردن فیلترها" : "Reset filters"}
        </button>
      </details>
    </>
  );
}
