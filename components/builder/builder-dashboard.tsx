import { BuilderOverview } from "@/components/builder/builder-overview";
import { BuilderShell } from "@/components/builder/builder-shell";

export function BuilderDashboard() {
  return (
    <BuilderShell>
      <BuilderOverview />
    </BuilderShell>
  );
}
