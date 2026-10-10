import { useState } from "react";
import { formatCompactUsd, formatPercent, formatPrice } from "../../lib/format";

import { Sparkline } from "../Sparkline";
import { useBitcoin } from "@/hooks/useBitcoin";
import { useI18n } from "../../i18n/I18nContext";

export function Hero() {
  const { t, lang } = useI18n();
  const { coin: bitcoin } = useBitcoin();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timestamps = bitcoin?.sparklineTimestamps ?? [];
  const date = (timestamp?: number) => timestamp == null ? "—" : new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(timestamp);
  const availableTimestamps = timestamps.filter((_, index) => bitcoin?.sparkline[index] != null && Number.isFinite(bitcoin.sparkline[index]));
  const from = date(availableTimestamps[0]);
  const to = date(availableTimestamps.at(-1));
  const chartData = bitcoin?.sparkline ?? [];
  const points = chartData.flatMap((value, index) =>
    value !== null && Number.isFinite(value) ? [{ value, index, timestamp: timestamps[index] }] : [],
  );
  const firstPoint = points[0];
  const lastPoint = points.at(-1);
  const min = points.reduce((result, point) => Math.min(result, point.value), Infinity);
  const max = points.reduce((result, point) => Math.max(result, point.value), -Infinity);
  const timeSpan = timestamps.length === chartData.length && firstPoint && lastPoint
    ? lastPoint.timestamp - firstPoint.timestamp : 0;
  const positionedPoints = points.map(point => ({
    ...point,
    x: firstPoint!.index === lastPoint!.index ? 50 : timeSpan > 0
      ? (point.timestamp - firstPoint!.timestamp) / timeSpan * 100
      : (point.index - firstPoint!.index) / (lastPoint!.index - firstPoint!.index) * 100,
    // Match Sparkline's 150px viewBox and 5px vertical padding.
    y: (150 - (point.value - min) / (max - min || 1) * 140 - 5) / 150 * 100,
  }));
  const hoveredPoint = positionedPoints.find(point => point.index === hoveredIndex);
  const hoverDate = (timestamp: number) => new Intl.DateTimeFormat(
    lang === "fa" ? "fa-IR" : "en-US",
    { dateStyle: "medium", timeStyle: "short" },
  ).format(timestamp);
  return (
    <section className="grid gap-10 px-5 py-11 nav:grid-cols-[1fr_1.1fr] nav:items-center nav:gap-15 nav:px-7.5 nav:py-14">
      <div>
        {/* <p className="mb-3.5 flex items-center gap-1.5 font-display text-[14px] font-bold uppercase tracking-[.14em] text-gold">
          <span className="text-sm">✦</span> {t.hero.eyebrow}
        </p> */}
        <h1 className="font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.06em] nav:text-[58px]">
          {t.hero.titleLine1}
          <br />
          <em className="not-italic text-green">{t.hero.titleLine2Em}</em>
        </h1>
        <p className="my-5.5 max-w-95 text-sm leading-[1.8] text-muted">
          {t.hero.copy}
        </p>
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-0.5">
            <strong className="font-display text-lg font-bold">
              {bitcoin ? formatCompactUsd(bitcoin.marketCap, lang) : "—"}
            </strong>
            <span className="text-[14px] text-muted">
              {t.hero.marketCapLabel}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="font-display text-lg font-bold text-green">
              {bitcoin ? formatPercent(bitcoin.change24h, lang) : "—"}
            </strong>
            <span className="text-[14px] text-muted">{t.hero.changeLabel}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <strong className="font-display text-lg font-bold">
              {bitcoin ? formatCompactUsd(bitcoin.volume24h, lang) : "—"}
            </strong>
            <span className="text-[14px] text-muted">{t.hero.volumeLabel}</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-surface-2 px-6 pb-4 pt-5.5 shadow-(--shadow)">
        <div className="flex justify-between text-[13px] text-muted">
          <span>{lang === "fa" ? "قیمت بیت کوین" : "Bitcoin price"}</span>
          <strong className="font-medium">{lang === "fa" ? "۷ روز گذشته · USD" : "Last 7 days · USD"}</strong>
        </div>
        <div
          className="relative mt-5.5 h-55 cursor-crosshair"
          onPointerMove={event => {
            if (!positionedPoints.length) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (!rect.width) return;
            const x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100));
            const nearest = positionedPoints.reduce((best, point) =>
              Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best,
            );
            setHoveredIndex(nearest.index);
          }}
          onPointerLeave={() => setHoveredIndex(null)}
          onPointerCancel={() => setHoveredIndex(null)}
        >
          <Sparkline
            data={chartData}
            timestamps={timestamps}
            trimEmptyEdges
            positive={(bitcoin?.change24h ?? 0) >= 0}
            className="h-full"
          />
          {hoveredPoint && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 border-l border-dashed border-muted"
                style={{ left: `${hoveredPoint.x}%` }}
              />
              <span
                className={`pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-2 ${(bitcoin?.change24h ?? 0) >= 0 ? "bg-green" : "bg-red"}`}
                style={{ left: `${hoveredPoint.x}%`, top: `${hoveredPoint.y}%` }}
              />
              <div
                className="pointer-events-none absolute top-0 z-10 flex w-1/2 max-w-48 -translate-x-1/2 flex-col items-center rounded-md border border-line bg-surface-2 px-3 py-2 text-[12px] shadow-(--shadow)"
                style={{ left: `${Math.max(25, Math.min(75, hoveredPoint.x))}%` }}
              >
                {hoveredPoint.timestamp != null && (
                  <span className="text-center text-muted">{hoverDate(hoveredPoint.timestamp)}</span>
                )}
                <strong dir="ltr">{formatPrice(hoveredPoint.value, lang)}</strong>
              </div>
            </>
          )}
        </div>
        <div className="mt-0.5 flex justify-between text-[13px] text-muted">
          <span>{from}</span>
          <span>{to}</span>
        </div>
      </div>
    </section>
  );
}
