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
      <div className="section-tools">
        {categories.map((c) => (
          <button key={c} className={`filter-button ${category === c ? 'active' : ''}`} onClick={() => onCategory(c)}>
            {t.filters[c]}
          </button>
        ))}
        <div className="table-search">
          <Icon name="search" size={15} />
          <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder={t.nav.search} />
        </div>
      </div>
      <div className="table-tabs">
        {sortModes.map((mode) => (
          <button key={mode} className={sortMode === mode ? 'active' : ''} onClick={() => onSortMode(mode)}>
            {t.filters[mode]}
          </button>
        ))}
      </div>
    </>
  )
}
