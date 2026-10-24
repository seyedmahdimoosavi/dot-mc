import type { Coin } from "../lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

/** Pick a readable label colour for an arbitrary per-token brand fill. */
function contrastText(background: string) {
  const hex = background.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return "#FFFFFF";
  const channels = [0, 2, 4].map((offset) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance =
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance > 0.55 ? "#16130A" : "#FFFFFF";
}

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
  const background = coin.color || "#4A4F52";
  return (
    <span
      className={cn(
        "relative grid shrink-0 en place-items-center overflow-hidden rounded-full font-display font-bold",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        backgroundColor: transparent ? "transparent" : background,
        color: transparent ? undefined : contrastText(background),
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
