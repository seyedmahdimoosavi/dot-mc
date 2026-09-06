import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeContext'
import { I18nProvider } from './i18n/I18nContext'
import { WatchlistProvider } from './lib/WatchlistContext'
import { Layout } from './components/layout/Layout'
import { MarketPage } from './pages/MarketPage'
import { CoinDetailPage } from './pages/CoinDetailPage'

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <WatchlistProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<MarketPage />} />
                <Route path="/currencies/:slug" element={<CoinDetailPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WatchlistProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
