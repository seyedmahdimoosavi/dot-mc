import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { CoinIcon } from '../CoinIcon'
import { CoinName } from '../CoinName'
import { mockCoins } from '../../lib/mockCoins'
import { useI18n } from '../../i18n/I18nContext'
import { useTheme } from '../../theme/ThemeContext'
import { slugify } from '../../lib/slug'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const NAV_KEYS = ['cryptocurrencies', 'exchanges', 'community', 'products'] as const

function NavDropdown({ label, links }: { label: string; links: readonly string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-full items-center gap-1 px-2.5 text-[13px] text-muted outline-none transition-colors hover:text-ink data-[state=open]:text-ink">
        {label} <Icon name="chevronDown" size={13} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-52.5">
        {links.map((item) => (
          <DropdownMenuItem key={item} asChild>
            <Link to={`/page/${slugify(item)}`}>{item}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileNavMenu() {
  const { t } = useI18n()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="icon" size="icon" aria-label="Menu" className="nav:hidden">
          <Icon name="menu" size={19} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[75vh] w-65 overflow-y-auto">
        {NAV_KEYS.map((key) => (
          <div key={key} className="mb-1 border-b border-line pb-1 last:mb-0 last:border-0 last:pb-0">
            <div className="px-2.5 py-1.5 text-[11px] font-bold text-ink">{t.nav[key]}</div>
            {t.navMenus[key].map((item) => (
              <DropdownMenuItem key={item} asChild>
                <Link to={`/page/${slugify(item)}`}>{item}</Link>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
        <DropdownMenuItem asChild>
          <Link to="/watchlist">{t.nav.watchlist}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/portfolio">{t.nav.portfolio}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { t, lang, toggleLang } = useI18n()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const results =
    query.trim().length > 0
      ? mockCoins.filter((c) => `${c.name} ${c.symbol}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
      : []

  function goToCoin(slug: string) {
    setQuery('')
    setSearchFocused(false)
    navigate(`/currencies/${slug}`)
  }

  return (
    <>
      <div className="flex h-8.5 items-center justify-center gap-2 bg-ink text-[11px] text-canvas [[data-theme=dark]_&]:border-b [[data-theme=dark]_&]:border-line [[data-theme=dark]_&]:bg-surface-2 [[data-theme=dark]_&]:text-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-[#7ED5B0] shadow-[0_0_0_4px_rgba(126,213,176,.25)]" />
        {t.announcement}{' '}
        <Link to="/" className="inline-flex items-center gap-1 font-semibold text-gold">
          {t.viewAll} <Icon name="arrow" size={14} />
        </Link>
      </div>

      <header className="relative z-30 flex h-16 items-center gap-3 border-b border-line bg-surface-2 px-4 nav:h-19 nav:gap-8 nav:px-[max(28px,calc((100%-1240px)/2))]">
        <Link className="flex shrink-0 items-center gap-2 font-display text-lg font-extrabold tracking-tight text-ink" to="/">
          <span className="grid h-6.75 w-6.75 shrink-0 place-items-center rounded-tl-lg rounded-br-lg rounded-tr-lg bg-gold text-[17px] text-white">
            D
          </span>
          <span>
            dot<span className="text-gold">market</span>
          </span>
        </Link>

        <nav className="hidden h-full flex-1 nav:flex">
          {NAV_KEYS.map((key) => (
            <NavDropdown key={key} label={t.nav[key]} links={t.navMenus[key]} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 nav:ml-0">
          <MobileNavMenu />

          <div className="relative flex h-8 items-center gap-2 rounded-md border border-line bg-surface px-2.5 text-muted nav:h-8.5 nav:px-2.5">
            <Icon name="search" size={16} className="shrink-0" />
            <input
              className="w-0 bg-transparent text-xs text-ink outline-none placeholder:text-muted nav:w-37.5"
              placeholder={t.nav.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
            />
            {searchFocused && results.length > 0 && (
              <div className="absolute inset-x-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-lg border border-line bg-surface-2 shadow-(--shadow)">
                {results.map((coin) => (
                  <button
                    key={coin.id}
                    className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-xs hover:bg-accent-soft"
                    onMouseDown={() => goToCoin(coin.slug)}
                  >
                    <CoinIcon coin={coin} size={22} />
                    <CoinName name={coin.name} className="min-w-0 flex-1" />
                    <small className="shrink-0 text-muted">{coin.symbol}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="icon" size="icon" asChild className="hidden nav:inline-flex">
            <Link to="/watchlist" title={t.nav.watchlist}>
              <Icon name="star" size={17} />
            </Link>
          </Button>
          <Button variant="icon" size="icon" asChild className="hidden nav:inline-flex">
            <Link to="/portfolio" title={t.nav.portfolio}>
              <Icon name="wallet" size={17} />
            </Link>
          </Button>
          <Button variant="icon" size="icon" onClick={toggleTheme} title="Toggle theme">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
          </Button>
          <Button variant="icon" size="default" onClick={toggleLang} className="gap-1.5 px-2 text-[11px] font-bold">
            <Icon name="globe" size={16} /> {lang === 'en' ? 'FA' : 'EN'}
          </Button>
        </div>
      </header>
    </>
  )
}
