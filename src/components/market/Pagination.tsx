import { Icon } from "../icons/Icon";
import { useI18n } from "../../i18n/I18nContext";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  rows: number;
  onRows: (rows: number) => void;
}

const ROW_OPTIONS = [10, 20, 50, 100];

export function Pagination({
  page,
  totalPages,
  onPage,
  rows,
  onRows,
}: PaginationProps) {
  const { t } = useI18n();

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1);

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <span>{t.table.showingRows}</span>
        <select
          className="rounded-lg border border-line bg-surface px-2 py-1.5 text-ink transition-colors hover:border-accent focus:border-accent focus:outline-none"
          value={rows}
          onChange={(e) => onRows(Number(e.target.value))}
        >
          {ROW_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button
          className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-line text-md text-muted transition-colors hover:border-accent hover:text-gold disabled:opacity-35"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          aria-label={t.pagination.prev}
        >
          <Icon name="arrow" size={14} className="rotate-180" />
        </button>
        {pageNumbers.map((n, i) => (
          <span key={n} className="flex items-center gap-1">
            {i > 0 && pageNumbers[i - 1] !== n - 1 && (
              <span className="px-0.5 text-muted">…</span>
            )}
            <button
              className={`h-7.5 w-7.5 rounded-lg border text-md transition-colors ${
                n === page
                  ? "border-accent bg-accent font-semibold text-accent-ink"
                  : "border-line text-muted hover:border-accent hover:text-gold"
              }`}
              onClick={() => onPage(n)}
            >
              {n}
            </button>
          </span>
        ))}
        <button
          className="grid h-7.5 w-7.5 place-items-center rounded-lg border border-line text-md text-muted transition-colors hover:border-accent hover:text-gold disabled:opacity-35"
          disabled={page === totalPages}
          onClick={() => onPage(page + 1)}
          aria-label={t.pagination.next}
        >
          <Icon name="arrow" size={14} />
        </button>
      </div>
    </div>
  );
}
