import type { Metadata } from "next";
import { AdminProductModerationPage } from "@/components/admin/admin-product-moderation-page";

export const metadata: Metadata = { title: "Product Moderation | Admin portal", robots: { index: false, follow: false } };

export default function AdminProductModerationRoute() {
  return <AdminProductModerationPage />;
}
