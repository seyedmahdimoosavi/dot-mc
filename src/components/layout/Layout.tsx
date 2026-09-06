import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { StatsBar } from './StatsBar'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <StatsBar />
      <Outlet />
      <Footer />
    </div>
  )
}
