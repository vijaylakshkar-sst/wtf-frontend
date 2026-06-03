import type { Metadata } from "next";
import { ProductPdfUploadPage } from "@/components/builder/products/upload-pdf/product-pdf-upload-page";

export const metadata: Metadata = { title: "Upload product PDF", robots: { index: false, follow: false } };

export default function BuilderProductPdfUploadPage() {
  return <ProductPdfUploadPage />;
}
