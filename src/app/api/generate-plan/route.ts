import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generatePlan } from "@/lib/ai-service";
import OpenAI from "openai";
import { extractPlanTitle } from "@/utils";
import { createBusinessPlan, getUserByEmail } from "@/lib/supabase";
import { checkUsageLimit, getUsageLimitErrorData } from "@/lib/supabase/actions/usage-limits";
import { USAGE_LIMITS } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const usageCheck = await checkUsageLimit(session.user.email, user.subscription);

    if (!usageCheck.allowed) {
      const errorData = getUsageLimitErrorData(
        user.subscription,
        usageCheck.currentUsage,
        usageCheck.limit!,
        usageCheck.periodEnd
      );

      return NextResponse.json(
        {
          error: "USAGE_LIMIT_REACHED",
          data: {
            subscription: errorData.subscription,
            currentUsage: errorData.currentUsage,
            limit: errorData.limit,
            periodType: errorData.periodType,
            periodEnd: errorData.periodEnd.toISOString(),
          },
        },
        { status: 429 }
      );
    }

    const { idea } = await req.json();

    if (!idea || idea.trim().length < 50) {
      return NextResponse.json(
        { error: "Idea must be at least 50 characters" },
        { status: 400 }
      );
    }

    const result = await generatePlan({ idea: idea.trim() });

    const planTitle = extractPlanTitle(result.plan);

    try {
      const isPaidPlan = user.subscription === "PLUS" || user.subscription === "PRO";

      await createBusinessPlan({
        user_email: session.user.email,
        plan_name: planTitle,
        plan: isPaidPlan ? result.plan : "",
      });
    } catch (dbError) {
      console.error("Error saving plan to database:", dbError);
    }

    return NextResponse.json({
      success: true,
      plan: result.plan,
      planName: planTitle,
      usage: result.usage,
      usageInfo: {
        currentUsage: usageCheck.currentUsage + 1,
        limit: usageCheck.limit,
        periodType: USAGE_LIMITS[user.subscription].periodType,
        periodEnd: usageCheck.periodEnd.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating plan:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: "OpenAI API error",
          message: error.message,
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}