import type { Metadata } from "next";
import { AdminCmsManagementPage } from "@/components/admin/admin-cms-management-page";

export const metadata: Metadata = { title: "CMS Management | Admin portal", robots: { index: false, follow: false } };

export default function AdminCmsManagementRoute() {
  return <AdminCmsManagementPage />;
}
