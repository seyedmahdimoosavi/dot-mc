import { useState } from "react";

import { resolveTokenLogo } from "@/data/tokenLogos";

interface Props {
  symbol: string;
  address?: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}
/**
 * Token icon: an explicit `logoUrl` (computed per row in
 * features/pools/PoolsExplorer.tsx), else the symbol-keyed map shared with the
 * swap app (data/tokenLogos.ts), else the coin's initials.
 */
export function TokenAvatar({ symbol, logoUrl, size = 30, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const src = logoUrl ?? resolveTokenLogo(symbol);
  const initials = (symbol || "?").slice(0, 2).toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-white ${className}`}
      style={{ width: size, height: size }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={`${symbol} logo`}
          width={size}
          height={size}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}
