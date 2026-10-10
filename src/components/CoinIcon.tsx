import type { Coin } from "../lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function CoinIcon({
  coin,
  size = 32,
  className,
  transparent = false,
}: {
  coin: Coin;
  size?: number;
  className?: string;
  transparent?: boolean;
}) {
  const [failedLogo, setFailedLogo] = useState<string | null>(null);
  const showLogo = Boolean(coin.logo) && failedLogo !== coin.logo;
  return (
    <span
      className={cn(
        "relative grid shrink-0 en place-items-center overflow-hidden rounded-full font-display font-bold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        backgroundColor: transparent ? "transparent" : coin.color,
      }}
    >
      {!showLogo && <span className={transparent ? "text-ink" : undefined}>{coin.symbol.slice(0, 1)}</span>}
      {showLogo && (
        <img
          src={coin.logo}
          alt={coin.name}
          width={size}
          height={size}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailedLogo(coin.logo)}
        />
      )}
    </span>
  );
}
