import { useState } from "react";

interface Props {
  symbol: string;
  address?: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}
export function TokenAvatar({
  symbol,
  logoUrl,
  size = 30,
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);
  const initials = (symbol || "?").slice(0, 2).toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-white ${className}`}
      style={{ width: size, height: size }}
    >
      {logoUrl && !failed ? (
        <img
          src={logoUrl}
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
