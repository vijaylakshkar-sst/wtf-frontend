import type { Metadata } from "next";
import { SupplierMasterPage } from "@/components/supplier/product-management/supplier-master-page";

export const metadata: Metadata = { title: "Supplier brand master", robots: { index: false, follow: false } };

export default function SupplierBrandsRoute() {
  return <SupplierMasterPage slug="brands" />;
}
