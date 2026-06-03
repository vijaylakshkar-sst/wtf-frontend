import type { Metadata } from "next";
import { MasterCrudPage } from "@/components/builder/masters/master-crud-page";
import { masterConfigs } from "@/components/builder/masters/data";

export const metadata: Metadata = { title: "Room Mapping master", robots: { index: false, follow: false } };

export default function RoomMappingMasterRoute() {
  return <MasterCrudPage config={masterConfigs["room-mapping"]} />;
}
