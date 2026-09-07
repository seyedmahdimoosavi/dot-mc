export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Turns a slug like "currency-converter" back into "Currency converter" for placeholder titles. */
export function deslugify(slug: string): string {
  const words = slug.split('-').filter(Boolean)
  if (words.length === 0) return ''
  return words
    .map((word, i) => (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ')
}
