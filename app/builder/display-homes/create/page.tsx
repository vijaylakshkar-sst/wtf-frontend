import type { Metadata } from "next";
import { CreateDisplayHomePage } from "@/components/builder/display-homes/create/create-display-home-page";

export const metadata: Metadata = { title: "Create display home", robots: { index: false, follow: false } };

export default function BuilderCreateDisplayHomePage() {
  return <CreateDisplayHomePage />;
}
