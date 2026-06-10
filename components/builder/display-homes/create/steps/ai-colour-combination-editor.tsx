import { useMemo, useRef, useState } from "react";
import {
  ArrowIcon,
  CheckIcon,
  HomeIcon,
  SparklesIcon,
  TagIcon,
} from "@/components/icons";
import { colourReviewCombinations, colourReviewTabs } from "@/components/builder/display-homes/create/workflow-data";
import styles from "./ai-colour-combination-editor.module.css";

type ColourReviewCombination = (typeof colourReviewCombinations)[number];
type AiColourCombinationEditorProps = {
  combination: ColourReviewCombination;
  onBack: () => void;
};

type SelectedOptionsByLabel = Record<string, string[]>;
type LaneKey = "standard" | "upgrade";

const rowPalettes: Array<{
  standard: Array<{ name: string; color: string }>;
  upgrade: Array<{ name: string; color: string }>;
}> = [
  {
    standard: [
      { name: "Monument", color: "#2f2a27" },
      { name: "Surfmist", color: "#ddd7ce" },
      { name: "Dune", color: "#c8b69d" },
      { name: "Basalt", color: "#474645" },
      { name: "Charcoal", color: "#615c56" },
      { name: "Pebble", color: "#b2aaa0" },
      { name: "Driftwood", color: "#948776" },
      { name: "Slate", color: "#3c3a39" },
    ],
    upgrade: [
      { name: "Prestige Profile", color: "#8c8a86" },
      { name: "Eton Profile", color: "#7a7a78" },
      { name: "Designer", color: "#b8b0a7" },
      { name: "Classic", color: "#5b5856" },
      { name: "Coastal", color: "#d0c6ba" },
      { name: "Urban", color: "#9d968f" },
      { name: "Luxe", color: "#6f6860" },
      { name: "Stone", color: "#c0b8af" },
    ],
  },
  {
    standard: [
      { name: "Elements Graphite", color: "#534a42" },
      { name: "Desert Sienna", color: "#c78f63" },
      { name: "Rubblelite", color: "#d8cfc0" },
      { name: "Manor Red", color: "#8b402e" },
      { name: "Sandstone", color: "#d7bea2" },
      { name: "Terracotta", color: "#a45a3a" },
      { name: "Clay", color: "#b87f62" },
      { name: "Ash", color: "#7d766f" },
    ],
    upgrade: [
      { name: "Foundation Stone", color: "#a59d91" },
      { name: "Dark & Stormy", color: "#5b5c64" },
      { name: "Simply Hampton White", color: "#efe7dc" },
      { name: "Austral Brown", color: "#83634a" },
      { name: "Mid Grey", color: "#8f8c88" },
      { name: "Warm White", color: "#f5efe5" },
      { name: "Slate Mix", color: "#70727b" },
      { name: "Cedar Brown", color: "#8a6a4a" },
    ],
  },
  {
    standard: [
      { name: "Woodland Grey", color: "#6f6c64" },
      { name: "Surfmist", color: "#e7e2d8" },
      { name: "Pearl White", color: "#f2efe9" },
      { name: "Manor Red", color: "#8d4538" },
      { name: "Ash Grey", color: "#9b948a" },
      { name: "Bone", color: "#e4dccf" },
      { name: "Deep Clay", color: "#a65e47" },
      { name: "Stonewash", color: "#c5bfba" },
    ],
    upgrade: [
      { name: "Linea Weatherboard", color: "#dad0c2" },
      { name: "Aron Cladding", color: "#b9b3aa" },
      { name: "Stria Cladding", color: "#a9a49c" },
      { name: "EasyLap Panel", color: "#cec6ba" },
      { name: "Textured Panel", color: "#d8d1c3" },
      { name: "Weatherboard Grey", color: "#9f9b95" },
      { name: "Muted Clay", color: "#bc8a73" },
      { name: "Soft Linen", color: "#eee6d8" },
    ],
  },
  {
    standard: [
      { name: "Aluminium Frames Black", color: "#2a2928" },
      { name: "Aluminium Frames Monument", color: "#6a645e" },
      { name: "Aluminium Frames Surfmist", color: "#e4ded4" },
      { name: "Steel Frame", color: "#3f3b37" },
      { name: "Shadow Grey", color: "#595652" },
      { name: "Warm White", color: "#f0ebe2" },
      { name: "Brass", color: "#bb8f57" },
      { name: "Timber Dark", color: "#4f4339" },
    ],
    upgrade: [
      { name: "Aluminium Frames Woodland Grey", color: "#7b746c" },
      { name: "Aluminium Frames White", color: "#f2efe8" },
      { name: "Timber Look Natural", color: "#b78a58" },
      { name: "Charcoal", color: "#45413f" },
      { name: "Monument Grey", color: "#635a53" },
      { name: "Paperbark", color: "#ded4c2" },
      { name: "Bronze", color: "#a26b3d" },
      { name: "Graphite", color: "#312d2a" },
    ],
  },
];

