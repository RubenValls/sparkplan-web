import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generatePlan } from "@/lib/ai-service";
import OpenAI from "openai";
import { extractPlanTitle } from "@/utils";
import { createBusinessPlan } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      await createBusinessPlan({
        user_email: session.user.email,
        plan_name: planTitle,
        plan: result.plan,
      });
    } catch (dbError) {
      console.error("Error saving plan to database:", dbError);
    }

    return NextResponse.json({
      success: true,
      plan: result.plan,
      usage: result.usage,
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