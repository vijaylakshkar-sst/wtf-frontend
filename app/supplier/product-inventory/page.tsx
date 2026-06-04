import type { Metadata } from "next";
import { ProductInventoryPage } from "@/components/supplier/product-inventory/product-inventory-page";

export const metadata: Metadata = { title: "Supplier product inventory", robots: { index: false, follow: false } };

export default function SupplierProductInventoryRoute() {
  return <ProductInventoryPage />;
}
