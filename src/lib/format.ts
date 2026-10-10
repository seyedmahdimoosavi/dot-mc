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
