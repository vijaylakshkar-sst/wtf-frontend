import type { Metadata } from "next";
import { AdminChangePasswordPage } from "@/components/admin/account/admin-change-password-page";

export const metadata: Metadata = {
  title: "Change password | Admin portal",
  robots: { index: false, follow: false },
};

export default function AdminChangePasswordRoute() {
  return <AdminChangePasswordPage />;
}
