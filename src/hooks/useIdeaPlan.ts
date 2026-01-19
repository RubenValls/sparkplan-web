import { ROUTES } from "@/config";
import { PlanResultInterface } from "@/types";
import { useState } from "react";

export function useIdeaPlan() {
  const [result, setResult] = useState<PlanResultInterface | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async (idea: string) => {
    setLoading(true);
    try {
      const response = await fetch(ROUTES.API.GENERATE_PLAN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setResult({
        success: true,
        message: "SUCCESS_MESSAGE",
        plan: data.plan,
        rateLimit: data.rateLimit,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "ERROR_MESSAGE",
      });
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, generatePlan };
}
