// src/hooks/useAuth.ts
// Simple hook to access current user in any client component

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const user = session?.user ?? null;

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const requireLogin = (callbackUrl?: string) => {
    if (!isAuthenticated && !isLoading) {
      router.push(`/login${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    logout,
    requireLogin,
  };
}
