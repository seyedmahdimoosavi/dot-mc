import { Icon } from '../icons/Icon'
import { useI18n } from '../../i18n/I18nContext'

export type SortMode = 'top' | 'trending' | 'gainersLosers' | 'recentlyAdded' | 'mostVisited'
export type CategoryFilter = 'all' | 'defi' | 'nft' | 'layer1'

interface FilterTabsProps {
  sortMode: SortMode
  onSortMode: (mode: SortMode) => void
  category: CategoryFilter
  onCategory: (category: CategoryFilter) => void
  query: string
  onQuery: (query: string) => void
}

export function FilterTabs({ sortMode, onSortMode, category, onCategory, query, onQuery }: FilterTabsProps) {
  const { t } = useI18n()

  const sortModes: SortMode[] = ['top', 'trending', 'gainersLosers', 'recentlyAdded', 'mostVisited']
  const categories: CategoryFilter[] = ['all', 'defi', 'nft', 'layer1']

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.75">
        {categories.map((c) => (
          <button
            key={c}
            className={`rounded-md border px-3 py-2 text-[11px] ${
              category === c ? 'border-accent bg-accent text-white' : 'border-line bg-transparent text-muted hover:text-ink'
            }`}
            onClick={() => onCategory(c)}
          >
            {t.filters[c]}
          </button>
        ))}
        <div className="ml-auto flex h-8.5 items-center gap-2 rounded-md border border-line bg-surface px-2.75 text-muted">
          <Icon name="search" size={15} />
          <input
            className="w-37.5 bg-transparent text-xs text-ink outline-none placeholder:text-muted"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t.nav.search}
          />
        </div>
      </div>
      <div className="mb-1 mt-4 flex flex-wrap gap-5 border-b border-line">
        {sortModes.map((mode) => (
          <button
            key={mode}
            className={`relative py-3 text-[11px] ${
              sortMode === mode
                ? "text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-gold after:content-['']"
                : 'text-muted hover:text-ink'
            }`}
            onClick={() => onSortMode(mode)}
          >
            {t.filters[mode]}
          </button>
        ))}
      </div>
    </>
  )
}
