import OpenAI from "openai";

export interface GeneratePlanOptions {
  idea: string;
}

export interface GeneratePlanResponse {
  plan: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getSystemPrompt(): string {
  const prompt = process.env.AI_SYSTEM_PROMPT;
  
  if (!prompt || prompt.trim().length === 0) {
    throw new Error(
      "AI_SYSTEM_PROMPT environment variable is not configured or is empty"
    );
  }
  
  return prompt;
}

const SYSTEM_PROMPT = getSystemPrompt();

export async function generatePlan(
  options: GeneratePlanOptions
): Promise<GeneratePlanResponse> {
  const { idea } = options;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: idea,
      },
    ],
    temperature: 0.7,
    max_tokens: 16000,
  });

  const plan = completion.choices[0]?.message?.content;

  if (!plan) {
    throw new Error("Failed to generate plan");
  }

  return {
    plan,
    usage: {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
    },
  };
}