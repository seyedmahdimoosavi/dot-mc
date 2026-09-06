import type { Language } from '../i18n/translations'

const locales: Record<Language, string> = { en: 'en-US', fa: 'fa-IR' }

export function formatPrice(value: number, lang: Language = 'en'): string {
  const digits = value >= 1 ? 2 : value >= 0.01 ? 4 : 8
  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatCompactUsd(value: number, lang: Language = 'en'): string {
  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactNumber(value: number, lang: Language = 'en'): string {
  return new Intl.NumberFormat(locales[lang], {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, lang: Language = 'en'): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${new Intl.NumberFormat(locales[lang], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}%`
}
