export type PlanType = 'FREE' | 'PLUS' | 'PRO';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanConfig {
  type: PlanType;
  price: number | null;
  period?: 'month' | 'year';
  features: PlanFeature[];
}