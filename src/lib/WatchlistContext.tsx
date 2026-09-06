import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface WatchlistContextValue {
  ids: Set<string>
  isWatched: (id: string) => boolean
  toggle: (id: string) => void
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null)
const STORAGE_KEY = 'dotmarket-watchlist'

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  }, [ids])

  const value = useMemo<WatchlistContextValue>(
    () => ({
      ids,
      isWatched: (id: string) => ids.has(id),
      toggle: (id: string) =>
        setIds((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        }),
    }),
    [ids],
  )

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
