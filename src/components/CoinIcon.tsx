import type { Coin } from "../lib/types";
import { cn } from "@/lib/utils";

export function CoinIcon({
  coin,
  size = 32,
  className,
}: {
  coin: Coin;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full font-display font-bold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
      }}
    >
      {coin.logo ? (
        <img
          src={coin.logo}
          alt={coin.name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        coin.symbol.slice(0, 1)
      )}
    </span>
  );
}
