import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/about", "/login", "/demo", "/contact", "/terms", "/privacy", "/api/auth/login", "/api/auth/logout"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/reports")
  ) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`),
  );

  const session = request.cookies.get("ern_session_email")?.value;

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};