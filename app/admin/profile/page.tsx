import type { Metadata } from "next";
import { AdminProfilePage } from "@/components/admin/account/admin-profile-page";

export const metadata: Metadata = {
  title: "Update profile | Admin portal",
  robots: { index: false, follow: false },
};

export default function AdminProfileRoute() {
  return <AdminProfilePage />;
}
