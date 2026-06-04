import type { Metadata } from "next";
import { SupplierMasterPage } from "@/components/supplier/product-management/supplier-master-page";

export const metadata: Metadata = { title: "Supplier inclusion type master", robots: { index: false, follow: false } };

export default function SupplierInclusionTypesRoute() {
  return <SupplierMasterPage slug="inclusion-types" />;
}
