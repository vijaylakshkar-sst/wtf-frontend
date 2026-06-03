import type { Metadata } from "next";
import { RolesPermissionsPage } from "@/components/builder/roles-permissions/roles-permissions-page";

export const metadata: Metadata = { title: "Roles & Permissions", robots: { index: false, follow: false } };

export default function RolesPermissionsRoute() {
  return <RolesPermissionsPage />;
}
