import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./authStore";
import { UserRole } from "../types/ndh";

// Client-side defense-in-depth redirect for portal routes. The REAL security
// boundary is server-side (every sensitive endpoint under /api/* is
// independently role-checked -- see server/auth.ts requireRole), so this
// does not need to be bulletproof against someone disabling JavaScript; it
// just avoids showing an obviously-wrong portal shell to a logged-out or
// wrong-role visitor who navigates here directly, and bounces them home
// instead of letting them sit on a portal screen that can fetch no real data.
export function usePortalGuard(allowedRoles: UserRole[]) {
  const { user, isSessionLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSessionLoading) return;
    if (!user || !allowedRoles.includes(user.role)) {
      void navigate({ to: "/" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSessionLoading]);

  return { user, isSessionLoading };
}
