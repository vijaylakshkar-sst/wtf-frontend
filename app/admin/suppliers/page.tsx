import type { Metadata } from "next";
import { AdminDirectoryPage } from "@/components/admin/admin-directory-page";

export const metadata: Metadata = { title: "Suppliers | Admin portal", robots: { index: false, follow: false } };

export default function AdminSuppliersPage() {
  return <AdminDirectoryPage type="suppliers" />;
}
