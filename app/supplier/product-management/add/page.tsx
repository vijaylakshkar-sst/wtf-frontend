import type { Metadata } from "next";
import { AddSupplierProductPage } from "@/components/supplier/product-management/add-supplier-product-page";

export const metadata: Metadata = { title: "Add supplier product", robots: { index: false, follow: false } };

export default function SupplierAddProductRoute() {
  return <AddSupplierProductPage />;
}
