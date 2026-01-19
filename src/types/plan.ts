export interface PlanResultInterface {
    success: boolean;
    message: string;
    plan?: string;
    rateLimit?: {
      remaining: number;
      limit: number;
    };
  }