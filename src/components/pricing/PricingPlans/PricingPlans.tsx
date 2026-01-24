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
}

export default function PricingPlans({
  currentPlan,
  showButtons = { free: true, plus: true, pro: true },
  onFreePlanClick,
  onPlusPlanClick,
  onProPlanClick,
}: PricingPlansProps) {
  return (
    <div className={styles.pricing}>
      <PricingCard
        plan="FREE"
        isCurrentPlan={currentPlan === "FREE"}
        showButton={showButtons.free}
        onButtonClick={onFreePlanClick}
      />
      <PricingCard
        plan="PLUS"
        isPopular
        isCurrentPlan={currentPlan === "PLUS"}
        showButton={showButtons.plus}
        onButtonClick={onPlusPlanClick}
      />
      <PricingCard
        plan="PRO"
        isCurrentPlan={currentPlan === "PRO"}
        showButton={showButtons.pro}
        onButtonClick={onProPlanClick}
      />
    </div>
  );
}