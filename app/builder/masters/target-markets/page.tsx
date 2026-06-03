import type { Metadata } from "next";
import { MasterCrudPage } from "@/components/builder/masters/master-crud-page";
import { masterConfigs } from "@/components/builder/masters/data";

export const metadata: Metadata = { title: "Target Market master", robots: { index: false, follow: false } };

export default function TargetMarketsMasterRoute() {
  return <MasterCrudPage config={masterConfigs["target-markets"]} />;
}
