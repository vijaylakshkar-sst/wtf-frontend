import type { Metadata } from "next";
import { ChangePasswordPage } from "@/components/builder/account/change-password-page";

export const metadata: Metadata = { title: "Change password", robots: { index: false, follow: false } };

export default function BuilderChangePasswordPage() {
  return <ChangePasswordPage />;
}
