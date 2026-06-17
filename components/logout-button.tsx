"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/icons";
import { authApi, clearAuthSession } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } catch {
      // Local session should still be cleared if the server session is already gone.
    } finally {
      clearAuthSession();
      router.replace("/sign-in");
    }
  };

  return (
    <button className="profile-drawer-action" disabled={isLoggingOut} onClick={logout} type="button">
      <LogoutIcon size={17} /> {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
