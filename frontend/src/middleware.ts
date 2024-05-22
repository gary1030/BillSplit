// a middleware to check user authentication and redirect to home page if not authenticated

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("token")?.value;
  if (accessToken) {
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/group", req.url));
    }
    return NextResponse.next();
  }

  if (req.nextUrl.pathname !== "/") {
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.append("redirect_uri", req.nextUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/group/:path*", "/invite/:path*", "/"],
};
