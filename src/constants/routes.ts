export const ROUTES = {
  HOME: "/",
  
  AUTH: {
    SIGNIN: "/api/auth/signin",
    SIGNOUT: "/api/auth/signout",
    ERROR: "/auth/error",
  },

  DASHBOARD: "/dashboard",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type AuthRouteKey = keyof typeof ROUTES.AUTH;
