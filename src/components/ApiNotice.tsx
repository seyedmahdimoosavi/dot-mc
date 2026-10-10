import { PricingApiError } from "@/lib/api";
import { useI18n } from "@/i18n/I18nContext";

export function ApiNotice({ error, loading, stale }: { error?: Error | null; loading?: boolean; stale?: boolean }) {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const message = error instanceof PricingApiError && error.status === 401
    ? fa ? "کلید دسترسی API تنظیم نشده یا معتبر نیست." : "API access key is missing or invalid."
    : error instanceof PricingApiError && error.status === 403
      ? fa ? "دسترسی این دامنه به API مجاز نیست." : "This origin is not allowed to access the API."
      : error instanceof PricingApiError && error.status === 429
        ? fa ? "محدودیت درخواست؛ کمی بعد دوباره تلاش کنید." : "Rate limit reached. Please try again shortly."
        : error ? fa ? "دریافت داده ناموفق بود. دادهٔ قبلی، در صورت وجود، حفظ شده است." : "Could not fetch data. Previous data is retained when available."
          : loading ? fa ? "در حال دریافت داده…" : "Loading data…"
            : stale ? fa ? "این داده به‌روز نیست." : "This data is stale." : null;
  return message ? <p role="status" className="my-3 rounded-md border border-line px-3 py-2 text-sm text-muted">{message}</p> : null;
}
