import type { Metadata } from "next";
import { SupplierMasterPage } from "@/components/supplier/product-management/supplier-master-page";

export const metadata: Metadata = { title: "Supplier product category master", robots: { index: false, follow: false } };

export default function SupplierProductCategoriesRoute() {
  return <SupplierMasterPage slug="product-categories" />;
}
