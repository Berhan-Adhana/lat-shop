// src/app/api/auth/[...nextauth]/route.ts
// This one file handles ALL auth endpoints:
// POST /api/auth/signin
// POST /api/auth/signout
// GET  /api/auth/session
// GET  /api/auth/csrf

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth.options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
