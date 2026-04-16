// src/middleware.ts
// Protects routes that require authentication or admin role

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Block non-admins from /admin
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isAccountRoute = req.nextUrl.pathname.startsWith("/account");

        // Admin routes require token + admin role
        if (isAdminRoute) return token?.role === "ADMIN";

        // Account routes require any logged-in user
        if (isAccountRoute) return !!token;

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
};
