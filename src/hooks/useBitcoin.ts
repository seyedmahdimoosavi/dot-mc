import { useCoinPrice } from "./usePricingApi";
import { priceToCoin } from "@/lib/pricecatcher";

export function useBitcoin() {
  const query = useCoinPrice("bitcoin");
  return { ...query, coin: query.data ? priceToCoin(query.data) : undefined };
}
