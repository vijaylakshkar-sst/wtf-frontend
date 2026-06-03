import type { ReactNode } from "react";
import type { createDisplayHomeSteps } from "@/components/builder/display-homes/create/workflow-data";

type StepShellProps = {
  step: (typeof createDisplayHomeSteps)[number];
  children: ReactNode;
};

export function StepShell({ step, children }: StepShellProps) {
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
