import { GoogleGenerativeAI } from "@google/generative-ai";
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

const genAI = new GoogleGenerativeAI(env.googleAiApiKey);

const GEMINI_MODEL_ANALYSIS = "gemini-2.0-flash-lite";
const GEMINI_MODEL_CONTENT  = "gemini-2.5-flash";

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
    .replace("{target}", strategicAnalysis.strategic_decisions.target_hypothesis.join(", "))
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

// ============================================
// GEMINI: Analysis
// ============================================

async function analyzeBusinessIdeaWithGemini(idea: string): Promise<{
  analysis: StrategicAnalysis;
  promptTokens: number;
  completionTokens: number;
}> {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_ANALYSIS });
  const prompt = prepareAnalysisPrompt(idea);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 1500,
      responseMimeType: "application/json",
    },
  });

  const responseText = result.response.text();

  try {
    const analysis = parseStrategicAnalysis(responseText);
    const estimatedPromptTokens = Math.ceil(prompt.length / 4);
    const estimatedCompletionTokens = Math.ceil(responseText.length / 4);

    return { analysis, promptTokens: estimatedPromptTokens, completionTokens: estimatedCompletionTokens };
  } catch (error) {
    console.error("Failed to parse Gemini analysis:", responseText);
    throw new Error("Invalid strategic analysis format from Gemini");
  }
}

// ============================================
// GEMINI: Business Plan
// ============================================

async function generateBusinessPlanWithGemini(
  idea: string,
  strategicAnalysis: StrategicAnalysis,
  detectedProjectName: string | null,
  language: string
): Promise<{
  content: string;
  promptTokens: number;
  completionTokens: number;
}> {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_CONTENT });
  const prompt = preparePlanPrompt(idea, strategicAnalysis, detectedProjectName, language);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 10000,
    },
  });

  const content = result.response.text();

  if (!content) {
    throw new Error("Failed to generate business plan with Gemini");
  }

  const estimatedPromptTokens = Math.ceil(prompt.length / 4);
  const estimatedCompletionTokens = Math.ceil(content.length / 4);

  return { content, promptTokens: estimatedPromptTokens, completionTokens: estimatedCompletionTokens };
}

// ============================================
// GEMINI: Branding
// ============================================

async function generateBrandingWithGemini(
  idea: string,
  strategicAnalysis: StrategicAnalysis,
  detectedProjectName: string | null,
  language: string
): Promise<{
  content: string;
  promptTokens: number;
  completionTokens: number;
}> {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_CONTENT });
  const prompt = prepareBrandingPrompt(idea, strategicAnalysis, detectedProjectName, language);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 5000,
    },
  });

  const content = result.response.text();

  const estimatedPromptTokens = Math.ceil(prompt.length / 4);
  const estimatedCompletionTokens = Math.ceil(content.length / 4);

  return { content, promptTokens: estimatedPromptTokens, completionTokens: estimatedCompletionTokens };
}

// ============================================
// ORCHESTRATION
// ============================================

export async function generateHybridPlan(
  options: GeneratePlanOptions
): Promise<EnhancedPlanResponse> {
  const { idea } = options;

  const analysisResult = await analyzeBusinessIdeaWithGemini(idea);
  const { analysis: strategicAnalysis } = analysisResult;

  const detectedProjectName = strategicAnalysis.project_name || null;
  const language = detectLanguage(idea, strategicAnalysis);

  const planResult = await generateBusinessPlanWithGemini(
    idea,
    strategicAnalysis,
    detectedProjectName,
    language
  );

  const brandingResult = await generateBrandingWithGemini(
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