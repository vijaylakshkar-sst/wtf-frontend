import type { Metadata } from "next";
import { ColorSelectionGuidePage } from "@/components/builder/color-selection-guide/color-selection-guide-page";

export const metadata: Metadata = { title: "Color Selection guide", robots: { index: false, follow: false } };

export default function BuilderColorSelectionGuidePage() {
  return <ColorSelectionGuidePage />;
}
