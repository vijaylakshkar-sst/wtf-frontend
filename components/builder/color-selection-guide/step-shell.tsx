import type { ReactNode } from "react";
import { colorSelectionGuideSteps } from "@/components/builder/color-selection-guide/workflow-data";

type StepShellProps = {
  step: (typeof colorSelectionGuideSteps)[number];
  children: ReactNode;
};

export function ColorSelectionGuideStepShell({ step, children }: StepShellProps) {
  const Icon = step.icon;

  return (
    <article className="create-home-panel">
      <header className="create-home-panel-header">
        <span className="create-home-step-icon"><Icon size={20} /></span>
        <div>
          <h2>{step.title}</h2>
          <p>{step.description}</p>
        </div>
      </header>
      {children}
    </article>
  );
}
