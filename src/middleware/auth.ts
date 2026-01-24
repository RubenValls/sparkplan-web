import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { MiddlewareFactory } from "./chain";
import { ROUTES } from "@/config";

export const withAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    const protectedRoutes = ["/dashboard", "/plans"];

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtected) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {        
        const url = new URL(ROUTES.HOME, request.url);
        return NextResponse.redirect(url);
      }
    }

    return next(request);
  };
};