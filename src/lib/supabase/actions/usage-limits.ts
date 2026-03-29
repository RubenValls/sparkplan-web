'use server';

import { supabase } from "@/lib/supabase/server";
import { GLOBAL_FREE_MONTHLY_LIMIT, USAGE_LIMITS } from "@/types/usage-limits";
import type { SubscriptionType } from "@/lib/supabase/types";
import type { UsageLimitErrorData } from "@/types/usage-limits";

interface UsageCheckResult {
  allowed: boolean;
  currentUsage: number;
  limit: number | null;
  periodStart: Date;
  periodEnd: Date;
  globalLimitReached?: boolean;
}

interface UserWithSubscription {
  email: string;
  subscription: SubscriptionType;
  sub_expiration_date: string | null;
}

async function checkGlobalFreeLimitForMonth(): Promise<boolean> {  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  const { data: freeUsers, error: usersError } = await supabase
    .from("users")
    .select("email")
    .eq("subscription", "FREE");

  if (usersError) {
    return false;
  }

  if (!freeUsers || freeUsers.length === 0) {
    return false;
  }

  const freeUserEmails = freeUsers.map(u => u.email);
  
  const { count, error: plansError } = await supabase
    .from("business_plans")
    .select("*", { count: "exact", head: true })
    .in("user_email", freeUserEmails)
    .gte("creation_date", monthStart.toISOString())
    .lte("creation_date", monthEnd.toISOString());

  if (plansError) {
    return false;
  }

  const totalFreeThisMonth = count || 0;

  const isLimitReached = totalFreeThisMonth >= GLOBAL_FREE_MONTHLY_LIMIT;
  
  return isLimitReached;
}

export async function checkUsageLimit(
  user: UserWithSubscription
): Promise<UsageCheckResult> {
  const limits = USAGE_LIMITS[user.subscription];

  if (user.subscription === "FREE") {
    const { count, error } = await supabase
      .from("business_plans")
      .select("*", { count: "exact", head: true })
      .eq("user_email", user.email);

    if (error) {
      throw new Error("Failed to check usage limit");
    }

    const currentUsage = count || 0;

    if (currentUsage >= limits.maxPlans!) {
      return {
        allowed: false,
        currentUsage,
        limit: limits.maxPlans,
        periodStart: new Date(0),
        periodEnd: new Date(),
        globalLimitReached: false,
      };
    }

    const globalLimitReached = await checkGlobalFreeLimitForMonth();
    
    if (globalLimitReached) {
      const now = new Date();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      return {
        allowed: false,
        currentUsage: 0,
        limit: limits.maxPlans,
        periodStart: new Date(now.getFullYear(), now.getMonth(), 1),
        periodEnd: monthEnd,
        globalLimitReached: true,
      };
    }

    return {
      allowed: true,
      currentUsage,
      limit: limits.maxPlans,
      periodStart: new Date(0),
      periodEnd: new Date(),
      globalLimitReached: false,
    };
  }

  if (!user.sub_expiration_date) {
    return {
      allowed: false,
      currentUsage: 0,
      limit: limits.maxPlans,
      periodStart: new Date(),
      periodEnd: new Date(),
    };
  }

  const subExpirationDate = new Date(user.sub_expiration_date);
  const now = new Date();

  if (now > subExpirationDate) {
    return {
      allowed: false,
      currentUsage: 0,
      limit: limits.maxPlans,
      periodStart: new Date(),
      periodEnd: subExpirationDate,
    };
  }

  const periodStart = calculateMonthlyPeriodStart(subExpirationDate);
  const periodEnd = subExpirationDate;

  const { count, error } = await supabase
    .from("business_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_email", user.email)
    .gte("creation_date", periodStart.toISOString())
    .lte("creation_date", periodEnd.toISOString());

  if (error) {
    throw new Error("Failed to check usage limit");
  }

  const currentUsage = count || 0;
  const allowed = currentUsage < limits.maxPlans!;

  return {
    allowed,
    currentUsage,
    limit: limits.maxPlans,
    periodStart,
    periodEnd,
  };
}

function calculateMonthlyPeriodStart(expirationDate: Date): Date {
  const periodStart = new Date(expirationDate);
  periodStart.setMonth(periodStart.getMonth() - 1);
  return periodStart;
}

export async function getUsageLimitErrorData(
  subscription: SubscriptionType,
  currentUsage: number,
  limit: number,
  periodEnd: Date
): Promise<UsageLimitErrorData> {
  const limits = USAGE_LIMITS[subscription];

  return {
    subscription,
    currentUsage,
    limit,
    periodType: limits.periodType,
    periodEnd,
  };
}