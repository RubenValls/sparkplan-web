import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generatePlan } from "@/lib/ai-service";
import OpenAI from "openai";

const userRequests = new Map<string, number[]>();

const RATE_LIMIT = {
  MAX_REQUESTS_PER_HOUR: 3,
  WINDOW_HOUR_MS: 60 * 60 * 1000,
};

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  nextAvailableAt?: number;
}

function checkRateLimit(userId: string): RateLimitResult {
  const now = Date.now();
  const userTimestamps = userRequests.get(userId) || [];

  // Limpiar peticiones antiguas (más de 1 hora)
  const recentRequests = userTimestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT.WINDOW_HOUR_MS
  );

  // Verificar si ha alcanzado el límite
  if (recentRequests.length >= RATE_LIMIT.MAX_REQUESTS_PER_HOUR) {
    const oldestRequest = recentRequests[0];
    const nextAvailableAt = oldestRequest + RATE_LIMIT.WINDOW_HOUR_MS;

    return {
      allowed: false,
      remaining: 0,
      nextAvailableAt,
    };
  }

  // Añadir nueva petición
  recentRequests.push(now);
  userRequests.set(userId, recentRequests);

  return {
    allowed: true,
    remaining: RATE_LIMIT.MAX_REQUESTS_PER_HOUR - recentRequests.length,
  };
}

function getResetTimeMessage(nextAvailableAt: number): string {
  const minutesUntilReset = Math.ceil(
    (nextAvailableAt - Date.now()) / (1000 * 60)
  );

  if (minutesUntilReset < 1) {
    return "in less than 1 minute";
  } else if (minutesUntilReset === 1) {
    return "in 1 minute";
  } else if (minutesUntilReset < 60) {
    return `in ${minutesUntilReset} minutes`;
  } else {
    return "in about 1 hour";
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verificar rate limit
    const rateLimit = checkRateLimit(session.user.id);

    if (!rateLimit.allowed) {
      const resetMessage = getResetTimeMessage(rateLimit.nextAvailableAt!);

      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You're generating plans too quickly. You can generate ${RATE_LIMIT.MAX_REQUESTS_PER_HOUR} plans per hour. Please try again ${resetMessage}.`,
          nextAvailableAt: rateLimit.nextAvailableAt,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.MAX_REQUESTS_PER_HOUR.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.nextAvailableAt!.toString(),
          },
        }
      );
    }

    // Validar idea
    const { idea } = await req.json();

    if (!idea || idea.trim().length < 50) {
      return NextResponse.json(
        { error: "Idea must be at least 50 characters" },
        { status: 400 }
      );
    }

    // Generar el plan
    const result = await generatePlan({ idea: idea.trim() });

    return NextResponse.json(
      {
        success: true,
        plan: result.plan,
        usage: result.usage,
        rateLimit: {
          remaining: rateLimit.remaining,
          limit: RATE_LIMIT.MAX_REQUESTS_PER_HOUR,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.MAX_REQUESTS_PER_HOUR.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Error generating plan:", error);

    // Manejar errores específicos de OpenAI
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
