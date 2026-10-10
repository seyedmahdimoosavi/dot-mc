export const COIN_API_BASE_URL = (
  import.meta.env.VITE_PRICECATCHER_API_BASE_URL || "https://pricecatcher.dotone.online"
).replace(/\/+$/, "");

export class PricingApiError extends Error {
  constructor(public status: number, public code: string, message: string, public requestId?: string, public retryAfter?: number) {
    super(message);
    this.name = "PricingApiError";
  }
}
type QueryParams = Record<string, string | number | boolean | undefined>;
let rateLimitUntil = 0;
export async function pricingRequest<T>(path: string, params: QueryParams = {}, signal?: AbortSignal): Promise<T> {
  if (Date.now() < rateLimitUntil) throw new PricingApiError(429, "rate_limited", "Rate limit exceeded", undefined, Math.ceil((rateLimitUntil - Date.now()) / 1000));
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  // Use only a browser-safe, origin-restricted consumer key. Private keys belong in a server proxy.
  const key = import.meta.env.VITE_PRICECATCHER_PUBLIC_API_KEY;
  const response = await fetch(`${COIN_API_BASE_URL}${path}${query.size ? `?${query}` : ""}`, { signal, headers: key ? { "X-API-Key": key } : undefined });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const delay = Number(response.headers.get("Retry-After")) || 60;
    if (response.status === 429) rateLimitUntil = Date.now() + delay * 1000;
    throw new PricingApiError(response.status, body?.error?.code ?? "request_failed", body?.error?.message ?? `Request failed (${response.status})`, body?.error?.request_id, delay);
  }
  return response.json() as Promise<T>;
}
