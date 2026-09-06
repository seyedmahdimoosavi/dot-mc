import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { useTheme } from '../../theme/ThemeContext'
import { useI18n } from '../../i18n/I18nContext'
import { mockCoins } from '../../lib/mockCoins'

const NAV_KEYS = ['cryptocurrencies', 'exchanges', 'community', 'products', 'learn'] as const

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { t, lang, toggleLang } = useI18n()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
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
      <div className="announcement">
        <span className="live-dot" /> {t.announcement}{' '}
        <Link to="/">
          {t.viewAll} <Icon name="arrow" size={14} />
        </Link>
      </div>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">D</span>
          <span>
            dot<span>market</span>
          </span>
        </Link>
        <nav className="main-nav">
          {NAV_KEYS.map((key) => (
            <div className="nav-item" key={key}>
              <button className="nav-trigger">
                {t.nav[key]} <Icon name="chevronDown" size={13} />
              </button>
              <div className="nav-dropdown">
                {t.navMenus[key].map((label) => (
                  <a key={label} href="#">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Icon name="menu" />
          </button>
          <div className="search-box">
            <Icon name="search" size={16} />
            <input
              placeholder={t.nav.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
            />
            {searchFocused && results.length > 0 && (
              <div className="search-results">
                {results.map((coin) => (
                  <button key={coin.id} onMouseDown={() => goToCoin(coin.slug)}>
                    <span className="coin-icon" style={{ background: coin.color, width: 22, height: 22, fontSize: 11 }}>
                      {coin.symbol.slice(0, 1)}
                    </span>
                    <span>{coin.name}</span>
                    <small>{coin.symbol}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link className="icon-button header-only-lg" to="/" title={t.nav.watchlist}>
            <Icon name="star" size={17} />
          </Link>
          <Link className="icon-button header-only-lg" to="/" title={t.nav.portfolio}>
            <Icon name="wallet" size={17} />
          </Link>
          <button className="icon-button" onClick={toggleTheme} title="Toggle theme">
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
          </button>
          <button className="language-button" onClick={toggleLang}>
            <Icon name="globe" size={16} /> {lang === 'en' ? 'FA' : 'EN'}
          </button>
          <div className="auth-buttons header-only-lg">
            <button className="ghost-button">{t.nav.login}</button>
            <button className="solid-button">{t.nav.signup}</button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-drawer" role="dialog">
          <div className="mobile-drawer-head">
            <span className="brand">
              <span className="brand-mark">D</span> dotmarket
            </span>
            <button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
          <nav className="mobile-nav">
            {NAV_KEYS.map((key) => (
              <div key={key} className="mobile-nav-group">
                <span>{t.nav[key]}</span>
                <div>
                  {t.navMenus[key].map((label) => (
                    <a key={label} href="#" onClick={() => setMobileOpen(false)}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <a href="#">{t.nav.watchlist}</a>
            <a href="#">{t.nav.portfolio}</a>
          </nav>
          <div className="mobile-drawer-foot">
            <button className="ghost-button">{t.nav.login}</button>
            <button className="solid-button">{t.nav.signup}</button>
          </div>
        </div>
      )}
    </>
  )
}
