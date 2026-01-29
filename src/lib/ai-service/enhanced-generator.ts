import OpenAI from "openai";
import { env } from "@/config/env";
import {
  ANALYSIS_PROMPT,
  PLAN_GENERATION_PROMPT,
  BRANDING_PROMPT,
  getNameEvaluationSection,
} from "./prompts";
import type {
  EnhancedPlanResponse,
  GeneratePlanOptions,
  StrategicAnalysis,
} from "./ai-service-types";

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});


function prepareAnalysisPrompt(idea: string): string {
  return ANALYSIS_PROMPT.replace("{idea}", idea);
}

function preparePlanPrompt(
  idea: string,
  strategicAnalysis: StrategicAnalysis,
  detectedProjectName: string | null,
  detectedLanguage: string
): string {
  const strategicContext = JSON.stringify(strategicAnalysis, null, 2);

  return PLAN_GENERATION_PROMPT.replace("{strategicContext}", strategicContext)
    .replace("{idea}", idea)
    .replace("{projectName}", detectedProjectName || "To be defined")
    .replace(/{language}/g, detectedLanguage);
}

function prepareBrandingPrompt(
  idea: string,
  strategicAnalysis: StrategicAnalysis,
  detectedProjectName: string | null,
  detectedLanguage: string
): string {
  const nameSection = getNameEvaluationSection(detectedProjectName || undefined);

  return BRANDING_PROMPT.replace("{language}", detectedLanguage)
    .replace("{positioning}", strategicAnalysis.strategic_decisions.positioning)
    .replace(
      "{target}",
      strategicAnalysis.strategic_decisions.target_hypothesis.join(", ")
    )
    .replace("{valueProposition}", idea.substring(0, 200))
    .replace("{projectName}", detectedProjectName || "Not provided")
    .replace("{nameEvaluation}", nameSection);
}

function detectLanguage(idea: string, analysis: StrategicAnalysis): string {
  return analysis.detected_language || (idea.match(/[áéíóúñ]/i) ? "Spanish" : "English");
}

function parseStrategicAnalysis(rawResponse: string): StrategicAnalysis {
  const cleanJson = rawResponse
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  return JSON.parse(cleanJson);
}

async function analyzeBusinessIdea(idea: string): Promise<{
  analysis: StrategicAnalysis;
  promptTokens: number;
  completionTokens: number;
}> {
  const prompt = prepareAnalysisPrompt(idea);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a strategic business analyst. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 800,
  });

  const responseText = completion.choices[0]?.message?.content;

  if (!responseText) {
    throw new Error("Failed to generate strategic analysis");
  }

  try {
    const analysis = parseStrategicAnalysis(responseText);

    return {
      analysis,
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
    };
  } catch (error) {
    console.error("Failed to parse strategic analysis:", responseText);
    throw new Error("Invalid strategic analysis format");
  }
}

async function generateBusinessPlanContent(
  idea: string,
  strategicAnalysis: StrategicAnalysis,
  detectedProjectName: string | null,
  language: string
): Promise<{
  content: string;
  promptTokens: number;
  completionTokens: number;
}> {
  const prompt = preparePlanPrompt(
    idea,
    strategicAnalysis,
    detectedProjectName,
    language
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a senior business consultant. Generate professional, long-form business plans in ${language}.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 10000,
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Failed to generate business plan");
  }

  return {
    content,
    promptTokens: completion.usage?.prompt_tokens || 0,
    completionTokens: completion.usage?.completion_tokens || 0,
  };
}

async function generateBrandingSection(
  idea: string,
  strategicAnalysis: StrategicAnalysis,
  detectedProjectName: string | null,
  language: string
): Promise<{
  content: string;
  promptTokens: number;
  completionTokens: number;
}> {
  const prompt = prepareBrandingPrompt(
    idea,
    strategicAnalysis,
    detectedProjectName,
    language
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a brand strategist. Generate professional branding recommendations in ${language}.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.6,
    max_tokens: 2000,
  });

  const content = completion.choices[0]?.message?.content || "";

  return {
    content,
    promptTokens: completion.usage?.prompt_tokens || 0,
    completionTokens: completion.usage?.completion_tokens || 0,
  };
}


export async function generateEnhancedPlan(
  options: GeneratePlanOptions
): Promise<EnhancedPlanResponse> {
  const { idea } = options;

  const analysisResult = await analyzeBusinessIdea(idea);
  const { analysis: strategicAnalysis } = analysisResult;

  const detectedProjectName = strategicAnalysis.project_name || null;
  const language = detectLanguage(idea, strategicAnalysis);

  const planResult = await generateBusinessPlanContent(
    idea,
    strategicAnalysis,
    detectedProjectName,
    language
  );

  const brandingResult = await generateBrandingSection(
    idea,
    strategicAnalysis,
    detectedProjectName,
    language
  );

  const finalPlan = `${planResult.content}\n\n${brandingResult.content}`;

  const totalPromptTokens =
    analysisResult.promptTokens +
    planResult.promptTokens +
    brandingResult.promptTokens;

  const totalCompletionTokens =
    analysisResult.completionTokens +
    planResult.completionTokens +
    brandingResult.completionTokens;

  return {
    plan: finalPlan,
    usage: {
      promptTokens: totalPromptTokens,
      completionTokens: totalCompletionTokens,
      totalTokens: totalPromptTokens + totalCompletionTokens,
    },
    strategicAnalysis,
  };
}