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
        "relative grid shrink-0 en place-items-center overflow-hidden rounded-full font-display font-bold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        backgroundColor: coin.color,
      }}
    >
      {coin.symbol.slice(0, 1)}
      {coin.logo && (
        <img
          src={coin.logo}
          alt={coin.name}
          width={size}
          height={size}
          className="absolute inset-0 h-full w-full object-cover"
          onError={event => { event.currentTarget.style.visibility = "hidden"; }}
        />
      )}
    </span>
  );
}
