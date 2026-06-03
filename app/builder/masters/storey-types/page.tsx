import type { Metadata } from "next";
import { MasterCrudPage } from "@/components/builder/masters/master-crud-page";
import { masterConfigs } from "@/components/builder/masters/data";

export const metadata: Metadata = { title: "Storey Type master", robots: { index: false, follow: false } };

export default function StoreyTypesMasterRoute() {
  return <MasterCrudPage config={masterConfigs["storey-types"]} />;
}
