"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { ArrowIcon, SparklesIcon } from "@/components/icons";
import { CreateStepper } from "@/components/builder/display-homes/create/create-stepper";
import { ClassificationStep } from "@/components/builder/display-homes/create/steps/classification-step";
import { DetailsStep } from "@/components/builder/display-homes/create/steps/details-step";
import { FloorPlanStep } from "@/components/builder/display-homes/create/steps/floor-plan-step";
import { QrStep } from "@/components/builder/display-homes/create/steps/qr-step";
import { RoomsStep } from "@/components/builder/display-homes/create/steps/rooms-step";
import { createDisplayHomeSteps, type CreateDisplayHomeStepId } from "@/components/builder/display-homes/create/workflow-data";

type CreateDisplayHomeStepProps = {
  onValidityChange?: (isValid: boolean) => void;
  validationAttempt?: number;
} & Record<string, unknown>;

type CreateDisplayHomeStepComponent = ComponentType<CreateDisplayHomeStepProps>;

const stepComponents: Record<CreateDisplayHomeStepId, CreateDisplayHomeStepComponent> = {
  details: DetailsStep,
  classification: ClassificationStep,
  "floor-plan": FloorPlanStep,
  rooms: RoomsStep,
  qr: QrStep,
};

export function CreateDisplayHomePage() {
  const [activeStep, setActiveStep] = useState<CreateDisplayHomeStepId>("details");
  const [isDetailsStepValid, setIsDetailsStepValid] = useState(true);
  const [isClassificationStepValid, setIsClassificationStepValid] = useState(true);
  const [isFloorPlanStepValid, setIsFloorPlanStepValid] = useState(true);
  const [detailsValidationAttempt, setDetailsValidationAttempt] = useState(0);
  const [classificationValidationAttempt, setClassificationValidationAttempt] = useState(0);
  const [floorPlanValidationAttempt, setFloorPlanValidationAttempt] = useState(0);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isRoomStepConfirmOpen, setIsRoomStepConfirmOpen] = useState(false);
  const generationTimerRef = useRef<number | null>(null);

  const activeIndex = createDisplayHomeSteps.findIndex((step) => step.id === activeStep);
  const nextStep = useMemo(
    () => createDisplayHomeSteps[Math.min(activeIndex + 1, createDisplayHomeSteps.length - 1)]?.id,
    [activeIndex],
  );
  const previousStep = useMemo(
    () => createDisplayHomeSteps[Math.max(activeIndex - 1, 0)]?.id,
    [activeIndex],
  );

  useEffect(() => {
    return () => {
      if (generationTimerRef.current) {
        window.clearTimeout(generationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "If you refresh, the current selection data will be lost before you save it.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const goToNextStep = () => {
    if (!nextStep) {
      return;
    }

    if (activeStep === "details" && !isDetailsStepValid) {
      setDetailsValidationAttempt((value) => value + 1);
      return;
    }

    if (activeStep === "classification" && !isClassificationStepValid) {
      setClassificationValidationAttempt((value) => value + 1);
      return;
    }

    if (activeStep === "floor-plan" && !isFloorPlanStepValid) {
      setFloorPlanValidationAttempt((value) => value + 1);
      return;
    }

    if (activeStep === "rooms") {
      setIsRoomStepConfirmOpen(true);
      return;
    }

    setActiveStep(nextStep);
  };

  const confirmRoomStepNext = () => {
    if (!nextStep) {
      return;
    }

    setIsRoomStepConfirmOpen(false);
    setIsGeneratingAi(true);

    if (generationTimerRef.current) {
      window.clearTimeout(generationTimerRef.current);
    }

    generationTimerRef.current = window.setTimeout(() => {
      setActiveStep(nextStep);
      setIsGeneratingAi(false);
      generationTimerRef.current = null;
    }, 1800);
  };

  const cancelRoomStepNext = () => {
    setIsRoomStepConfirmOpen(false);
  };

  const isWorkflowLoading = isGeneratingAi;
  const getLoaderMessage = () => {
    if (activeStep === "rooms") {
      return "Submitting your data and preparing the next step.";
    }

    return "Please wait while we prepare the next step.";
  };

  const renderActiveStep = () => {
    const ActiveStep = stepComponents[activeStep];

    if (activeStep === "details") {
      return <ActiveStep onValidityChange={setIsDetailsStepValid} validationAttempt={detailsValidationAttempt} />;
    }

    if (activeStep === "classification") {
      return <ActiveStep onValidityChange={setIsClassificationStepValid} validationAttempt={classificationValidationAttempt} />;
    }

    if (activeStep === "floor-plan") {
      return <ActiveStep onValidityChange={setIsFloorPlanStepValid} validationAttempt={floorPlanValidationAttempt} />;
    }

    return <ActiveStep />;
  };

  return (
    <BuilderShell>
      <section className="builder-main create-home-main">
        <div
          className="create-home-shell wide"
          style={{ maxWidth: "none", width: "100%" }}
        >
          <header className="create-home-header">
            <div className="create-home-breadcrumb">
              <Link href="/builder/display-homes">Create display home</Link>
              <ArrowIcon size={16} />
              <span>{createDisplayHomeSteps[activeIndex].eyebrow} of {createDisplayHomeSteps.length}: {createDisplayHomeSteps[activeIndex].title}</span>
            </div>
            <CreateStepper activeStep={activeStep} />
          </header>
          <div className="create-home-workflow-stage">
            {renderActiveStep()}
            {isWorkflowLoading ? (
              <div className="create-home-ai-loader" role="status" aria-live="polite" aria-label="Generating AI data">
                <span className="create-home-ai-loader-orb">
                  <SparklesIcon size={20} />
                </span>
                <strong>AI generating your data</strong>
                <p>{getLoaderMessage()}</p>
              </div>
            ) : null}
          </div>
          {activeStep !== "qr" ? (
            <footer className="create-home-workflow-actions">
              <button disabled={activeIndex === 0} onClick={() => setActiveStep(previousStep)} type="button">
                <span aria-hidden="true">&#8592;</span> Back
              </button>
              <button
                className="create-home-primary"
                disabled={activeIndex === createDisplayHomeSteps.length - 1 || isWorkflowLoading}
                onClick={goToNextStep}
                type="button"
              >
                Next step <ArrowIcon size={15} />
              </button>
            </footer>
          ) : null}
        </div>
      </section>

      {isRoomStepConfirmOpen ? (
        <div className="staff-modal-overlay" onClick={cancelRoomStepNext} role="presentation">
          <section
            aria-labelledby="room-step-confirm-title"
            aria-modal="true"
            className="staff-modal create-home-confirm-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header>
              <span><SparklesIcon size={20} /></span>
              <div>
                <h2 id="room-step-confirm-title">Continue to QR generation?</h2>
                <p>The room list is confirmed. We can move to the QR generation step next.</p>
              </div>
            </header>

            <div className="staff-modal-form">
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Before moving ahead, please confirm that the detected rooms are correct. If yes, we will open the QR step next.
              </p>
            </div>

            <footer>
              <button onClick={cancelRoomStepNext} type="button">
                Not yet
              </button>
              <button className="primary" onClick={confirmRoomStepNext} type="button">
                Confirm and continue
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </BuilderShell>
  );
}
