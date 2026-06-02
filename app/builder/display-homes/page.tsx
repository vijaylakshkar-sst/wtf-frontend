import type { Metadata } from "next";
import { DisplayHomesPage } from "@/components/builder/display-homes/display-homes-page";

export const metadata: Metadata = { title: "Display homes", robots: { index: false, follow: false } };

export default function BuilderDisplayHomesPage() {
  return <DisplayHomesPage />;
}
