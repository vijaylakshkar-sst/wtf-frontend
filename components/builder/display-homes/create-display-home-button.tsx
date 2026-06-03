"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@/components/icons";

export function CreateDisplayHomeButton() {
  const router = useRouter();

  return (
    <button className="builder-primary" onClick={() => router.push("/builder/display-homes/create")} type="button">
      <PlusIcon size={18} /> Create display home
    </button>
  );
}
