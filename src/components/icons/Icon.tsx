const paths: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 4.9 12l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z',
  sun: 'M12 3V1m0 22v-2M4.2 4.2 2.8 2.8m18.4 18.4-1.4-1.4M3 12H1m22 0h-2M4.2 19.8l-1.4 1.4M21.2 2.8l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  moon: 'M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3.5 9.6l6.2-.9L12 3Z',
  starFilled: 'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3 1.2-6.9-5-4.9 6.9-1L12 2Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  chevronDown: 'm6 9 6 6 6-6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6 6 18',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21M3.5 12h17',
  wallet: 'M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm14 6a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  x: 'M18 6 6 18M6 6l12 12',
  telegram: 'M22 2 11 13M22 2 15 22 11 13 2 9 22 2Z',
  check: 'm5 12 5 5L20 7',
}

export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[name]} fill={name === 'starFilled' ? 'currentColor' : 'none'} />
    </svg>
  )
}
