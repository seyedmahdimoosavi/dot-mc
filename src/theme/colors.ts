/**
 * Design tokens shared by both themes.
 * Values are aligned with the DotOne brand palette used across
 * dotscan.one (gold accent #F5BC27, near-black dark surfaces,
 * steel-blue text/surfaces on light backgrounds).
 *
 * These are the single source of truth for color - the CSS custom
 * properties declared in `src/styles/theme.css` mirror these values
 * exactly, keyed by theme name.
 */

export type ThemeName = 'light' | 'dark'

export interface ThemeTokens {
  bg: string
  surface: string
  surfaceStrong: string
  text: string
  muted: string
  line: string
  lineStrong: string
  accent: string
  accentSoft: string
  gold: string
  goldSoft: string
  green: string
  greenSoft: string
  red: string
  redSoft: string
  shadow: string
  overlay: string
}

export const themes: Record<ThemeName, ThemeTokens> = {
  light: {
    bg: '#E8EEF1',
    surface: '#F7F9FA',
    surfaceStrong: '#FFFFFF',
    text: '#263A48',
    muted: '#6B7C88',
    line: '#D6E0E4',
    lineStrong: '#AFC6D2',
    accent: '#365C74',
    accentSoft: '#DCE7EC',
    gold: '#B58A35',
    goldSoft: '#F1EAD9',
    green: '#56857F',
    greenSoft: '#E1ECEA',
    red: '#D26363',
    redSoft: '#F6E3E3',
    shadow: '0 10px 30px rgba(38,58,72,.07)',
    overlay: 'rgba(38,58,72,.45)',
  },
  dark: {
    bg: '#101112',
    surface: '#17191B',
    surfaceStrong: '#1D2022',
    text: '#F7FAFC',
    muted: '#9BA7AE',
    line: '#303538',
    lineStrong: '#414141',
    accent: '#90CDF4',
    accentSoft: '#262D31',
    gold: '#F5BC27',
    goldSoft: 'rgba(245,188,39,.14)',
    green: '#76B9A8',
    greenSoft: 'rgba(118,185,168,.14)',
    red: '#EF8989',
    redSoft: 'rgba(239,137,137,.14)',
    shadow: '0 12px 32px rgba(0,0,0,.22)',
    overlay: 'rgba(0,0,0,.6)',
  },
}

/** Fixed per-asset brand colors (independent of light/dark theme). */
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

export const defaultCoinColor = '#6B7C88'
