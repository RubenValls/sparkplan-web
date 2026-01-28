import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/lib/supabase";
import type { SubscriptionType } from "@/lib/supabase/types";

interface UseUserSubscriptionReturn {
  subscription: SubscriptionType;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserSubscription(): UseUserSubscriptionReturn {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionType>("FREE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await getUserByEmail(session.user.email);
      if (user?.subscription) {
        setSubscription(user.subscription);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subscription");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return { 
    subscription, 
    loading, 
    error, 
    refetch: fetchSubscription 
  };
}