const buildDefaultSelections = (selection: ColourReviewCombination): SelectedOptionsByLabel =>
  Object.fromEntries(
    selection.items.map((item, index) => {
      const palette = rowPalettes[index % rowPalettes.length];
      return [item.label, [...palette.standard.map((option) => option.name), ...palette.upgrade.map((option) => option.name)]];
    }),
  );

const getAllPaletteOptionNames = (palette: (typeof rowPalettes)[number]) => [
  ...palette.standard.map((option) => option.name),
  ...palette.upgrade.map((option) => option.name),
];

export function AiColourCombinationEditor({ combination, onBack }: AiColourCombinationEditorProps) {
  const [activeTab, setActiveTab] = useState<(typeof colourReviewTabs)[number]>(combination.category);
  const [selectedCombinationName, setSelectedCombinationName] = useState(combination.name);
  const [selectedOptionByLabel, setSelectedOptionByLabel] = useState<SelectedOptionsByLabel>(() =>
    buildDefaultSelections(combination),
  );
  const rowViewportRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const combinationsForTab = useMemo(
    () => colourReviewCombinations.filter((item) => item.category === activeTab),
    [activeTab],
  );

  const currentCombination =
    combinationsForTab.find((item) => item.name === selectedCombinationName) ?? combinationsForTab[0] ?? combination;

  const quickStylePresets = useMemo(
    () => colourReviewCombinations.slice(0, 5),
    [],
  );

  const upgradeItems = currentCombination.items.filter((item) => item.tone === "upgrade");
  const leftRows = currentCombination.items.map((item, index) => ({
    item,
    palette: rowPalettes[index % rowPalettes.length],
  }));

  const handleOptionToggle = (label: string, optionName: string) => {
    setSelectedOptionByLabel((current) => {
      const currentSelections = current[label] ?? [];
      const nextSelections = currentSelections.includes(optionName)
        ? currentSelections.filter((name) => name !== optionName)
        : [...currentSelections, optionName];
      return { ...current, [label]: nextSelections };
    });
  };

  const handleRowSlide = (label: string, lane: LaneKey, direction: "left" | "right") => {
    rowViewportRefs.current[`${label}-${lane}`]?.scrollBy({ behavior: "smooth", left: direction === "right" ? 360 : -360 });
  };

  const handleTabChange = (tab: (typeof colourReviewTabs)[number]) => {
    setActiveTab(tab);
    const nextCombination = colourReviewCombinations.find((item) => item.category === tab) ?? combination;
    setSelectedCombinationName(nextCombination.name);
    setSelectedOptionByLabel(buildDefaultSelections(nextCombination));
  };

  const handlePresetSelect = (preset: ColourReviewCombination) => {
    setActiveTab(preset.category);
    setSelectedCombinationName(preset.name);
    setSelectedOptionByLabel(buildDefaultSelections(preset));
  };

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div className={styles.crumb}>
          <span>Create Display Home</span>
          <ArrowIcon size={14} />
          <span>Step 6 of 8: AI Colour Combination Review</span>
        </div>
        <button className={styles.backButton} onClick={onBack} type="button">
          <ArrowIcon size={14} />
          Back to Combinations
        </button>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroIntro}>
          <span className={styles.heroIcon}>
            <HomeIcon size={22} />
          </span>
          <div className={styles.heroCopy}>
            <h3>
              Edit Combination - {currentCombination.name}
              <span className={styles.pill} style={{ marginLeft: 10 }}>
                {currentCombination.badge}
              </span>
            </h3>
            <p>Customize materials and finishes. Live preview updates instantly.</p>
            <div className={styles.heroPills}>
              <span className={styles.pill}>
                <SparklesIcon size={14} />
                Contains {currentCombination.upgrades} Upgrades
              </span>
              <span className={styles.pill}>
                <TagIcon size={14} />
                {currentCombination.category}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.presets}>
          <div className={styles.presetsTitle}>Quick Style Presets</div>
          <div className={styles.presetRow}>
            {quickStylePresets.map((preset) => (
              <button
                className={`${styles.pill} ${preset.name === currentCombination.name ? styles.pillStrong : ""}`}
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                type="button"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.layout}>
        <section className={`${styles.panel} ${styles.leftPanel}`}>
          <div className={styles.tabs} role="tablist" aria-label="Combination categories">
            {colourReviewTabs.map((tab) => (
              <button
                className={tab === activeTab ? "active" : ""}
                key={tab}
                onClick={() => handleTabChange(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.sectionHead}>
            <h4>{activeTab} selections</h4>
            <small>All selections update the live preview</small>
          </div>

          <div className={styles.rows}>
            {leftRows.map(({ item, palette }) => (
              <article className={styles.row} key={`${currentCombination.name}-${item.label}`}>
                <div className={styles.rowIcon}>
                  <HomeIcon size={15} />
                </div>
                <div className={styles.rowLabelBlock}>
                  <strong>{item.label}</strong>
                </div>
                <div className={styles.rowLanes}>
                  {([
                    ["standard", palette.standard, "Standard"],
                    ["upgrade", palette.upgrade, "Upgrades"],
                  ] as const).map(([laneKey, options, laneLabel]) => (
                    <div className={styles.rowLane} key={`${item.label}-${laneKey}`}>
                      <div className={styles.rowLaneHead}>
                        <span>{laneLabel}</span>
                      </div>
                      <div className={styles.rowLaneControls}>
                        <button
                          aria-label={`Scroll ${item.label} ${laneLabel} left`}
                          className={`${styles.rowArrow} ${styles.rowArrowLeft}`}
                          onClick={() => handleRowSlide(item.label, laneKey, "left")}
                          type="button"
                        >
                          <ArrowIcon size={14} />
                        </button>
                        <div
                          className={styles.rowViewport}
                          ref={(node) => {
                            rowViewportRefs.current[`${item.label}-${laneKey}`] = node;
                          }}
                        >
                          <div className={styles.tileRow}>
                            {(() => {
                              const selectedOptionNames = selectedOptionByLabel[item.label] ?? getAllPaletteOptionNames(palette);
                              return options.map((option) => (
                                <button
                                  aria-pressed={selectedOptionNames.includes(option.name)}
                                  aria-label={`${item.label} ${laneKey} ${option.name}`}
                                  className={`${styles.tile} ${selectedOptionNames.includes(option.name) ? styles.selectedTile : ""}`}
                                  key={`${item.label}-${laneKey}-${option.name}`}
                                  onClick={() => handleOptionToggle(item.label, option.name)}
                                  type="button"
                                >
                                  <span className={styles.tileCheck} aria-hidden="true">
                                    <CheckIcon size={10} />
                                  </span>
                                  <i style={{ background: option.color }} />
                                  <small>{option.name}</small>
                                </button>
                              ));
                            })()}
                          </div>
                        </div>
                        <button
                          aria-label={`Scroll ${item.label} ${laneLabel} right`}
                          className={styles.rowArrow}
                          onClick={() => handleRowSlide(item.label, laneKey, "right")}
                          type="button"
                        >
                          <ArrowIcon size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.previewPanel}`}>
          <div className={styles.previewImage} style={{ backgroundImage: `url("${currentCombination.image}")` }} />

          <div className={styles.previewSplit}>
            <article className={styles.miniPanel}>
              <h5>AI Suggestions</h5>
              <div className={styles.suggestions}>
                <p>
                  Great choice. Your selections create a bold and contemporary look.
                </p>
                <ul>
                  <li>
                    <span className={styles.bullet}><CheckIcon size={11} /></span>
                    Try upgrading the front door to Timber Look Natural for warmer entry appeal.
                  </li>
                  <li>
                    <span className={styles.bullet}><CheckIcon size={11} /></span>
                    Consider a softer roof profile for a more textured exterior finish.
                  </li>
                  <li>
                    <span className={styles.bullet}><CheckIcon size={11} /></span>
                    Add wall lighting beside the entry to enhance street presence.
                  </li>
                </ul>
              </div>
            </article>

            <article className={styles.miniPanel}>
              <div className={styles.panelHeader}>
                <div className={styles.selectedHead}>
                  <strong>Current Combination Summary</strong>
                  <p>{currentCombination.summary}</p>
                </div>
                <div className={styles.chipRow}>
                  <span className={`${styles.pill} ${styles.statusPill}`}>
                    <span className={styles.statusDot} style={{ background: "#2f9257" }} />
                    Standard
                  </span>
                  <span className={`${styles.pill} ${styles.statusPill}`}>
                    <span className={styles.statusDot} style={{ background: "#e18a2d" }} />
                    Upgrade
                  </span>
                </div>
              </div>

              <div className={styles.summaryStats}>
                <div className={`${styles.stat} ${styles.standard}`}>
                  <b>{currentCombination.summaryStats.standard}</b>
                  <small>Standard Items</small>
                </div>
                <div className={`${styles.stat} ${styles.upgrade}`}>
                  <b>{currentCombination.summaryStats.upgrade}</b>
                  <small>Upgrade Items</small>
                </div>
              </div>
            </article>
          </div>
        </section>

        <aside className={`${styles.panel} ${styles.sidePanel}`}>
          <div className={styles.panelHeader}>
            <div className={styles.selectedHead}>
              <strong>Selection Breakdown</strong>
              <p>Live editing summary</p>
            </div>
            <span>{currentCombination.badge}</span>
          </div>

          <div className={styles.summaryStats}>
            <div className={`${styles.stat} ${styles.standard}`}>
              <b>{currentCombination.summaryStats.standard}</b>
              <small>Standard Items</small>
            </div>
            <div className={`${styles.stat} ${styles.upgrade}`}>
              <b>{currentCombination.summaryStats.upgrade}</b>
              <small>Upgrade Items</small>
            </div>
          </div>

          <article className={styles.miniPanel}>
            <h5>Upgrade Items Selected</h5>
            <ul className={styles.upgradeList}>
              {upgradeItems.map((item) => (
                <li key={item.label}>
                  <span className={styles.bullet}>
                    <TagIcon size={10} />
                  </span>
                  <div>
                    <strong>{item.label}</strong>
                    <p style={{ margin: "2px 0 0", color: "#6c6054" }}>{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.miniPanel}>
            <h5>Estimated Impact</h5>
            <p style={{ color: "#6c6054", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
              Upgrade items may increase the final build cost.
            </p>
            <div className={styles.impact} aria-label="Impact rating">
              {Array.from({ length: 5 }).map((_, dotIndex) => (
                <i className={dotIndex < currentCombination.summaryStats.upgrade ? "active" : ""} key={dotIndex} />
              ))}
            </div>
          </article>
        </aside>
      </div>

    </div>
  );
}
