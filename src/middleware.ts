import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const publicPages = new Set(["/signin", "/forgot-password", "/reset-password", "/verify-email"]);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  if (publicPages.has(pathname)) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // Must match the custom cookie configured in lib/auth.ts.
    cookieName: "next-auth.session-token-delivaryboy",
  });
  if (!token?.id || !token.accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|images/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|mp4|woff|woff2)$).*)"],
};
