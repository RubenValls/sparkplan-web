import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generatePlan } from "@/lib/ai-service";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
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