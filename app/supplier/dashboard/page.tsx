import type { Metadata } from "next";
import { SupplierDashboard } from "@/components/supplier/supplier-dashboard";

export const metadata: Metadata = {
  title: "Supplier dashboard",
  robots: { index: false, follow: false },
};

export default function SupplierDashboardPage() {
  return <SupplierDashboard />;
}
