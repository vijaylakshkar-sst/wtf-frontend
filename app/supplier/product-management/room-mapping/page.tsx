import type { Metadata } from "next";
import { SupplierMasterPage } from "@/components/supplier/product-management/supplier-master-page";

export const metadata: Metadata = { title: "Supplier room mapping master", robots: { index: false, follow: false } };

export default function SupplierRoomMappingRoute() {
  return <SupplierMasterPage slug="room-mapping" />;
}
