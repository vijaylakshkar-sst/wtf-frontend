import type { ReactNode } from "react";
import type { productGuideSteps } from "@/components/builder/product-guide/workflow-data";

type StepShellProps = {
  step: (typeof productGuideSteps)[number];
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
