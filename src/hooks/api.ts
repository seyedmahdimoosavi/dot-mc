const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`API ${path} failed: ${response.status}`);
  return response.json() as Promise<T>;
}
export function reviveBigInts<T>(value: T): T {
  if (Array.isArray(value)) return value.map(reviveBigInts) as T;
  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if ((key === "sqrtPriceX96" || key === "liquidity" || key === "reserve0" || key === "reserve1") && (typeof item === "string" || typeof item === "number")) output[key] = BigInt(item);
      else output[key] = reviveBigInts(item);
    }
    return output as T;
  }
  return value;
}
