export type SubscriptionType = 'FREE' | 'PLUS' | 'PRO';

export interface User {
  id: string;
  email: string;
  subscription: SubscriptionType;
  sub_expiration_date: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessPlan {
  id: string;
  user_email: string;
  plan_name: string;
  plan: string;
  creation_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessPlanInput {
  user_email: string;
  plan_name: string;
  plan: string;
}