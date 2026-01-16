import { chain } from "@/middleware/chain";
import { withAuth } from "@/middleware/auth";


export default chain([
  withAuth
]);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (*.png, *.jpg, *.svg, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};