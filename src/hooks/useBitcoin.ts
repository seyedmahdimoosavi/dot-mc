import { mockCoins } from "@/lib/mockCoins";
import { useLiveCoin } from "./useLiveCoin";

const bitcoin = mockCoins.find((coin) => coin.symbol === "BTC");

if (!bitcoin) {
  throw new Error("Bitcoin is missing from the coin list.");
}

export function useBitcoin() {
  return useLiveCoin(bitcoin);
}
