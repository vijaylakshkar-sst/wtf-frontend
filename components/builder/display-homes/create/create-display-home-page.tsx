"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BuilderShell } from "@/components/builder/builder-shell";
import { ArrowIcon, SparklesIcon } from "@/components/icons";
import { CreateStepper } from "@/components/builder/display-homes/create/create-stepper";
import { createDisplayHomeSteps, type CreateDisplayHomeStepId } from "@/components/builder/display-homes/create/workflow-data";
import { ClassificationStep } from "@/components/builder/display-homes/create/steps/classification-step";
import { AiColourCombinationReviewStep } from "@/components/builder/display-homes/create/steps/ai-colour-review-step";
import { DetailsStep } from "@/components/builder/display-homes/create/steps/details-step";
import { FloorPlanStep } from "@/components/builder/display-homes/create/steps/floor-plan-step";
import { QrStep } from "@/components/builder/display-homes/create/steps/qr-step";
import { RoomsStep } from "@/components/builder/display-homes/create/steps/rooms-step";
import { ProductUploadStep } from "@/components/builder/display-homes/create/steps/products-upload";
import { AiProductResultsStep } from "@/components/builder/display-homes/create/steps/products-result";
import { ProductsVerifyEditStep } from "@/components/builder/display-homes/create/steps/products-verify-edit";

const stepComponents: Record<CreateDisplayHomeStepId, React.ComponentType> = {
  details: DetailsStep,
  classification: ClassificationStep,
  "floor-plan": FloorPlanStep,
  rooms: RoomsStep,
  "products-upload": ProductUploadStep,
  "colour-review": AiColourCombinationReviewStep,
  "products-result": AiProductResultsStep,
  "products-verify-edit": ProductsVerifyEditStep,
  qr: QrStep,
};

export function CreateDisplayHomePage() {
  const [activeStep, setActiveStep] = useState<CreateDisplayHomeStepId>("details");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isRoomStepConfirmOpen, setIsRoomStepConfirmOpen] = useState(false);
  const [isColourStepConfirmOpen, setIsColourStepConfirmOpen] = useState(false);
  const generationTimerRef = useRef<number | null>(null);
  const activeIndex = createDisplayHomeSteps.findIndex((step) => step.id === activeStep);
  const isFinalSubmitStep = activeStep === "products-verify-edit";
  const aiLoadingSteps = new Set<CreateDisplayHomeStepId>(["floor-plan", "products-upload", "colour-review"]);

  const nextStep = useMemo(() => createDisplayHomeSteps[Math.min(activeIndex + 1, createDisplayHomeSteps.length - 1)]?.id, [activeIndex]);
  const previousStep = useMemo(() => createDisplayHomeSteps[Math.max(activeIndex - 1, 0)]?.id, [activeIndex]);

  useEffect(() => {
    return () => {
      if (generationTimerRef.current) {
        window.clearTimeout(generationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!aiLoadingSteps.has(activeStep)) {
      setIsGeneratingAi(false);
      if (generationTimerRef.current) {
        window.clearTimeout(generationTimerRef.current);
        generationTimerRef.current = null;
      }
    }

    if (activeStep !== "rooms") {
      setIsRoomStepConfirmOpen(false);
    }

    if (activeStep !== "colour-review") {
      setIsColourStepConfirmOpen(false);
    }
  }, [activeStep]);

  const goToNextStep = () => {
    if (!nextStep) {
      return;
    }

    if (activeStep === "rooms") {
      setIsRoomStepConfirmOpen(true);
      return;
    }

    if (activeStep === "colour-review") {
      setIsColourStepConfirmOpen(true);
      return;
    }

    if (aiLoadingSteps.has(activeStep)) {
      setIsGeneratingAi(true);
      if (generationTimerRef.current) {
        window.clearTimeout(generationTimerRef.current);
      }

      generationTimerRef.current = window.setTimeout(() => {
        setActiveStep(nextStep);
        setIsGeneratingAi(false);
        generationTimerRef.current = null;
      }, 1800);
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

  const confirmColourStepNext = () => {
    if (!nextStep) {
      return;
    }

    setIsColourStepConfirmOpen(false);
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

  const cancelColourStepNext = () => {
    setIsColourStepConfirmOpen(false);
  };

  const isWorkflowLoading = isGeneratingAi;
  const getLoaderMessage = () => {
    if (activeStep === "rooms") {
      return "Submitting your data and preparing the next step.";
    }

    if (activeStep === "products-upload") {
      return "Please wait while we scan the product guide and prepare the next step.";
    }

    if (activeStep === "colour-review") {
      return "Generating curated palettes and preparing your colour review.";
    }

    return "Please wait while we extract rooms and prepare the next step.";
  };

  const renderActiveStep = () => {
    if (activeStep === "products-result") {
      return <AiProductResultsStep onMapProduct={() => setActiveStep("products-verify-edit")} />;
    }

    if (activeStep === "products-verify-edit") {
      return <ProductsVerifyEditStep onPublish={() => setActiveStep("qr")} />;
    }

    const ActiveStep = stepComponents[activeStep];
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
            <CreateStepper activeStep={activeStep} onSelectStep={setActiveStep} />
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
          <footer className="create-home-workflow-actions">
            <button disabled={activeIndex === 0} onClick={() => setActiveStep(previousStep)} type="button"><span aria-hidden="true">&#8592;</span> Back</button>
            <button className="create-home-primary" disabled={activeIndex === createDisplayHomeSteps.length - 1 || isWorkflowLoading} onClick={goToNextStep} type="button">
              {isFinalSubmitStep ? "Final submit" : "Next step"} <ArrowIcon size={15} />
            </button>
          </footer>
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
                <h2 id="room-step-confirm-title">Continue to product upload?</h2>
                <p>We have the room list confirmed. Step 5 will scan the product guide next.</p>
              </div>
            </header>

            <div className="staff-modal-form">
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Before moving ahead, please confirm that the detected rooms are correct. If yes, we will jump to the product guide upload step.
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

      {isColourStepConfirmOpen ? (
        <div className="staff-modal-overlay" onClick={cancelColourStepNext} role="presentation">
          <section
            aria-labelledby="colour-step-confirm-title"
            aria-modal="true"
            className="staff-modal create-home-confirm-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header>
              <span><SparklesIcon size={20} /></span>
              <div>
                <h2 id="colour-step-confirm-title">Continue to product results?</h2>
                <p>Your colour review is ready. Step 7 will move into extracted product results next.</p>
              </div>
            </header>

            <div className="staff-modal-form">
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Please confirm this review is complete before we proceed. Once confirmed, we’ll open the product results step.
              </p>
            </div>

            <footer>
              <button onClick={cancelColourStepNext} type="button">
                Not yet
              </button>
              <button className="primary" onClick={confirmColourStepNext} type="button">
                Confirm and continue
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </BuilderShell>
  );
}
