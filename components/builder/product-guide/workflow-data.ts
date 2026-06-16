import { CameraIcon, FileIcon, PaletteIcon } from "@/components/icons";

export const productGuideSteps = [
  { id: "upload", eyebrow: "Step 1", shortLabel: "1", title: "Product Guide Upload", description: "Upload your product guide to begin extraction.", icon: FileIcon },
  { id: "colour-review", eyebrow: "Step 2", shortLabel: "2", title: "AI Colour Combination Review", description: "Review compatible colour combinations generated from the guide.", icon: PaletteIcon },
  { id: "success", eyebrow: "Step 3", shortLabel: "3", title: "Product Guide Added", description: "Your product guide was added successfully.", icon: CameraIcon },
] as const;

export type ProductGuideStepId = (typeof productGuideSteps)[number]["id"];
