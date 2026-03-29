import { useState } from "react";
import { ROUTES } from "@/config";
import type { PlanResultInterface } from "@/types";

interface UseIdeaPlanReturn {
  result: PlanResultInterface | null;
  loading: boolean;
  generatePlan: (idea: string) => Promise<PlanResultInterface>;
  setResult: (result: PlanResultInterface | null) => void;
}

export function useIdeaPlan(): UseIdeaPlanReturn {
  const [result, setResult] = useState<PlanResultInterface | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async (idea: string): Promise<PlanResultInterface> => {
    setLoading(true);
    
    try {
      const response = await fetch(ROUTES.API.GENERATE_PLAN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();

      if (response.status === 422 && data.error === "INVALID_IDEA") {
        const errorResult: PlanResultInterface = {
          success: false,
          message: "INVALID_IDEA_ERROR",
        };
        setResult(errorResult);
        return errorResult;
      }

      if (response.status === 429 && data.error === "USAGE_LIMIT_REACHED") {
        const errorResult: PlanResultInterface = {
          success: false,
          message: "USAGE_LIMIT_REACHED",
          errorData: data.data,
        };
        setResult(errorResult);
        return errorResult;
      }

      if (!response.ok) {
        const errorResult: PlanResultInterface = {
          success: false,
          message: data.message || "ERROR_MESSAGE",
        };
        setResult(errorResult);
        return errorResult;
      }

      const successResult: PlanResultInterface = {
        success: true,
        message: "SUCCESS_MESSAGE",
        plan: data.plan,
        rateLimit: data.rateLimit,
        errorData: data.usageInfo,
      };
      setResult(successResult);
      return successResult;
    } catch (error) {
      const errorResult: PlanResultInterface = {
        success: false,
        message: error instanceof Error ? error.message : "ERROR_MESSAGE",
      };
      setResult(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, generatePlan, setResult };
}