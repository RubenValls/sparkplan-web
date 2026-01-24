import { chain } from "@/middleware/chain";
import { withAuth } from "@/middleware/auth";

export default chain([withAuth]);

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/plans",
    "/plans/:path*",
  ],
};