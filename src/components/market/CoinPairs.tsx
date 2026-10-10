import { usePairs } from "@/hooks/usePricingApi";
import { decimalNumber } from "@/lib/pricecatcher";
import { formatQuotedPrice } from "@/lib/format";
import { useI18n } from "@/i18n/I18nContext";
import { ApiNotice } from "@/components/ApiNotice";

export function CoinPairs({ coinId }: { coinId: string }) {
  const { lang } = useI18n();
  const pairs = usePairs([`id:${coinId}/USD`, `id:${coinId}/BTC`, `id:${coinId}/ETH`, `id:${coinId}/IRR`]);
  return <section className="py-7">
    <h2 className="font-display text-base font-semibold">{lang === "fa" ? "قیمت در پایه‌های مختلف" : "Prices by quote"}</h2>
    <p className="mt-2 text-sm text-muted">{lang === "fa" ? "نرخ‌های تجمیعی بازار" : "Aggregated market rates"}</p>
    <ApiNotice error={pairs.error} loading={pairs.isLoading} stale={pairs.data?.data.some(item => item.stale)} />
    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {pairs.data?.data.map(item => <div key={item.pair} className="rounded-md border border-line p-3">
        <span className="en text-sm text-muted">{item.pair}</span>
        <strong className="mt-2 block">{formatQuotedPrice(decimalNumber(item.price), item.quote, lang)}</strong>
        {item.price_toman != null && <small>{decimalNumber(item.price_toman).toLocaleString(lang === "fa" ? "fa-IR" : "en-US")} {lang === "fa" ? "تومان" : "toman"}</small>}
      </div>)}
    </div>
    {pairs.data?.errors.filter(item => item.code !== "same_base_quote").map(item => <p key={item.pair} className="mt-2 text-sm text-muted"><span className="en">{item.pair}</span>: {lang === "fa" ? "ناموجود" : "Not available"}</p>)}
  </section>;
}
