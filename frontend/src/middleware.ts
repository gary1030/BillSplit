// a middleware to check user authentication and redirect to home page if not authenticated

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("token")?.value;
  if (accessToken) {
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/user", req.url));
    }
    return NextResponse.next();
  }

  if (req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user", "/group", "/"],
};
