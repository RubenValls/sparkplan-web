"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import PricingPlans from "@/components/pricing/PricingPlans/PricingPlans";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useStripePortal } from "@/hooks/useStripePortal";
import { getUserByEmail } from "@/lib/supabase";
import { STRIPE_PRICE_IDS } from "@/config";
import type { PlanType } from "@/types/pricing";

export default function PlansPage() {
  const t = useTranslations("PLANS");
  const { data: session } = useSession();
  const { createCheckoutSession, loading: checkoutLoading } = useStripeCheckout();
  const { openPortal, loading: portalLoading } = useStripePortal();
  const [currentPlan, setCurrentPlan] = useState<PlanType>("FREE");

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!session?.user?.email) return;

      const user = await getUserByEmail(session.user.email);
      if (user?.subscription) {
        setCurrentPlan(user.subscription as PlanType);
      }
    };

    fetchUserPlan();
  }, [session]);

  const handlePlusPlan = () => {
    createCheckoutSession(STRIPE_PRICE_IDS.PLUS);
  };

  const handleProPlan = () => {
    createCheckoutSession(STRIPE_PRICE_IDS.PRO);
  };

  const handleManageSubscription = () => {
    openPortal();
  };

  const isLoading = checkoutLoading || portalLoading;

  return (
    <div style={{ padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          {t("TITLE")}
        </h1>
        <p style={{ fontSize: "1.125rem", color: "var(--color-muted)" }}>
          {t("SUBTITLE")}
        </p>
      </div>

      <PricingPlans
        currentPlan={currentPlan}
        showButtons={{ free: false, plus: true, pro: true }}
        onPlusPlanClick={handlePlusPlan}
        onProPlanClick={handleProPlan}
        onManageSubscription={handleManageSubscription}
        isLoading={isLoading}
      />
    </div>
  );
}