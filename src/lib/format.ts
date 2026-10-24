import type { Language } from '../i18n/translations'
import type { Quote } from './pricecatcher'

const locales: Record<Language, string> = { en: 'en-US', fa: 'fa-IR' }

export function formatQuotedPrice(value: number, quote: Quote = 'USD', lang: Language = 'en'): string {
  if (!Number.isFinite(value)) return '—'
  if (quote === 'USD') return formatPrice(value, lang)
  return `${new Intl.NumberFormat(locales[lang], { maximumFractionDigits: quote === 'IRR' ? 2 : 12 }).format(value)} ${quote === 'IRR' && lang === 'fa' ? 'ریال' : quote}`
}
export function formatQuotedCompact(value: number, quote: Quote = 'USD', lang: Language = 'en'): string {
  if (!Number.isFinite(value)) return '—'
  return quote === 'USD' ? formatCompactUsd(value, lang) : `${formatCompactNumber(value, lang)} ${quote}`
}

// export function formatPrice(
//   value: number,
//   lang: Language = 'en'
// ): string {
//   const digits =
//     value >= 1
//       ? 2
//       : value >= 0.01
//         ? 4
//         : value === 0
//           ? 8
//           : Math.min(
//             18,
//             Math.max(8, Math.ceil(-Math.log10(Math.abs(value))) + 4)
//           )

//   const formatted = new Intl.NumberFormat(locales[lang], {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: digits,
//     maximumFractionDigits: digits,
//   }).format(value)

//   return formatted.replace(/[٫,](?=\d+$)/, '.')
// }

export function formatCompactUsd(value: number, lang: Language = 'en'): string {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactNumber(value: number, lang: Language = 'en'): string {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat(locales[lang], {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPrice(
  value: number,
  lang: Language = 'en'
): string {
  if (!Number.isFinite(value)) return '—'
  const digits =
    value >= 1
      ? 2
      : value >= 0.01
        ? 4
        : value === 0
          ? 8
          : Math.min(
            18,
            Math.max(8, Math.ceil(-Math.log10(Math.abs(value))) + 4)
          )

  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(value)
    .replace(/٫/g, '.')
}

export function formatPercent(
  value: number,
  lang: Language = 'en'
): string {
  if (!Number.isFinite(value)) return '—'
  const sign = value > 0 ? '+' : ''

  const formatted = new Intl.NumberFormat(locales[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  return `${sign}${formatted.replace(/٫/g, '.')}%`
}

/** Compact USD for TVL figures ("$10.08M", "$962.5K") — shared by the pool
 * list rows and the pool detail view so both render the same number. */
export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatCompact(value: bigint, decimals = 18): string {
  const n = Number(value) / 10 ** decimals;
  if (!Number.isFinite(n)) return "—";
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}
export function toDecimalString(value: bigint, decimals = 18): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = (value % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : `${whole}`;
}
export function shortAddress(address: string, start = 4, end = 4) { return address.length > start + end + 2 ? `${address.slice(0, start + 2)}…${address.slice(-end)}` : address; }
export function addressUrl(address: string) { return `${import.meta.env.VITE_DOTONE_EXPLORER_URL ?? "https://explorer.dotone.network"}/address/${address}`; }
