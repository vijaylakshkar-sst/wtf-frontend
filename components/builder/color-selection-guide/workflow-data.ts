import { CameraIcon, FileIcon, PaletteIcon } from "@/components/icons";

export const colorSelectionGuideSteps = [
  { id: "upload", eyebrow: "Step 1", shortLabel: "1", title: "Color Selection guide Upload", description: "Upload your colour selection guide to begin extraction.", icon: FileIcon },
  { id: "colour-review", eyebrow: "Step 2", shortLabel: "2", title: "AI Colour Combination Review", description: "Review compatible colour combinations generated from the guide.", icon: PaletteIcon },
  { id: "success", eyebrow: "Step 3", shortLabel: "3", title: "Color Selection guide Added", description: "Your colour selection guide was added successfully.", icon: CameraIcon },
] as const;

export type ColorSelectionGuideStepId = (typeof colorSelectionGuideSteps)[number]["id"];
