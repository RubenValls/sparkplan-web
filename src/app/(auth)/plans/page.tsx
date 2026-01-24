"use client";

import { useTranslations } from "next-intl";
import PricingPlans from "@/components/pricing/PricingPlans/PricingPlans";

export default function PlansPage() {
  const t = useTranslations("PLANS");

  // TODO: Obtener el plan actual del usuario desde Supabase
  const currentPlan = "FREE"; // Temporal

  const handlePlusPlan = () => {
    console.log("Iniciar pago PLUS");
    // TODO: Integrar con Stripe/PayPal
  };

  const handleProPlan = () => {
    console.log("Iniciar pago PRO");
    // TODO: Integrar con Stripe/PayPal
  };

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
      />
    </div>
  );
}