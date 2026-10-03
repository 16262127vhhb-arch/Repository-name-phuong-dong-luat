import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/quan-tri/dang-nhap") {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(
      new URL("/quan-tri/dang-nhap", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/quan-tri/:path*"],
};