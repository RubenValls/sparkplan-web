import { useState, useEffect } from "react";
import type { BusinessPlan } from "@/lib/supabase/types";

interface UsePlanHistoryReturn {
  plans: BusinessPlan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePlanHistory(): UsePlanHistoryReturn {
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/business-plans");

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();
      setPlans(data.plans || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, error, refetch: fetchPlans };
}