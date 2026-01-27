export const STRIPE_PRICE_IDS = {
  PLUS: "price_plus_monthly",
  PRO: "price_pros_monthly",
} as const;

export type PriceIdKey = keyof typeof STRIPE_PRICE_IDS;