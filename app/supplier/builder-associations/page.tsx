import type { Metadata } from "next";
import { BuilderAssociationsPage } from "@/components/supplier/builder-associations/builder-associations-page";

export const metadata: Metadata = { title: "Supplier builder associations", robots: { index: false, follow: false } };

export default function SupplierBuilderAssociationsRoute() {
  return <BuilderAssociationsPage />;
}
