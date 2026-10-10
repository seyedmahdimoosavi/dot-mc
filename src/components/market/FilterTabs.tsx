import type { MarketFilters, MarketSort, Quote } from "@/lib/pricecatcher";

import { useI18n } from "@/i18n/I18nContext";

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
            <select
              className={inputClass}
              value={filters.quote ?? "USD"}
              onChange={(event) => {
                const quote = event.target.value as Quote;
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
                <option key={quote}>{quote}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            {fa ? "مرتب‌سازی" : "Sort by"}
            <select
              className={inputClass}
              value={filters.sort ?? "rank"}
              onChange={(event) =>
                onChange({ ...filters, sort: event.target.value as MarketSort })
              }
            >
              {sortFields.map(([value, label]) => (
                <option
                  key={value}
                  value={value}
                  disabled={irr && !["rank", "name", "price"].includes(value)}
                >
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            {fa ? "ترتیب" : "Order"}
            <select
              className={inputClass}
              value={filters.order ?? "asc"}
              onChange={(event) =>
                onChange({
                  ...filters,
                  order: event.target.value as "asc" | "desc",
                })
              }
            >
              <option value="asc">{fa ? "صعودی" : "Ascending"}</option>
              <option value="desc">{fa ? "نزولی" : "Descending"}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            {fa ? "تازگی داده" : "Freshness"}
            <select
              disabled={irr}
              className={inputClass}
              value={filters.stale ?? "include"}
              onChange={(event) =>
                onChange({
                  ...filters,
                  stale: event.target.value as MarketFilters["stale"],
                })
              }
            >
              <option value="include">{fa ? "همه" : "All"}</option>
              <option value="exclude">
                {fa ? "فقط به‌روز" : "Fresh only"}
              </option>
              <option value="only">{fa ? "فقط قدیمی" : "Stale only"}</option>
            </select>
          </label>
          {numericFields.map(([key, label]) => (
            <label key={key} className="flex flex-col gap-1">
              {label}
              <select
                className={inputClass}
                disabled={irr && key !== "rank_max"}
                value={filters[key] ?? ""}
                onChange={(event) =>
                  onChange({
                    ...filters,
                    [key]:
                      event.target.value === ""
                        ? undefined
                        : key === "rank_max"
                          ? Number(event.target.value)
                          : event.target.value,
                  })
                }
              >
                <option value="">{fa ? "همه" : "All"}</option>
                {filterOptions[key].map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
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
