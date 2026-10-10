import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: (number | null)[];
  timestamps?: number[];
  positive?: boolean;
  showGrid?: boolean;
  className?: string;
  label?: string;
}
const WIDTH = 288;
const HEIGHT = 150;

export function Sparkline({ data, timestamps, positive = true, showGrid = false, className, label = "Price movement chart" }: SparklineProps) {
  const gradientId = useId();
  const segments = useMemo(() => {
    const values = data.filter((value): value is number => value !== null && Number.isFinite(value));
    if (!values.length) return [];
    const min = Math.min(...values), max = Math.max(...values);
    const range = max - min || 1;
    const firstTime = timestamps?.[0] ?? 0;
    const timeSpan = timestamps?.length === data.length ? timestamps[timestamps.length - 1] - firstTime : 0;
    const groups: string[][] = [];
    let current: string[] = [];
    data.forEach((value, index) => {
      if (value === null || !Number.isFinite(value)) {
        if (current.length) groups.push(current);
        current = [];
        return;
      }
      const x = timeSpan > 0 ? ((timestamps![index] - firstTime) / timeSpan) * WIDTH : index * WIDTH / Math.max(1, data.length - 1);
      const y = HEIGHT - ((value - min) / range) * (HEIGHT - 10) - 5;
      current.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    });
    if (current.length) groups.push(current);
    return groups;
  }, [data, timestamps]);
  const stroke = positive ? "var(--green)" : "var(--red)";
  return (
    <svg className={cn("block w-full", className)} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label={label}>
      {showGrid && <g>{[0, 1, 2, 3].map(i => <line key={i} x1="0" x2={WIDTH} y1={HEIGHT / 3 * i} y2={HEIGHT / 3 * i} style={{ stroke: "var(--line)", strokeWidth: 1 }} />)}</g>}
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={stroke} stopOpacity=".3" /><stop offset="1" stopColor={stroke} stopOpacity="0" /></linearGradient></defs>
      {segments.map((points, index) => {
        const firstX = points[0].split(",")[0], lastX = points.at(-1)!.split(",")[0];
        return <g key={index}>
          {points.length > 1 ? <>
            <path d={`M${points.join(" L")} L${lastX},${HEIGHT} L${firstX},${HEIGHT} Z`} fill={`url(#${gradientId})`} />
            <polyline points={points.join(" ")} fill="none" stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </> : <circle cx={firstX} cy={points[0].split(",")[1]} r="2" fill={stroke} />}
        </g>;
      })}
    </svg>
  );
}
