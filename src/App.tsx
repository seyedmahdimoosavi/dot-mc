import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeContext'
import { I18nProvider, useI18n } from './i18n/I18nContext'
import { WatchlistProvider } from './lib/WatchlistContext'
import { TooltipProvider } from './components/ui/tooltip'
import { Layout } from './components/layout/Layout'
import { MarketPage } from './pages/MarketPage'
import { CoinDetailPage } from './pages/CoinDetailPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

function WatchlistPage() {
  const { t } = useI18n()
  return <PlaceholderPage title={t.nav.watchlist} />
}

function PortfolioPage() {
  const { t } = useI18n()
  return <PlaceholderPage title={t.nav.portfolio} />
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <WatchlistProvider>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<MarketPage />} />
                  <Route path="/currencies/:slug" element={<CoinDetailPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/page/:slug" element={<PlaceholderPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WatchlistProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
