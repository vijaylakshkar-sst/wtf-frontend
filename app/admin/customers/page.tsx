import type { Metadata } from "next";
import { AdminDirectoryPage } from "@/components/admin/admin-directory-page";

export const metadata: Metadata = { title: "Customers | Admin portal", robots: { index: false, follow: false } };

export default function AdminCustomersPage() {
  return <AdminDirectoryPage type="customers" />;
}
