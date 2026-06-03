import type { Metadata } from "next";
import { AddProductPage } from "@/components/builder/products/add-product-page";

export const metadata: Metadata = { title: "Add product manually", robots: { index: false, follow: false } };

export default function BuilderAddProductPage() {
  return <AddProductPage />;
}
