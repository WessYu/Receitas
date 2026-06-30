import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { sessionCookieName } from "@/lib/constants";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  const pathname = request.nextUrl.pathname;
  const secret = getSecret();

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
