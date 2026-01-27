import { supabase } from "@/lib/supabase/client";
import { USAGE_LIMITS } from "@/types/usage-limits";
import type { SubscriptionType } from "@/lib/supabase/types";
import type { UsageLimitErrorData } from "@/types/usage-limits";

interface UsageCheckResult {
  allowed: boolean;
  currentUsage: number;
  limit: number | null;
  periodStart: Date;
  periodEnd: Date;
}

export async function checkUsageLimit(
  userEmail: string,
  subscription: SubscriptionType
): Promise<UsageCheckResult> {
  const limits = USAGE_LIMITS[subscription];

  if (limits.maxPlans === null) {
    return {
      allowed: true,
      currentUsage: 0,
      limit: null,
      periodStart: new Date(),
      periodEnd: new Date(),
    };
  }

  const { periodStart, periodEnd } = calculatePeriod(limits.periodType);

  const { count, error } = await supabase
    .from("business_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_email", userEmail)
    .gte("creation_date", periodStart.toISOString())
    .lte("creation_date", periodEnd.toISOString());

  if (error) {
    throw new Error("Failed to check usage limit");
  }

  const currentUsage = count || 0;
  const allowed = currentUsage < limits.maxPlans;

  return {
    allowed,
    currentUsage,
    limit: limits.maxPlans,
    periodStart,
    periodEnd,
  };
}

function calculatePeriod(periodType: "daily" | "weekly"): {
  periodStart: Date;
  periodEnd: Date;
} {
  const now = new Date();

  if (periodType === "daily") {
    const periodStart = new Date(now);
    periodStart.setHours(0, 0, 0, 0);

    const periodEnd = new Date(now);
    periodEnd.setHours(23, 59, 59, 999);

    return { periodStart, periodEnd };
  }

  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const periodStart = new Date(now);
  periodStart.setDate(now.getDate() + daysToMonday);
  periodStart.setHours(0, 0, 0, 0);

  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodStart.getDate() + 6);
  periodEnd.setHours(23, 59, 59, 999);

  return { periodStart, periodEnd };
}

export function getUsageLimitErrorData(
  subscription: SubscriptionType,
  currentUsage: number,
  limit: number,
  periodEnd: Date
): UsageLimitErrorData {
  const limits = USAGE_LIMITS[subscription];

  return {
    subscription,
    currentUsage,
    limit,
    periodType: limits.periodType,
    periodEnd,
  };
}