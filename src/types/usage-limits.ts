import type { SubscriptionType } from "@/lib/supabase/types";

export interface UsageLimit {
  maxPlans: number | null;
  periodType: "daily" | "weekly";
}

export interface UsageLimitConfig {
  [key: string]: UsageLimit;
}

export interface UsageLimitErrorData {
  subscription: SubscriptionType;
  currentUsage: number;
  limit: number;
  periodType: "daily" | "weekly";
  periodEnd: Date;
}

export interface UsageLimitErrorResponse {
  subscription: SubscriptionType;
  currentUsage: number;
  limit: number;
  periodType: "daily" | "weekly";
  periodEnd: string;
}

export const USAGE_LIMITS: Record<SubscriptionType, UsageLimit> = {
  FREE: {
    maxPlans: 3,
    periodType: "weekly",
  },
  PLUS: {
    maxPlans: 3,
    periodType: "daily",
  },
  PRO: {
    maxPlans: null,
    periodType: "daily",
  },
} as const;