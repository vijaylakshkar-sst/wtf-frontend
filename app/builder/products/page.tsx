import type { Metadata } from "next";
import { ProductLibraryPage } from "@/components/builder/products/product-library-page";

export const metadata: Metadata = { title: "Product library", robots: { index: false, follow: false } };

export default function BuilderProductsPage() {
  return <ProductLibraryPage />;
}
