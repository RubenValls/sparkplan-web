import { UsageLimitErrorResponse } from "./usage-limits";

export interface PlanResultInterface {
    success: boolean;
    message: string;
    plan?: string;
    rateLimit?: {
      remaining: number;
      limit: number;
    };
  errorData?: UsageLimitErrorResponse;
  }