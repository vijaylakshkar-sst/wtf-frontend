import type { Metadata } from "next";
import { ProductGuidePage } from "@/components/builder/product-guide/product-guide-page";

export const metadata: Metadata = { title: "Product guide", robots: { index: false, follow: false } };

export default function BuilderProductGuidePage() {
  return <ProductGuidePage />;
}
