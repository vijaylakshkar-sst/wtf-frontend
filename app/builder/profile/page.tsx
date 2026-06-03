import type { Metadata } from "next";
import { UpdateProfilePage } from "@/components/builder/account/update-profile-page";

export const metadata: Metadata = { title: "Update profile", robots: { index: false, follow: false } };

export default function BuilderProfilePage() {
  return <UpdateProfilePage />;
}
