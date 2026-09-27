export const COIN_API_BASE_URL = (
  import.meta.env.VITE_COIN_API_BASE_URL ||
  "https://coin-prices-lyart.vercel.app/api"
  // "http://localhost:3000/api"
).replace(/\/+$/, "");
