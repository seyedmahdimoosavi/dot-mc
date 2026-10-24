/**
 * Design tokens shared by both themes - the JS mirror of
 * `src/styles/theme.css`.
 *
 * The palette is the DotOneScan design system retinted to a gold/black
 * brand: the system's blue ramp (blue.300/400) is replaced by gold
 * #F5BC27, so no blue role survives. Dark is the primary experience,
 * light is the warm-neutral alternative bound to the same names.
 */

export type ThemeName = 'light' | 'dark'

export interface ThemeTokens {
  bg: string
  topbar: string
  surface: string
  surfaceStrong: string
  tableHead: string
  text: string
  muted: string
  line: string
  lineStrong: string
  accent: string
  accentInk: string
  accentHover: string
  accentSoft: string
  gold: string
  goldSoft: string
  focus: string
  link: string
  green: string
  greenSoft: string
  red: string
  redSoft: string
  chart: string
  chartSoft: string
  field: string
  fieldBorder: string
  fieldPlaceholder: string
  shadow: string
  shadowLg: string
  shadowXl: string
  overlay: string
}

export const themes: Record<ThemeName, ThemeTokens> = {
  light: {
    bg: '#E8EEF1',
    topbar: '#EFF3F5',
    surface: '#F7F9FA',
    surfaceStrong: '#FFFFFF',
    tableHead: '#EFF3F5',
    text: '#263A48',
    muted: '#6B7C88',
    line: '#D5DFE4',
    lineStrong: '#AFC6D2',
    accent: '#F5BC27',
    accentInk: '#16130A',
    accentHover: '#D9A21D',
    accentSoft: '#F8EFD9',
    gold: '#8A6516',
    goldSoft: '#F3E9D2',
    focus: '#A87925',
    link: '#8A6516',
    green: '#38A169',
    greenSoft: 'rgba(56,161,105,.12)',
    red: '#E53E3E',
    redSoft: 'rgba(229,62,62,.10)',
    chart: '#B58A35',
    chartSoft: 'rgba(181,138,53,.28)',
    field: '#FFFFFF',
    fieldBorder: '#D5DFE4',
    fieldPlaceholder: '#A0AEC0',
    shadow: '0 1px 2px rgba(16,17,18,.06), 0 1px 3px rgba(16,17,18,.08)',
    shadowLg: '0 4px 6px -2px rgba(16,17,18,.05), 0 10px 15px -3px rgba(16,17,18,.1)',
    shadowXl: '0 15px 50px -12px rgba(16,17,18,.25)',
    overlay: 'rgba(16,17,18,.55)',
  },
  dark: {
    bg: '#101112',
    topbar: '#141517',
    surface: 'rgba(255,255,255,.06)',
    surfaceStrong: '#17191B',
    tableHead: 'rgba(255,255,255,.04)',
    text: '#FFFFFF',
    muted: 'rgba(255,255,255,.62)',
    line: 'rgba(255,255,255,.08)',
    lineStrong: 'rgba(255,255,255,.18)',
    accent: '#F5BC27',
    accentInk: '#16130A',
    accentHover: '#FFD45E',
    accentSoft: 'rgba(245,188,39,.12)',
    gold: '#F5BC27',
    goldSoft: 'rgba(245,188,39,.14)',
    focus: '#F5BC27',
    link: '#F5BC27',
    green: '#38A169',
    greenSoft: 'rgba(56,161,105,.14)',
    red: '#F56565',
    redSoft: 'rgba(245,101,101,.12)',
    chart: '#F5BC27',
    chartSoft: 'rgba(245,188,39,.30)',
    field: '#101112',
    fieldBorder: '#3A3F42',
    fieldPlaceholder: '#718096',
    shadow: '0 1px 2px rgba(0,0,0,.6), 0 8px 28px rgba(0,0,0,.32)',
    shadowLg:
      '0 15px 40px rgba(0,0,0,.4), 0 5px 10px rgba(0,0,0,.2), 0 0 0 1px rgba(255,255,255,.04)',
    shadowXl:
      '0 15px 40px rgba(0,0,0,.4), 0 5px 10px rgba(0,0,0,.2), 0 0 0 1px rgba(255,255,255,.05)',
    overlay: 'rgba(0,0,0,.6)',
  },
}

/** Fixed per-asset brand colours (independent of light/dark theme). */
export const coinBrandColors: Record<string, string> = {
  BTC: '#F5BC27',
  ETH: '#627EEA',
  USDT: '#26A17B',
  BNB: '#F3BA2F',
  SOL: '#9945FF',
  USDC: '#2775CA',
  XRP: '#23292F',
  DOGE: '#C2A633',
  ADA: '#0033AD',
  TRX: '#FF060A',
  AVAX: '#E84142',
  SHIB: '#FFA409',
  DOT: '#E6007A',
  LINK: '#2A5ADA',
  BCH: '#8DC351',
  NEAR: '#00EC97',
  LTC: '#345D9D',
  MATIC: '#8247E5',
  ICP: '#3B00B9',
  UNI: '#FF007A',
  ETC: '#669073',
  XLM: '#14B6E7',
  XMR: '#FF6600',
  OKB: '#4AA3E5',
  FIL: '#0090FF',
  HBAR: '#000000',
  ATOM: '#2E3148',
  VET: '#15BDFF',
  APT: '#00C2FF',
  ARB: '#28A0F0',
  OP: '#FF0420',
  IMX: '#1A1A2E',
  RNDR: '#CB4A32',
  INJ: '#00D4FF',
  FTM: '#1969FF',
  ALGO: '#000000',
  GRT: '#6747ED',
  XTZ: '#2C7DF7',
  EOS: '#000000',
  THETA: '#2AB8E6',
  FLOW: '#00EF8B',
  AXS: '#0055D5',
  SAND: '#00ADEF',
  MANA: '#FF2D55',
  CHZ: '#CD0124',
  KAVA: '#FF564F',
  ZEC: '#F4B728',
  DASH: '#008CE7',
}

export const defaultCoinColor = '#4A4F52'
