"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearAuthSession,
  getRedirectPathForRoles,
  getStoredAccessToken,
  getStoredAuthUser,
} from "@/lib/api";
import { canAccessBuilderRoute, getFirstAccessibleBuilderPath } from "@/lib/builder-access";

const publicRoutes = new Set([
  "/",
  "/sign-in",
  "/forgot-password",
  "/reset-password",
  "/builder/register",
  "/supplier/register",
]);

const protectedRouteRules = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/supplier", role: "supplier" },
  { prefix: "/builder", role: "builder" },
] as const;

const getRequiredRole = (pathname: string) => {
  if (publicRoutes.has(pathname)) {
    return null;
  }

  return protectedRouteRules.find((rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`))?.role || null;
};

export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowedPath, setAllowedPath] = useState<string | null>(null);

  useEffect(() => {
    let allowTimer: number | null = null;
    const allowPath = () => {
      allowTimer = window.setTimeout(() => {
        setAllowedPath(pathname);
      }, 0);
    };

    const requiredRole = getRequiredRole(pathname);

    if (!requiredRole) {
      allowPath();
      return () => {
        if (allowTimer !== null) {
          window.clearTimeout(allowTimer);
        }
      };
    }

    const user = getStoredAuthUser();
    const accessToken = getStoredAccessToken();

    if (!user || !accessToken) {
      clearAuthSession();
      router.replace("/sign-in");
      return;
    }

    if (user.status !== "active") {
      clearAuthSession();
      router.replace("/sign-in");
      return;
    }

    const roles = user.roles?.map((role) => role.name) || [];

    if (!roles.includes(requiredRole)) {
      router.replace(getRedirectPathForRoles(roles));
      return;
    }

    if (requiredRole === "builder" && !canAccessBuilderRoute(user, pathname)) {
      const fallbackPath = getFirstAccessibleBuilderPath(user);
      router.replace(fallbackPath || "/sign-in");
      return;
    }

    allowPath();

    return () => {
      if (allowTimer !== null) {
        window.clearTimeout(allowTimer);
      }
    };
  }, [pathname, router]);

  if (allowedPath !== pathname) {
    return <main className="route-guard-loading" aria-label="Checking access" />;
  }

  return <>{children}</>;
}
