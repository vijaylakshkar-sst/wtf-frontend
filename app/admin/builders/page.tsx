import type { Metadata } from "next";
import { AdminDirectoryPage } from "@/components/admin/admin-directory-page";

export const metadata: Metadata = { title: "Builders | Admin portal", robots: { index: false, follow: false } };

export default function AdminBuildersPage() {
  return <AdminDirectoryPage type="builders" />;
}
