import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { StatsBar } from './StatsBar'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <Header />
      <StatsBar />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
