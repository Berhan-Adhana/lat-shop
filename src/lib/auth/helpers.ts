// src/lib/auth/helpers.ts
// Reusable auth helpers used across API routes and server components

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth.options";

// ─── Get current session (use in server components & API routes) ───
export async function getSession() {
  return await getServerSession(authOptions);
}

// ─── Get current user or return 401 (use in API routes) ───────────
export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      ),
    };
  }

  return { user: session.user, error: null };
}

// ─── Require admin role (use in admin API routes) ──────────────────
export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { user: session.user, error: null };
}

// ─── Example usage in an API route ────────────────────────────────
//
// export async function GET() {
//   const { user, error } = await requireAuth();
//   if (error) return error;
//   // user is available here with id, email, role
// }
//
// export async function DELETE() {
//   const { user, error } = await requireAdmin();
//   if (error) return error;
//   // only admins reach here
// }
