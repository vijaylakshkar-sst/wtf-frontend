import type { Metadata } from "next";
import { SupplierProductManagementPage } from "@/components/supplier/product-management/supplier-product-management-page";

export const metadata: Metadata = {
  title: "Supplier product management",
  robots: { index: false, follow: false },
};

export default function SupplierProductManagementRoute() {
  return <SupplierProductManagementPage />;
}
