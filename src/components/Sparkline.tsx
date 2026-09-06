import { useId, useMemo } from 'react'

interface SparklineProps {
  data: number[]
  positive?: boolean
  compact?: boolean
  showGrid?: boolean
  className?: string
}

const WIDTH = 288
const HEIGHT = 150

export function Sparkline({ data, positive = true, compact = false, showGrid = false, className }: SparklineProps) {
  const gradientId = useId()

  const points = useMemo(() => {
    if (data.length === 0) return ''
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const step = WIDTH / (data.length - 1 || 1)
    return data
      .map((value, i) => {
        const x = i * step
        const y = HEIGHT - ((value - min) / range) * (HEIGHT - 10) - 5
        return `${x.toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ')
  }, [data])

  const color = positive ? 'var(--green)' : 'var(--red)'

  return (
    <svg
      className={`price-chart ${compact ? 'compact' : ''} ${className ?? ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Price movement chart"
    >
      {showGrid && (
        <g className="chart-grid">
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" x2={WIDTH} y1={(HEIGHT / 3) * i} y2={(HEIGHT / 3) * i} />
          ))}
        </g>
      )}
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${points.replaceAll(' ', ' L')} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
