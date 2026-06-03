import type { Metadata } from "next";
import { MasterCrudPage } from "@/components/builder/masters/master-crud-page";
import { masterConfigs } from "@/components/builder/masters/data";

export const metadata: Metadata = { title: "Brand master", robots: { index: false, follow: false } };

export default function BrandsMasterRoute() {
  return <MasterCrudPage config={masterConfigs.brands} />;
}
