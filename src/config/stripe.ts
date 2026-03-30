export const STRIPE_PRICE_IDS = {
  PLUS: "price_1TGi5iFGfcWVbr5C8izKb2fu",
  PRO: "price_1TGi6SFGfcWVbr5CDHsZou8p",
} as const;

export type PriceIdKey = keyof typeof STRIPE_PRICE_IDS;