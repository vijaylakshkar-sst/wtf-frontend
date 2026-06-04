import type { Metadata } from "next";
import { SupplierProductPdfUploadPage } from "@/components/supplier/product-management/supplier-product-pdf-upload-page";

export const metadata: Metadata = { title: "Upload supplier product PDF", robots: { index: false, follow: false } };

export default function SupplierProductPdfUploadRoute() {
  return <SupplierProductPdfUploadPage />;
}
