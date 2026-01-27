"use client";

import PricingCard from "@/components/ui/PricingCard/PricingCard";
import styles from "./PricingPlans.module.scss";
import type { PlanType } from "@/types/pricing";

interface PricingPlansProps {
  currentPlan?: PlanType;
  showButtons?: {
    free?: boolean;
    plus?: boolean;
    pro?: boolean;
  };
  onFreePlanClick?: () => void;
  onPlusPlanClick?: () => void;
  onProPlanClick?: () => void;
  onManageSubscription?: () => void;
  isLoading?: boolean;
}

export default function PricingPlans({
  currentPlan,
  showButtons = { free: true, plus: true, pro: true },
  onFreePlanClick,
  onPlusPlanClick,
  onProPlanClick,
  onManageSubscription,
  isLoading = false,
}: PricingPlansProps) {
  const hasPaidPlan = currentPlan === "PLUS" || currentPlan === "PRO";

  return (
    <div className={styles.pricing}>
      <PricingCard
        plan="FREE"
        isCurrentPlan={currentPlan === "FREE"}
        showButton={showButtons.free}
        onButtonClick={onFreePlanClick}
        isLoading={isLoading && currentPlan === "FREE"}
      />
      <PricingCard
        plan="PLUS"
        isPopular={currentPlan !== "PLUS"}
        isCurrentPlan={currentPlan === "PLUS"}
        showButton={hasPaidPlan ? currentPlan === "PLUS" : showButtons.plus}
        buttonVariant={currentPlan === "PLUS" ? "manage" : "default"}
        onButtonClick={currentPlan === "PLUS" ? onManageSubscription : onPlusPlanClick}
        isLoading={isLoading && (currentPlan === "PLUS" || (!hasPaidPlan && showButtons.plus))}
      />
      <PricingCard
        plan="PRO"
        isCurrentPlan={currentPlan === "PRO"}
        showButton={hasPaidPlan ? currentPlan === "PRO" : showButtons.pro}
        buttonVariant={currentPlan === "PRO" ? "manage" : "default"}
        onButtonClick={currentPlan === "PRO" ? onManageSubscription : onProPlanClick}
        isLoading={isLoading && (currentPlan === "PRO" || (!hasPaidPlan && showButtons.pro))}
      />
    </div>
  );
}