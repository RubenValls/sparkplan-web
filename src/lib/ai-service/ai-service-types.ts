export interface StrategicAnalysis {
  is_valid_idea: boolean;
  detected_language?: string;
  project_name: string | null;
  user_provided: string[];
  gaps: string[];
  strategic_decisions: {
    target_hypothesis: string[];
    monetization_options: string[];
    positioning: string;
    market_approach: string;
  };
  naming_suggestions?: string[];
}

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

export interface EnhancedPlanResponse extends GeneratePlanResponse {
  strategicAnalysis?: StrategicAnalysis;
}