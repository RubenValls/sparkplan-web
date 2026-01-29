function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnvVar(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const env = {
  nodeEnv: getOptionalEnvVar("NODE_ENV", "development"),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  
  nextAuthSecret: getEnvVar("NEXTAUTH_SECRET"),
  nextAuthUrl: getOptionalEnvVar("NEXTAUTH_URL", "http://localhost:3000"),
  
  googleClientId: getEnvVar("GOOGLE_CLIENT_ID"),
  googleClientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
  
  openaiApiKey: getEnvVar("OPENAI_API_KEY"),
  
  aiAnalysisPrompt: getEnvVar("AI_ANALYSIS_PROMPT"),
  aiPlanGenerationPrompt: getEnvVar("AI_PLAN_GENERATION_PROMPT"),
  aiBrandingPrompt: getEnvVar("AI_BRANDING_PROMPT"),
} as const;

export type Environment = typeof env;

if (
  typeof window === "undefined" && 
  process.env.NODE_ENV !== "test" && 
  !process.env.VITEST
) {
  validateEnv();
}

function validateEnv() {
  const requiredVars = [
    "NEXTAUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "OPENAI_API_KEY",
  ];
  
  const missing = requiredVars.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing.map((v) => `  - ${v}`).join("\n")}\n\nPlease check your .env.local file.`
    );
  }
}