import { useMemo, useState } from "react";
import { EditIcon, EyeIcon, TagIcon, XIcon } from "@/components/icons";
import {
  colourReviewCombinations,
  colourReviewTabs,
  createDisplayHomeSteps,
} from "@/components/builder/display-homes/create/workflow-data";
import { StepShell } from "@/components/builder/display-homes/create/step-shell";
import { AiColourCombinationEditor } from "@/components/builder/display-homes/create/steps/ai-colour-combination-editor";

const PAGE_SIZE = 3;
const previewSwatches = ["#4a4a4a", "#6d6a63", "#9f9b95", "#161616", "#595652", "#434343", "#2f2d2b"] as const;

export function AiColourCombinationReviewStep() {
  const [activeTab, setActiveTab] = useState<(typeof colourReviewTabs)[number]>(colourReviewTabs[0]);
  const [page, setPage] = useState(1);
  const [selectedCombinationName, setSelectedCombinationName] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [editingCombination, setEditingCombination] = useState<(typeof colourReviewCombinations)[number] | null>(null);

  const combinationsForTab = useMemo(
    () => colourReviewCombinations.filter((combination) => combination.category === activeTab),
    [activeTab],
  );

  const pageCount = Math.max(1, Math.ceil(combinationsForTab.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const visibleCombinations = useMemo(
    () => combinationsForTab.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [combinationsForTab, currentPage],
  );

  const handlePageChange = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(1, nextPage), pageCount);
    const nextPageCombinations = combinationsForTab.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);
    setPage(clampedPage);
    setSelectedCombinationName(nextPageCombinations[0]?.name ?? "");
    setShowPreview(false);
  };

  const selectedCombination =
    showPreview
      ? combinationsForTab.find((combination) => combination.name === selectedCombinationName) ??
        combinationsForTab[0] ??
        colourReviewCombinations[0]
      : null;

  const selectCombination = (name: string) => {
    setSelectedCombinationName(name);
    setShowPreview(true);
  };

  const handleTabChange = (tab: (typeof colourReviewTabs)[number]) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedCombinationName("");
    setShowPreview(false);
  };

  if (editingCombination) {
    return (
      <StepShell step={createDisplayHomeSteps[5]}>
        <AiColourCombinationEditor combination={editingCombination} onBack={() => setEditingCombination(null)} />
      </StepShell>
    );
  }

  return (
    <StepShell step={createDisplayHomeSteps[5]}>
      <div className="create-home-colour-review">
        <div className="create-home-colour-tabs" role="tablist" aria-label="Colour review categories">
          {colourReviewTabs.map((tab) => (
              <button
                aria-pressed={tab === activeTab}
                className={tab === activeTab ? "active" : ""}
                key={tab}
                onClick={() => handleTabChange(tab)}
                type="button"
              >
              <TagIcon size={15} />
              <span>{tab}</span>
            </button>
          ))}
        </div>

        <div className="create-home-ai-callout">
          <span aria-hidden="true" style={{ alignItems: "center", background: "#f1e1ca", borderRadius: "50%", color: "#a36e34", display: "flex", height: "38px", justifyContent: "center", width: "38px" }}>
            <TagIcon size={18} />
          </span>
          <div>
            <strong>{colourReviewCombinations.length} AI-generated combinations found</strong>
            <p>Choose a colour family below to review the generated combinations and open a preview when needed.</p>
          </div>
        </div>

        <div
          className={`create-home-colour-layout ${showPreview ? "" : "single"}`}
          style={{
            gridTemplateColumns: showPreview ? "minmax(0, 1.7fr) minmax(360px, 460px)" : "1fr",
          }}
        >
          <div className="create-home-colour-main">
            <div className="create-home-slider-controls">
              <strong>{activeTab} combinations</strong>
              <div className="create-home-slider-arrows">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} type="button" aria-label="Previous cards">
                  <span aria-hidden="true">&#8249;</span>
                </button>
                <button disabled={currentPage === pageCount} onClick={() => handlePageChange(currentPage + 1)} type="button" aria-label="Next cards">
                  <span aria-hidden="true">&#8250;</span>
                </button>
              </div>
            </div>
            <div className="create-home-colour-grid">
            {visibleCombinations.map((combination) => (
              <article
                aria-pressed={showPreview && selectedCombination?.name === combination.name}
                className={`create-home-colour-card ${showPreview && selectedCombination?.name === combination.name ? "selected" : ""}`}
                key={combination.name}
                onClick={() => selectCombination(combination.name)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCombination(combination.name);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <header>
                  <div>
                    <span className="create-home-colour-badge">{combination.badge}</span>
                    <h3>{combination.name}</h3>
                    <p>{combination.vibe}</p>
                  </div>
                  <button aria-label={`Save ${combination.name}`} type="button">
                    <EyeIcon size={16} />
                  </button>
                </header>
                <div className="create-home-colour-image" style={{ backgroundImage: `url("${combination.image}")` }} />
                <section className="create-home-colour-list" aria-label={`${combination.name} summary`}>
                  <div className="create-home-colour-list-head">
                    <strong>Product Summary</strong>
                    <small>{combination.items.length} items</small>
                  </div>
                  {combination.items.map((item) => (
                    <article className={item.tone} key={`${combination.name}-${item.label}`}>
                      <span>{item.label}</span>
                      <strong>{item.status}</strong>
                      <p>{item.value}</p>
                    </article>
                  ))}
                </section>
              </article>
            ))}
            </div>
            <div className="create-home-pagination" aria-label="Colour review pagination">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} type="button">Prev</button>
              <div className="create-home-pagination-pages">
                {Array.from({ length: pageCount }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      aria-label={`Page ${pageNumber}`}
                      className={pageNumber === currentPage ? "active" : ""}
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      type="button"
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button disabled={currentPage === pageCount} onClick={() => handlePageChange(currentPage + 1)} type="button">Next</button>
            </div>
          </div>

          {showPreview && selectedCombination ? (
            <aside
              className="create-home-colour-preview"
              style={{ justifySelf: "stretch", maxWidth: "none", width: "100%" }}
            >
              <header>
                <div>
                  <strong>Selected Combination Preview</strong>
                  <p>Exterior Preview</p>
                </div>
                <div className="create-home-preview-head-actions">
                  <span>{selectedCombination.name}</span>
                  <button aria-label="Close preview" className="create-home-preview-close" onClick={() => setShowPreview(false)} type="button">
                    <XIcon size={14} />
                  </button>
                </div>
              </header>

              <div className="create-home-colour-preview-image" style={{ backgroundImage: `url("${selectedCombination.image}")` }} />

              <div className="create-home-colour-preview-list">
                {selectedCombination.items.map((item, index) => (
                  <article key={item.label}>
                    <span />
                    <strong>{item.label}</strong>
                    <small>{item.status}</small>
                    <p>{item.value}</p>
                    <i className="create-home-preview-swatch" style={{ backgroundColor: previewSwatches[index % previewSwatches.length] }} />
                  </article>
                ))}
              </div>

              <section className="create-home-colour-summary">
                <strong>Summary</strong>
                <div>
                  <span className="standard"><b>{selectedCombination.summaryStats.standard}</b><small>Standard Items</small></span>
                  <span className="upgrade"><b>{selectedCombination.summaryStats.upgrade}</b><small>Upgrade Items</small></span>
                </div>
                <p>This combination contains upgrade items which may impact the final cost.</p>
              </section>

              <button
                className="create-home-secondary create-home-preview-action"
                onClick={() => selectedCombination && setEditingCombination(selectedCombination)}
                type="button"
              >
                <EditIcon size={15} /> Edit This Combination
              </button>
            </aside>
          ) : null}
        </div>
      </div>
    </StepShell>
  );
}
