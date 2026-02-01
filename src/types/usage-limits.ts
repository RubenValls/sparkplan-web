import type { SubscriptionType } from "@/lib/supabase/types";

export interface UsageLimit {
  maxPlans: number | null;
  periodType: "lifetime" | "monthly";
}

export interface UsageLimitConfig {
  [key: string]: UsageLimit;
}

export interface UsageLimitErrorData {
  subscription: SubscriptionType;
  currentUsage: number;
  limit: number;
  periodType: "lifetime" | "monthly";
  periodEnd: Date;
}

export interface UsageLimitErrorResponse {
  subscription: SubscriptionType;
  currentUsage: number;
  limit: number;
  periodType: "lifetime" | "monthly";
  periodEnd: string;
}

export const USAGE_LIMITS: Record<SubscriptionType, UsageLimit> = {
  FREE: {
    maxPlans: 1,
    periodType: "lifetime",
  },
  PLUS: {
    maxPlans: 30,
    periodType: "monthly",
  },
  PRO: {
    maxPlans: 100,
    periodType: "monthly",
  },
} as const;