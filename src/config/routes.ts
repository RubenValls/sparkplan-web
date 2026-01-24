export const ROUTES = {
  HOME: "/",
  
  AUTH: {
    SIGNIN: "/api/auth/signin",
    SIGNOUT: "/api/auth/signout",
    ERROR: "/auth/error",
  },

  DASHBOARD: "/dashboard",

  PLANS: "/plans",

  API: {
    GENERATE_PLAN: "/api/generate-plan",
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
export type AuthRouteKey = keyof typeof ROUTES.AUTH;
