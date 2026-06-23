"use client";

import { useMemo, useState, type CSSProperties, type ComponentType } from "react";
import Image from "next/image";
import {
  BoxIcon,
  BookOpenIcon,
  CheckIcon,
  FileIcon,
  HomeIcon,
  PaletteIcon,
  SparklesIcon,
  TagIcon,
  XIcon,
} from "@/components/icons";
import { colourReviewTabs } from "@/components/builder/display-homes/create/workflow-data";
import styles from "./ai-colour-review-step.module.css";

type ColourReviewTab = (typeof colourReviewTabs)[number];
type IconComponent = ComponentType<{ size?: number; className?: string }>;

type Tile = {
  label: string;
  value: string;
  color: string;
  variant?: "circle" | "square" | "texture" | "wood" | "metal";
  imageSrc?: string;
  imageFit?: "contain" | "cover";
  imagePosition?: string;
  visualKind?: "cabinet" | "bench" | "tile" | "tapware" | "handle" | "appliance";
};

type Group = {
  key: string;
  label: string;
  tiles: Tile[];
  defaultSelection?: string;
};

type Section = {
  title: string;
  icon: IconComponent;
  matchLabel?: string;
  groups: Group[];
};

type TabConfig = {
  sections: Section[];
};

type TileCheckMap = Record<string, boolean>;
type FinishMap = Record<string, string>;
type SelectionMap = Record<string, string>;
type KitchenModalState = {
  sectionTitle: string;
  groupKey: string;
  groupLabel: string;
  tiles: Tile[];
} | null;

type ManualSectionDraft = {
  title: string;
  standardLabel: string;
  standardValue: string;
  upgradeLabel: string;
  upgradeValue: string;
};

type ManualTileDraft = {
  sectionTitle: string;
  sectionKey: string;
  groupKey: string;
  groupLabel: string;
  label: string;
  value: string;
  color: string;
  variant: NonNullable<Tile["variant"]>;
};

type ManualSection = Section & {
  id: string;
  isManual: true;
};

const DOOR_FURNITURE_SECTION_TITLE = "Door Furniture";
const DOOR_FURNITURE_FINISH_GROUP_KEY = "finish";
const DEFAULT_DOOR_FINISH = "Brushed Brass";
const EMPTY_MANUAL_SECTION: ManualSectionDraft = {
  title: "New block",
  standardLabel: "Standard finish",
  standardValue: "Standard finish",
  upgradeLabel: "Upgrade finish",
  upgradeValue: "Upgrade finish",
};
const EMPTY_MANUAL_TILE: ManualTileDraft = {
  sectionTitle: "Exterior",
  sectionKey: "Exterior",
  groupKey: "standard",
  groupLabel: "Standard",
  label: "New tile",
  value: "New tile",
  color: "#d9d0c6",
  variant: "texture",
};

const tabConfigs: Record<ColourReviewTab, TabConfig> = {
  Exterior: {
    sections: [
      {
        title: "Roofing",
        icon: HomeIcon,
        matchLabel: "Roofing",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Monument",
            tiles: [
              { label: "Surfmist", value: "Colorbond Surfmist", color: "#edeae6", variant: "circle" },
              { label: "Dune", value: "Colorbond Dune", color: "#dcc6a6", variant: "circle" },
              { label: "Basalt", value: "Colorbond Basalt", color: "#4a4846", variant: "circle" },
              { label: "Shale Grey", value: "Colorbond Shale Grey", color: "#a3a19f", variant: "circle" },
              { label: "Monument", value: "Colorbond Monument", color: "#2a2a2a", variant: "circle" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Prestige Profile", value: "Prestige Profile", color: "#4f5256", variant: "texture" },
              { label: "Designer", value: "Designer", color: "#434548", variant: "texture" },
              { label: "Eton Profile", value: "Eton Profile", color: "#35373b", variant: "texture" },
              { label: "Classic", value: "Classic", color: "#6c6d6a", variant: "texture" },
            ],
          },
        ],
      },
      {
        title: "Bricks",
        icon: BoxIcon,
        matchLabel: "Bricks",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Elements Graphite",
            tiles: [
              { label: "Elements Graphite", value: "Elements Graphite", color: "#222222", variant: "texture" },
              { label: "Desert Sinai", value: "Desert Sinai", color: "#b59472", variant: "texture" },
              { label: "Rubblelite", value: "Rubblelite", color: "#9c6540", variant: "texture" },
              { label: "Manor Red", value: "Manor Red", color: "#b24b34", variant: "texture" },
              { label: "Austral Bowral", value: "Austral Bowral", color: "#aaa196", variant: "texture" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Foundations Stone", value: "Foundations Stone", color: "#bfb4a6", variant: "texture" },
              { label: "Dark & Stormy Thunder", value: "Dark & Stormy Thunder", color: "#64686d", variant: "texture" },
              { label: "Simply Hamptons White", value: "Simply Hamptons White", color: "#f4f3ef", variant: "texture" },
              { label: "Austral Bowral", value: "Austral Bowral", color: "#ddd1c1", variant: "texture" },
            ],
          },
        ],
      },
      {
        title: "Windows / Aluminium Doors",
        icon: FileIcon,
        matchLabel: "Windows",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Black",
            tiles: [
              { label: "Black", value: "Aluminium Frames Black", color: "#22262a", variant: "square" },
              { label: "Monument", value: "Aluminium Frames Monument", color: "#4e4e4e", variant: "square" },
              { label: "Woodland Grey", value: "Aluminium Frames Woodland Grey", color: "#c7c2bc", variant: "square" },
              { label: "Surfmist", value: "Aluminium Frames Surfmist", color: "#f1ede3", variant: "square" },
              { label: "Dune", value: "Aluminium Frames Dune", color: "#d7c2a3", variant: "square" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Pearl White", value: "Pearl White", color: "#f3f3f1", variant: "square" },
              { label: "Anodic Silver", value: "Anodic Silver", color: "#d2d3d5", variant: "square" },
              { label: "Timber Look Natural", value: "Timber Look Natural", color: "#c78339", variant: "wood" },
              { label: "Custom Colour", value: "Custom Colour", color: "#c9c1b5", variant: "square" },
            ],
          },
        ],
      },
      {
        title: "Door Furniture",
        icon: SparklesIcon,
        matchLabel: "Entry Door",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Gainsborough Trilock Angular Double Cylinder",
            tiles: [
              {
                label: "Gainsborough Trilock Angular Double Cylinder",
                value: "Gainsborough Trilock Angular Double Cylinder",
                color: "#ece7e1",
                variant: "metal",
                imageSrc: "/product-assets/door-furniture-angular-bright-chrome.jpg",
              },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              {
                label: "Trilock Omni Allure Double Cylinder",
                value: "Trilock Omni Allure Double Cylinder",
                color: "#dad5cf",
                variant: "metal",
                imageSrc: "/product-assets/door-furniture-angular-satin-chrome.jpg",
              },
              {
                label: "Trilock Omni Back to Back Double Cylinder Pull Handle",
                value: "Trilock Omni Back to Back Double Cylinder Pull Handle",
                color: "#cfcac3",
                variant: "metal",
                imageSrc: "/product-assets/door-furniture-angular-bright-chrome.jpg",
              },
              {
                label: "Gainsborough Freestyle Trilock Smart Lock",
                value: "Gainsborough Freestyle Trilock Smart Lock",
                color: "#b6b6b3",
                variant: "metal",
                imageSrc: "/product-assets/door-furniture-angular-matt-black.jpg",
              },
            ],
          },
          {
            key: "finish",
            label: "Select Finish",
            defaultSelection: "Brushed Brass",
            tiles: [
              { label: "Chrome", value: "Chrome", color: "#d5d7da", variant: "circle", imageSrc: "/product-assets/finish-brushed-satin-chrome.png" },
              { label: "Satin Chrome", value: "Satin Chrome", color: "#d1d1d1", variant: "circle", imageSrc: "/product-assets/finish-stainless-steel.png" },
              { label: "Matt Black", value: "Matt Black", color: "#2f2f2f", variant: "circle", imageSrc: "/product-assets/finish-matt-black.png" },
              { label: "Gunmetal", value: "Gunmetal", color: "#86827e", variant: "circle", imageSrc: "/product-assets/finish-satin-graphite.png" },
              { label: "Brushed Nickel", value: "Brushed Nickel", color: "#beb8af", variant: "circle", imageSrc: "/product-assets/finish-stainless-steel.png" },
              { label: "Brushed Brass", value: "Brushed Brass", color: "#c7a04b", variant: "metal" },
            ],
          },
        ],
      },
      {
        title: "Garage Door",
        icon: HomeIcon,
        matchLabel: "Garage Door",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Colorbond Monument",
            tiles: [
              { label: "Colorbond Monument", value: "Colorbond Monument", color: "#333434", variant: "texture" },
              { label: "Colorbond Surfmist", value: "Colorbond Surfmist", color: "#e3ddd1", variant: "texture" },
              { label: "Colorbond Dune", value: "Colorbond Dune", color: "#c9b396", variant: "texture" },
              { label: "Colorbond Basalt", value: "Colorbond Basalt", color: "#4d4a48", variant: "texture" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Colorbond Woodland Grey", value: "Colorbond Woodland Grey", color: "#827d77", variant: "texture" },
              { label: "Timber Look Cedar", value: "Timber Look Cedar", color: "#b0672b", variant: "wood" },
              { label: "Timber Look Natural", value: "Timber Look Natural", color: "#c89655", variant: "wood" },
            ],
          },
        ],
      },
      {
        title: "Appliances",
        icon: BookOpenIcon,
        groups: [
          {
            key: "standard",
            label: "Standard - Smeg",
            tiles: [
              { label: "60cm Oven", value: "60cm Oven", color: "#191919", variant: "metal", imageSrc: "/product-assets/oven-smeg-90cm.png" },
              { label: "60cm Cooktop", value: "60cm Cooktop", color: "#373737", variant: "metal", imageSrc: "/product-assets/cooktop-sr60ghu3.jpg" },
              { label: "Freestanding Dishwasher", value: "Freestanding Dishwasher", color: "#d6d6d4", variant: "metal", imageSrc: "/product-assets/dishwasher-smeg.jpg" },
              { label: "60cm Rangehood", value: "60cm Rangehood", color: "#f1efec", variant: "metal", imageSrc: "/product-assets/microwave-fmi625cn.jpg" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "90cm Cooktop", value: "90cm Cooktop", color: "#111111", variant: "metal", imageSrc: "/product-assets/cooktop-sr60ghu3.jpg" },
              { label: "90cm Oven", value: "90cm Oven", color: "#272727", variant: "metal", imageSrc: "/product-assets/oven-smeg-90cm.png" },
              { label: "90cm Rangehood", value: "90cm Rangehood", color: "#363636", variant: "metal", imageSrc: "/product-assets/microwave-fmi625cn.jpg" },
              { label: "Built in Microwave", value: "Built in Microwave", color: "#171717", variant: "metal", imageSrc: "/product-assets/microwave-fmi625cn.jpg" },
            ],
          },
        ],
      },
    ],
  },
  Kitchen: {
    sections: [
      {
        title: "Cabinetry",
        icon: BoxIcon,
        matchLabel: "Cabinetry",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Natural Oak",
            tiles: [
              { label: "Natural Oak", value: "Natural Oak", color: "#c7a176", variant: "wood", visualKind: "cabinet" },
              { label: "Warm White", value: "Warm White", color: "#f3efe6", variant: "square", visualKind: "cabinet" },
              { label: "Soft Grey", value: "Soft Grey", color: "#c6c4c1", variant: "square", visualKind: "cabinet" },
              { label: "Deep Charcoal", value: "Deep Charcoal", color: "#2e2e2d", variant: "square", visualKind: "cabinet" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Textured Oak", value: "Textured Oak", color: "#ac7947", variant: "wood", visualKind: "cabinet" },
              { label: "Painted Olive", value: "Painted Olive", color: "#77816d", variant: "square", visualKind: "cabinet" },
              { label: "Matte Walnut", value: "Matte Walnut", color: "#70533f", variant: "wood", visualKind: "cabinet" },
            ],
          },
        ],
      },
      {
        title: "Benchtop",
        icon: FileIcon,
        matchLabel: "Benchtop",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Concrete Mist",
            tiles: [
              { label: "Concrete Mist", value: "Concrete Mist", color: "#c8c1b8", variant: "texture", visualKind: "bench" },
              { label: "Warm Stone", value: "Warm Stone", color: "#d8cabb", variant: "texture", visualKind: "bench" },
              { label: "Soft White", value: "Soft White", color: "#f5f1ea", variant: "texture", visualKind: "bench" },
              { label: "Charcoal", value: "Charcoal", color: "#474645", variant: "texture", visualKind: "bench" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Calacatta Quartz", value: "Calacatta Quartz", color: "#ece8e2", variant: "texture", visualKind: "bench" },
              { label: "Terrazzo Pearl", value: "Terrazzo Pearl", color: "#d8d0c7", variant: "texture", visualKind: "bench" },
              { label: "Dolomite", value: "Dolomite", color: "#f0eee7", variant: "texture", visualKind: "bench" },
            ],
          },
        ],
      },
      {
        title: "Splashback",
        icon: SparklesIcon,
        matchLabel: "Splashback",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Warm White Tile",
            tiles: [
              { label: "Subway Tile", value: "Subway Tile", color: "#efece7", variant: "square", visualKind: "tile" },
              { label: "Warm White Tile", value: "Warm White Tile", color: "#f4efe5", variant: "square", visualKind: "tile" },
              { label: "Soft Grey Tile", value: "Soft Grey Tile", color: "#d1ccc5", variant: "square", visualKind: "tile" },
              { label: "Stone Mosaic", value: "Stone Mosaic", color: "#c4bdb3", variant: "square", visualKind: "tile" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Stacked Mosaic", value: "Stacked Mosaic", color: "#ddd6cb", variant: "square", visualKind: "tile" },
              { label: "Ribbed Glass", value: "Ribbed Glass", color: "#f5f5f2", variant: "square", visualKind: "tile" },
              { label: "Handmade Clay", value: "Handmade Clay", color: "#cfa48a", variant: "square", visualKind: "tile" },
            ],
          },
        ],
      },
      {
        title: "Tapware",
        icon: PaletteIcon,
        matchLabel: "Tapware",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Chrome",
            tiles: [
              { label: "Chrome", value: "Chrome", color: "#d8dadc", variant: "circle", imageSrc: "/product-assets/tapware-chrome.jpg", imageFit: "cover", imagePosition: "center 42%" },
              { label: "Satin Chrome", value: "Satin Chrome", color: "#d1d1d1", variant: "circle", imageSrc: "/product-assets/tapware-chrome.jpg", imageFit: "cover", imagePosition: "center 64%" },
              { label: "Matt Black", value: "Matt Black", color: "#303030", variant: "circle", imageSrc: "/product-assets/tapware-matt-black.jpg", imageFit: "cover", imagePosition: "center 48%" },
              { label: "Gunmetal", value: "Gunmetal", color: "#817d78", variant: "circle", imageSrc: "/product-assets/tapware-gunmetal.jpg", imageFit: "cover", imagePosition: "center 36%" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            defaultSelection: "Brushed Brass",
            tiles: [
              { label: "Brushed Nickel", value: "Brushed Nickel", color: "#c2bcb2", variant: "circle", imageSrc: "/product-assets/tapware-chrome.jpg", imageFit: "cover", imagePosition: "center 18%" },
              { label: "Brushed Brass", value: "Brushed Brass", color: "#c59c45", variant: "metal", imageSrc: "/product-assets/tapware-brushed-brass.jpg", imageFit: "cover", imagePosition: "center 48%" },
              { label: "Polished Gold", value: "Polished Gold", color: "#d3ab46", variant: "metal", imageSrc: "/product-assets/tapware-brushed-brass.jpg", imageFit: "cover", imagePosition: "center 22%" },
            ],
          },
        ],
      },
      {
        title: "Handles",
        icon: SparklesIcon,
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Chrome",
            tiles: [
              { label: "Chrome", value: "Chrome", color: "#d8dadc", variant: "metal", imageSrc: "/product-assets/handle-satin-nickel.jpg", imageFit: "cover", imagePosition: "center 55%" },
              { label: "Satin Chrome", value: "Satin Chrome", color: "#d1d1d1", variant: "metal", imageSrc: "/product-assets/handle-polished-nickel.jpg", imageFit: "cover", imagePosition: "center 55%" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            defaultSelection: "Brushed Brass",
            tiles: [
              { label: "Brushed Nickel", value: "Brushed Nickel", color: "#c2bcb2", variant: "metal", imageSrc: "/product-assets/handle-polished-nickel.jpg", imageFit: "cover", imagePosition: "center 45%" },
              { label: "Matt Black", value: "Matt Black", color: "#303030", variant: "metal", imageSrc: "/product-assets/handle-matte-black.jpg", imageFit: "cover", imagePosition: "center 52%" },
              { label: "Gunmetal", value: "Gunmetal", color: "#817d78", variant: "metal", imageSrc: "/product-assets/handle-matte-black.jpg", imageFit: "cover", imagePosition: "center 70%" },
              { label: "Brushed Brass", value: "Brushed Brass", color: "#c59c45", variant: "metal", imageSrc: "/product-assets/handle-brass.jpg", imageFit: "cover", imagePosition: "center 50%" },
            ],
          },
        ],
      },
      {
        title: "Appliances",
        icon: BookOpenIcon,
        groups: [
          {
            key: "standard",
            label: "Standard - Smeg",
            tiles: [
              { label: "60cm Oven", value: "60cm Oven", color: "#191919", variant: "metal", imageSrc: "/product-assets/oven-smeg-90cm.png" },
              { label: "60cm Cooktop", value: "60cm Cooktop", color: "#373737", variant: "metal", imageSrc: "/product-assets/cooktop-sr60ghu3.jpg" },
              { label: "Freestanding Dishwasher", value: "Freestanding Dishwasher", color: "#d6d6d4", variant: "metal", imageSrc: "/product-assets/dishwasher-smeg.jpg" },
              { label: "60cm Rangehood", value: "60cm Rangehood", color: "#f1efec", variant: "metal", imageSrc: "/product-assets/microwave-fmi625cn.jpg" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "90cm Cooktop", value: "90cm Cooktop", color: "#111111", variant: "metal", imageSrc: "/product-assets/cooktop-sr60ghu3.jpg" },
              { label: "90cm Oven", value: "90cm Oven", color: "#272727", variant: "metal", imageSrc: "/product-assets/oven-smeg-90cm.png" },
              { label: "90cm Rangehood", value: "90cm Rangehood", color: "#363636", variant: "metal", imageSrc: "/product-assets/microwave-fmi625cn.jpg" },
              { label: "Built in Microwave", value: "Built in Microwave", color: "#171717", variant: "metal", imageSrc: "/product-assets/microwave-fmi625cn.jpg" },
            ],
          },
        ],
      },
    ],
  },
  Bathrooms: {
    sections: [
      {
        title: "Tiles",
        icon: FileIcon,
        matchLabel: "Tiles",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Soft Sand",
            tiles: [
              { label: "Soft Sand", value: "Soft Sand", color: "#e7d5c2", variant: "square" },
              { label: "Warm Grey", value: "Warm Grey", color: "#cdc5bc", variant: "square" },
              { label: "Fresh White", value: "Fresh White", color: "#f4f1ea", variant: "square" },
              { label: "Stone Mist", value: "Stone Mist", color: "#d4cec6", variant: "square" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Marble Vein", value: "Marble Vein", color: "#ece8e3", variant: "texture" },
              { label: "Concrete Vein", value: "Concrete Vein", color: "#c7c0b7", variant: "texture" },
              { label: "Textured Clay", value: "Textured Clay", color: "#d3a98b", variant: "texture" },
            ],
          },
        ],
      },
      {
        title: "Tapware",
        icon: PaletteIcon,
        matchLabel: "Tapware",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Chrome",
            tiles: [
              { label: "Chrome", value: "Chrome", color: "#d9dbdc", variant: "circle" },
              { label: "Satin Chrome", value: "Satin Chrome", color: "#d1d1d1", variant: "circle" },
              { label: "Matt Black", value: "Matt Black", color: "#2d2d2d", variant: "circle" },
              { label: "Gunmetal", value: "Gunmetal", color: "#7f7b76", variant: "circle" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            defaultSelection: "Brushed Brass",
            tiles: [
              { label: "Brushed Nickel", value: "Brushed Nickel", color: "#c4beb4", variant: "circle" },
              { label: "Brushed Brass", value: "Brushed Brass", color: "#c39a42", variant: "metal" },
              { label: "Polished Gold", value: "Polished Gold", color: "#d2ab45", variant: "metal" },
            ],
          },
        ],
      },
      {
        title: "Vanity",
        icon: BoxIcon,
        matchLabel: "Vanity",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Oak Laminate",
            tiles: [
              { label: "Oak Laminate", value: "Oak Laminate", color: "#bf9367", variant: "wood" },
              { label: "Warm White", value: "Warm White", color: "#f3f0e8", variant: "square" },
              { label: "Soft Grey", value: "Soft Grey", color: "#cac7c3", variant: "square" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Textured Oak", value: "Textured Oak", color: "#a87643", variant: "wood" },
              { label: "Fluted Timber", value: "Fluted Timber", color: "#9d6f3b", variant: "wood" },
            ],
          },
        ],
      },
    ],
  },
  Laundry: {
    sections: [
      {
        title: "Joinery",
        icon: BoxIcon,
        matchLabel: "Cabinetry",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "White Laminate",
            tiles: [
              { label: "White Laminate", value: "White Laminate", color: "#f3f1eb", variant: "square" },
              { label: "Warm White", value: "Warm White", color: "#ece6db", variant: "square" },
              { label: "Soft Grey", value: "Soft Grey", color: "#cec9c4", variant: "square" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Textured Oak", value: "Textured Oak", color: "#a87745", variant: "wood" },
              { label: "Walnut Grain", value: "Walnut Grain", color: "#7f5a3b", variant: "wood" },
            ],
          },
        ],
      },
      {
        title: "Benchtop",
        icon: FileIcon,
        matchLabel: "Benchtop",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Compact Laminate",
            tiles: [
              { label: "Compact Laminate", value: "Compact Laminate", color: "#d7cdc0", variant: "texture" },
              { label: "Soft White", value: "Soft White", color: "#f5f3ee", variant: "texture" },
              { label: "Pebble Grey", value: "Pebble Grey", color: "#c8c3bc", variant: "texture" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Terrazzo Light", value: "Terrazzo Light", color: "#ddd7cf", variant: "texture" },
              { label: "Calacatta Quartz", value: "Calacatta Quartz", color: "#ece8e2", variant: "texture" },
            ],
          },
        ],
      },
      {
        title: "Appliances",
        icon: BookOpenIcon,
        matchLabel: "Appliances",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "60cm Washer Dryer",
            tiles: [
              { label: "60cm Washer Dryer", value: "60cm Washer Dryer", color: "#2d2d2d", variant: "metal" },
              { label: "Freestanding Washer", value: "Freestanding Washer", color: "#d3d3d1", variant: "metal" },
              { label: "Dryer", value: "Dryer", color: "#ececeb", variant: "metal" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Integrated Washer Dryer", value: "Integrated Washer Dryer", color: "#1d1d1d", variant: "metal" },
              { label: "900mm Washer", value: "900mm Washer", color: "#595959", variant: "metal" },
            ],
          },
        ],
      },
    ],
  },
  "Interior Finishes": {
    sections: [
      {
        title: "Wall Colour",
        icon: PaletteIcon,
        matchLabel: "Wall Colour",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Linen White",
            tiles: [
              { label: "Linen White", value: "Linen White", color: "#f5f1e7", variant: "square" },
              { label: "Warm White", value: "Warm White", color: "#eee6d9", variant: "square" },
              { label: "Soft Stone", value: "Soft Stone", color: "#d8d1c8", variant: "square" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Textured Clay", value: "Textured Clay", color: "#c58f73", variant: "texture" },
              { label: "Muted Linen", value: "Muted Linen", color: "#d8cdbd", variant: "texture" },
            ],
          },
        ],
      },
      {
        title: "Doors",
        icon: BookOpenIcon,
        matchLabel: "Doors",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "White Hollow Core",
            tiles: [
              { label: "White Hollow Core", value: "White Hollow Core", color: "#f0ede6", variant: "square" },
              { label: "Painted White", value: "Painted White", color: "#eae7df", variant: "square" },
              { label: "Laminated Grey", value: "Laminated Grey", color: "#c9c6c2", variant: "square" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            defaultSelection: "Natural Timber",
            tiles: [
              { label: "Natural Timber", value: "Natural Timber", color: "#ae7b4b", variant: "wood" },
              { label: "Walnut", value: "Walnut", color: "#7d5638", variant: "wood" },
              { label: "Black Steel", value: "Black Steel", color: "#222222", variant: "metal" },
            ],
          },
        ],
      },
      {
        title: "Flooring",
        icon: BoxIcon,
        matchLabel: "Flooring",
        groups: [
          {
            key: "standard",
            label: "Standard",
            defaultSelection: "Light Timber",
            tiles: [
              { label: "Light Timber", value: "Light Timber", color: "#caa06f", variant: "wood" },
              { label: "Soft Oak", value: "Soft Oak", color: "#b98d5e", variant: "wood" },
              { label: "Warm Carpet", value: "Warm Carpet", color: "#c9baab", variant: "texture" },
            ],
          },
          {
            key: "upgrades",
            label: "Upgrades",
            tiles: [
              { label: "Engineered Oak", value: "Engineered Oak", color: "#a97243", variant: "wood" },
              { label: "Stone Look Tile", value: "Stone Look Tile", color: "#c1bbb2", variant: "texture" },
            ],
          },
        ],
      },
    ],
  },
};

function buildInitialCheckedState(): TileCheckMap {
  const checked: TileCheckMap = {};

  for (const tab of colourReviewTabs) {
    const config = tabConfigs[tab];

    for (const section of config.sections) {
      for (const group of section.groups) {
        for (const tile of group.tiles) {
          checked[`${tab}:${section.title}:${group.key}:${tile.value}`] = true;
        }
      }
    }
  }

  return checked;
}

function getDoorFurnitureProducts() {
  const exteriorSections = tabConfigs.Exterior.sections;
  const doorFurnitureSection = exteriorSections.find((section) => section.title === DOOR_FURNITURE_SECTION_TITLE);
  if (!doorFurnitureSection) {
    return [];
  }

  return doorFurnitureSection.groups
    .filter((group) => group.key !== DOOR_FURNITURE_FINISH_GROUP_KEY)
    .flatMap((group) => group.tiles)
    .map((tile) => tile.label);
}

function buildInitialDoorFinishMap(): FinishMap {
  const finishMap: FinishMap = {};
  for (const product of getDoorFurnitureProducts()) {
    finishMap[product] = DEFAULT_DOOR_FINISH;
  }
  return finishMap;
}

function getDoorFurnitureProductFinishSummary(finishTiles: Tile[], selectedFinish: string) {
  return finishTiles.map((tile) => ({
    ...tile,
    isSelected: tile.value === selectedFinish,
  }));
}

function buildInitialKitchenSelectionState(): SelectionMap {
  const selections: SelectionMap = {};

  for (const section of tabConfigs.Kitchen.sections) {
    for (const group of section.groups) {
      selections[`Kitchen:${section.title}:${group.key}`] = group.defaultSelection ?? group.tiles[0]?.value ?? "";
    }
  }

  return selections;
}

function getTileStyle(tile: Tile): CSSProperties {
  if (tile.variant === "wood") {
    return {
      backgroundColor: tile.color,
      backgroundImage:
        "linear-gradient(135deg, rgba(255,255,255,.16), rgba(0,0,0,.08)), repeating-linear-gradient(90deg, rgba(255,255,255,.09) 0 6px, rgba(0,0,0,.05) 6px 12px)",
    };
  }

  if (tile.variant === "metal") {
    return {
      backgroundColor: tile.color,
      backgroundImage:
        "linear-gradient(135deg, rgba(255,255,255,.24), rgba(0,0,0,.08)), repeating-linear-gradient(145deg, rgba(255,255,255,.07) 0 7px, rgba(0,0,0,.05) 7px 14px)",
    };
  }

  if (tile.variant === "texture") {
    return {
      backgroundColor: tile.color,
      backgroundImage:
        "linear-gradient(135deg, rgba(255,255,255,.14), rgba(0,0,0,.08)), repeating-linear-gradient(125deg, rgba(255,255,255,.08) 0 7px, rgba(0,0,0,.06) 7px 14px)",
    };
  }

  return { backgroundColor: tile.color };
}

function renderDoorFurnitureArtwork(label: string) {
  if (label.includes("Pull Handle")) {
    return <span className={styles.handleArtworkPull} aria-hidden="true" />;
  }

  if (label.includes("Smart Lock")) {
    return <span className={styles.handleArtworkSmartLock} aria-hidden="true" />;
  }

  if (label.includes("Omni")) {
    return <span className={styles.handleArtworkLever} aria-hidden="true" />;
  }

  return <span className={styles.handleArtworkCylinder} aria-hidden="true" />;
}

function renderApplianceArtwork(label: string) {
  if (label.includes("Cooktop")) {
    return (
      <span className={styles.applianceCooktop} aria-hidden="true">
        <i />
        <i />
      </span>
    );
  }

  if (label.includes("Rangehood")) {
    return <span className={styles.applianceRangehood} aria-hidden="true" />;
  }

  if (label.includes("Dishwasher") || label.includes("Washer")) {
    return <span className={styles.applianceTall} aria-hidden="true" />;
  }

  if (label.includes("Microwave")) {
    return <span className={styles.applianceMicrowave} aria-hidden="true" />;
  }

  return <span className={styles.applianceOven} aria-hidden="true" />;
}

function renderKitchenVisual(tile: Tile) {
  switch (tile.visualKind) {
    case "cabinet":
      return <span className={`${styles.kitchenVisual} ${styles.kitchenCabinet}`} style={getTileStyle(tile)} aria-hidden="true" />;
    case "bench":
      return <span className={`${styles.kitchenVisual} ${styles.kitchenBench}`} style={getTileStyle(tile)} aria-hidden="true" />;
    case "tile":
      return <span className={`${styles.kitchenVisual} ${styles.kitchenTile}`} style={getTileStyle(tile)} aria-hidden="true" />;
    case "tapware":
      return <span className={styles.kitchenTapware} aria-hidden="true" />;
    case "handle":
      return <span className={styles.kitchenHandle} aria-hidden="true" />;
    case "appliance":
      return <span className={styles.tileArtworkAppliance}>{renderApplianceArtwork(tile.label)}</span>;
    default:
      return <span className={`${styles.tileSwatch} ${styles[tile.variant ?? "square"]}`} style={getTileStyle(tile)} />;
  }
}

function renderTileMedia(tile: Tile, sectionTitle: string) {
  if (tile.imageSrc) {
    return (
      <Image
        alt=""
        className={styles.tileMediaImage}
        fill
        sizes="140px"
        src={tile.imageSrc}
        style={{
          objectFit: tile.imageFit ?? "contain",
          objectPosition: tile.imagePosition ?? "center",
        }}
      />
    );
  }

  if (sectionTitle === "Door Furniture") {
    return <span className={styles.tileArtworkDoor}>{renderDoorFurnitureArtwork(tile.label)}</span>;
  }

  if (sectionTitle === "Kitchen") {
    return renderKitchenVisual(tile);
  }

  if (sectionTitle === "Appliances") {
    return <span className={styles.tileArtworkAppliance}>{renderApplianceArtwork(tile.label)}</span>;
  }

  return <span className={`${styles.tileSwatch} ${styles[tile.variant ?? "square"]}`} style={getTileStyle(tile)} />;
}

export function AiColourCombinationReviewStep() {
  const [activeTab, setActiveTab] = useState<ColourReviewTab>(colourReviewTabs[0]);
  const [checkedTilesByKey, setCheckedTilesByKey] = useState<TileCheckMap>(() => buildInitialCheckedState());
  const [kitchenSelectionsByKey, setKitchenSelectionsByKey] = useState<SelectionMap>(() => buildInitialKitchenSelectionState());
  const [activeKitchenModal, setActiveKitchenModal] = useState<KitchenModalState>(null);
  const [activeDoorFurnitureProduct, setActiveDoorFurnitureProduct] = useState<string>(
    tabConfigs.Exterior.sections.find((section) => section.title === DOOR_FURNITURE_SECTION_TITLE)?.groups[0]?.defaultSelection ??
      tabConfigs.Exterior.sections.find((section) => section.title === DOOR_FURNITURE_SECTION_TITLE)?.groups[0]?.tiles[0]?.label ??
      "",
  );
  const [doorFinishByProduct, setDoorFinishByProduct] = useState<FinishMap>(() => buildInitialDoorFinishMap());
  const [isDoorFurnitureModalOpen, setIsDoorFurnitureModalOpen] = useState(false);
  const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false);
  const [manualSectionDraft, setManualSectionDraft] = useState<ManualSectionDraft>(EMPTY_MANUAL_SECTION);
  const [manualSections, setManualSections] = useState<ManualSection[]>([]);
  const [isAddTileModalOpen, setIsAddTileModalOpen] = useState(false);
  const [manualTileDraft, setManualTileDraft] = useState<ManualTileDraft>(EMPTY_MANUAL_TILE);
  const [manualTilesByGroup, setManualTilesByGroup] = useState<Record<string, Tile[]>>({});

  const activeConfig = useMemo(() => tabConfigs[activeTab], [activeTab]);
  const activeKitchenModalSelection = activeKitchenModal ? kitchenSelectionsByKey[activeKitchenModal.groupKey] ?? activeKitchenModal.tiles[0]?.value ?? "" : "";
  const activeDoorFurnitureFinish = doorFinishByProduct[activeDoorFurnitureProduct] ?? DEFAULT_DOOR_FINISH;
  const doorFurnitureFinishTiles =
    tabConfigs.Exterior.sections
      .find((section) => section.title === DOOR_FURNITURE_SECTION_TITLE)
      ?.groups.find((group) => group.key === DOOR_FURNITURE_FINISH_GROUP_KEY)?.tiles ?? [];
  const visibleSections = activeTab === "Exterior" ? [...activeConfig.sections, ...manualSections] : activeConfig.sections;
  const activeManualTileSection = visibleSections.find(
    (section) => ("id" in section ? section.id : section.title) === manualTileDraft.sectionKey,
  );

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1>AI Colour Combination Review</h1>
            <span className={styles.aiBadge}>
              <TagIcon size={14} />
              AI Extracted
            </span>
          </div>
          <p>Customise your selections from the color selection guide.</p>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Combination categories" role="tablist">
        {colourReviewTabs.map((tab) => {
          const TabIcon = tab === "Exterior" ? HomeIcon : tab === "Kitchen" ? SparklesIcon : tab === "Bathrooms" ? PaletteIcon : tab === "Laundry" ? FileIcon : BookOpenIcon;
          const isActive = tab === activeTab;

          return (
            <button
              aria-pressed={isActive}
              className={`${styles.tabButton} ${isActive ? styles.activeTab : ""}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              <TabIcon size={17} />
              <span>{tab}</span>
            </button>
          );
        })}
      </nav>

      {activeTab === "Exterior" ? (
        <div className={styles.tabActions}>
          <button className={styles.createNewButton} onClick={() => setIsCreateNewModalOpen(true)} type="button">
            <SparklesIcon size={16} />
            Create new
          </button>
        </div>
      ) : null}

      <main className={styles.content}>
        {visibleSections.map((section, sectionIndex) => (
          <article className={styles.sectionCard} key={`${activeTab}-${"id" in section ? section.id : `${section.title}-${sectionIndex}`}`}>
            <header className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  <section.icon size={19} />
                </span>
                <h2>{section.title}</h2>
              </div>
              <button
                className={styles.sectionActionButton}
                onClick={() => {
                  const sectionKey = "id" in section ? String(section.id) : section.title;
                  const firstGroup = section.groups[0];
                  setManualTileDraft({
                    sectionTitle: section.title,
                    sectionKey,
                    groupKey: firstGroup?.key ?? "standard",
                    groupLabel: firstGroup?.label ?? "Standard",
                    label: "New tile",
                    value: "New tile",
                    color: "#d9d0c6",
                    variant: "texture",
                  });
                  setIsAddTileModalOpen(true);
                }}
                type="button"
              >
                <SparklesIcon size={14} />
                Add tile
              </button>
            </header>

            {(() => {
              const visibleGroups =
                activeTab === "Exterior" && section.title === DOOR_FURNITURE_SECTION_TITLE
                  ? section.groups.filter((group) => group.key !== DOOR_FURNITURE_FINISH_GROUP_KEY)
                  : section.groups;

              return (
                <div className={styles.sectionGrid} style={{ gridTemplateColumns: `repeat(${visibleGroups.length}, minmax(0, 1fr))` }}>
                  {visibleGroups.map((group, groupIndex) => {
                const sectionKey = "id" in section ? section.id : section.title;
                const groupKey = `${activeTab}:${sectionKey}:${group.key}`;
                const isDoorFurnitureSection = activeTab === "Exterior" && section.title === DOOR_FURNITURE_SECTION_TITLE;
                const isDoorFurnitureProductGroup = isDoorFurnitureSection && group.key !== DOOR_FURNITURE_FINISH_GROUP_KEY;
                const isKitchenSection = activeTab === "Kitchen";
                const manualTilesForGroup = manualTilesByGroup[groupKey] ?? [];
                const displayedTiles = [...group.tiles, ...manualTilesForGroup];
                const selectedKitchenTile = kitchenSelectionsByKey[groupKey] ?? group.defaultSelection ?? displayedTiles[0]?.value ?? "";

                return (
                  <div className={`${styles.group} ${groupIndex > 0 ? styles.groupDivider : ""}`} key={groupKey}>
                    <div className={styles.groupLabel}>{group.label}</div>
                    <div className={styles.tileGrid}>
                      {displayedTiles.map((tile) => {
                        const tileKey = `${groupKey}:${tile.value}`;
                        const isChecked = isDoorFurnitureProductGroup
                          ? true
                          : isKitchenSection
                            ? true
                          : checkedTilesByKey[tileKey] ?? true;

                        return (
                          <button
                            aria-pressed={isChecked}
                            className={`${styles.tileButton} ${isChecked ? styles.tileSelected : ""}`}
                            key={tile.value}
                            onClick={() => {
                              if (isDoorFurnitureProductGroup) {
                                setActiveDoorFurnitureProduct(tile.label);
                                setIsDoorFurnitureModalOpen(true);
                                return;
                              }

                              if (isKitchenSection) {
                                setKitchenSelectionsByKey((current) => ({
                                  ...current,
                                  [groupKey]: tile.value,
                                }));
                                setActiveKitchenModal({
                                  sectionTitle: section.title,
                                  groupKey,
                                  groupLabel: group.label,
                                  tiles: displayedTiles,
                                });
                                return;
                              }

                              setCheckedTilesByKey((current) => ({
                                ...current,
                                [tileKey]: !isChecked,
                              }));
                            }}
                            type="button"
                          >
                            <span
                              className={`${styles.tileCheck} ${isChecked ? styles.tileCheckSelected : styles.tileCheckUnselected}`}
                              aria-hidden="true"
                            >
                              {isChecked ? <CheckIcon size={10} /> : null}
                            </span>
                            <span className={`${styles.tileVisual} ${styles.tileVisualImage}`}>
                              {renderTileMedia(tile, section.title)}
                            </span>
                            {isKitchenSection ? (
                              <span className={styles.productFinishDots} aria-hidden="true">
                                {group.tiles.map((finish) => (
                                  <span
                                    className={`${styles.productFinishDot} ${selectedKitchenTile === finish.value ? styles.productFinishDotActive : ""}`}
                                    key={`${groupKey}-${tile.label}-kitchen-${finish.value}`}
                                    style={getTileStyle(finish)}
                                  />
                                ))}
                              </span>
                            ) : null}
                            {isDoorFurnitureProductGroup ? (
                              <span className={styles.productFinishDots} aria-hidden="true">
                                {getDoorFurnitureProductFinishSummary(doorFurnitureFinishTiles, doorFinishByProduct[tile.label] ?? DEFAULT_DOOR_FINISH).map(
                                  (finish) => (
                                  <span
                                    className={`${styles.productFinishDot} ${finish.isSelected ? styles.productFinishDotActive : ""}`}
                                    key={`${tile.label}-${finish.value}`}
                                    style={getTileStyle(finish)}
                                  />
                                  ),
                                )}
                              </span>
                            ) : null}
                            <span className={styles.tileLabel}>{tile.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
                  })}
                </div>
              );
            })()}
          </article>
        ))}
      </main>

      {isCreateNewModalOpen ? (
        <div className={styles.modalOverlay} onClick={() => setIsCreateNewModalOpen(false)} role="presentation">
          <section aria-labelledby="create-new-block-title" aria-modal="true" className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog">
            <header className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Manual exterior block</p>
                <h3 id="create-new-block-title">Create new block</h3>
                <p className={styles.modalDescription}>
                  Add a new roofing, bricks or facade block manually. The block will appear inside the Exterior tab.
                </p>
              </div>
              <button aria-label="Close create new block modal" className={styles.modalCloseButton} onClick={() => setIsCreateNewModalOpen(false)} type="button">
                <XIcon size={18} />
              </button>
            </header>

            <div className={styles.createModalForm}>
              <label className={styles.createModalField}>
                <span>Block title</span>
                <input
                  onChange={(event) => setManualSectionDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="e.g. Roofing"
                  value={manualSectionDraft.title}
                />
              </label>

              <div className={styles.createModalGrid}>
                <label className={styles.createModalField}>
                  <span>Standard label</span>
                  <input
                    onChange={(event) => setManualSectionDraft((current) => ({ ...current, standardLabel: event.target.value }))}
                    placeholder="e.g. Colorbond Monument"
                    value={manualSectionDraft.standardLabel}
                  />
                </label>
                <label className={styles.createModalField}>
                  <span>Standard value</span>
                  <input
                    onChange={(event) => setManualSectionDraft((current) => ({ ...current, standardValue: event.target.value }))}
                    placeholder="e.g. Colorbond Monument"
                    value={manualSectionDraft.standardValue}
                  />
                </label>
                <label className={styles.createModalField}>
                  <span>Upgrade label</span>
                  <input
                    onChange={(event) => setManualSectionDraft((current) => ({ ...current, upgradeLabel: event.target.value }))}
                    placeholder="e.g. Matte Black"
                    value={manualSectionDraft.upgradeLabel}
                  />
                </label>
                <label className={styles.createModalField}>
                  <span>Upgrade value</span>
                  <input
                    onChange={(event) => setManualSectionDraft((current) => ({ ...current, upgradeValue: event.target.value }))}
                    placeholder="e.g. Matte Black"
                    value={manualSectionDraft.upgradeValue}
                  />
                </label>
              </div>
            </div>

            <div className={styles.createModalPreview}>
              <div className={styles.createModalPreviewHeader}>
                <strong>{manualSectionDraft.title || "New block"}</strong>
                <span>Preview</span>
              </div>
              <div className={styles.createModalPreviewGrid}>
                <article>
                  <small>Standard</small>
                  <strong>{manualSectionDraft.standardLabel || "Standard finish"}</strong>
                  <span>{manualSectionDraft.standardValue || "Standard finish"}</span>
                </article>
                <article>
                  <small>Upgrades</small>
                  <strong>{manualSectionDraft.upgradeLabel || "Upgrade finish"}</strong>
                  <span>{manualSectionDraft.upgradeValue || "Upgrade finish"}</span>
                </article>
              </div>
            </div>

            <footer className={styles.createModalFooter}>
              <button onClick={() => setIsCreateNewModalOpen(false)} type="button">Cancel</button>
              <button
                onClick={() => {
                  const title = manualSectionDraft.title.trim() || "New block";
                  const standardLabel = manualSectionDraft.standardLabel.trim() || "Standard finish";
                  const standardValue = manualSectionDraft.standardValue.trim() || standardLabel;
                  const upgradeLabel = manualSectionDraft.upgradeLabel.trim() || "Upgrade finish";
                  const upgradeValue = manualSectionDraft.upgradeValue.trim() || upgradeLabel;

                  const newSection: ManualSection = {
                    id: `${Date.now()}`,
                    isManual: true,
                    title,
                    icon: HomeIcon,
                    groups: [
                      {
                        key: "standard",
                        label: "Standard",
                        tiles: [
                          {
                            label: standardLabel,
                            value: standardValue,
                            color: "#d9d0c6",
                            variant: "texture",
                          },
                        ],
                      },
                      {
                        key: "upgrades",
                        label: "Upgrades",
                        tiles: [
                          {
                            label: upgradeLabel,
                            value: upgradeValue,
                            color: "#9c948a",
                            variant: "texture",
                          },
                        ],
                      },
                    ],
                  };

                  setManualSections((current) => [...current, newSection]);
                  setManualSectionDraft(EMPTY_MANUAL_SECTION);
                  setIsCreateNewModalOpen(false);
                }}
                type="button"
              >
                Add block
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {isAddTileModalOpen ? (
        <div className={styles.modalOverlay} onClick={() => setIsAddTileModalOpen(false)} role="presentation">
          <section
            aria-labelledby="add-tile-modal-title"
            aria-modal="true"
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Manual tile</p>
                <h3 id="add-tile-modal-title">{manualTileDraft.sectionTitle || "Add tile"}</h3>
                <p className={styles.modalDescription}>
                  Add a new tile inside an existing block. Pick the section and group, then save it to the current tab.
                </p>
              </div>
              <button aria-label="Close add tile modal" className={styles.modalCloseButton} onClick={() => setIsAddTileModalOpen(false)} type="button">
                <XIcon size={18} />
              </button>
            </header>

            <div className={styles.createModalForm}>
              <div className={styles.createModalGrid}>
                <label className={styles.createModalField}>
                  <span>Section</span>
                  <input readOnly value={manualTileDraft.sectionTitle || "Existing block"} />
                </label>
                <label className={styles.createModalField}>
                  <span>Group</span>
                  <select
                    value={manualTileDraft.groupKey}
                    onChange={(event) => {
                      const nextGroupKey = event.target.value;
                      const nextGroup = activeManualTileSection?.groups.find((group) => group.key === nextGroupKey);

                      setManualTileDraft((current) => ({
                        ...current,
                        groupKey: nextGroupKey,
                        groupLabel: nextGroup?.label ?? nextGroupKey,
                      }));
                    }}
                  >
                    {(activeManualTileSection?.groups ?? []).map((group) => (
                      <option key={`${manualTileDraft.sectionKey}-${group.key}`} value={group.key}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.createModalField}>
                  <span>Tile label</span>
                  <input
                    onChange={(event) => setManualTileDraft((current) => ({ ...current, label: event.target.value }))}
                    placeholder="e.g. New Monument"
                    value={manualTileDraft.label}
                  />
                </label>
                <label className={styles.createModalField}>
                  <span>Tile value</span>
                  <input
                    onChange={(event) => setManualTileDraft((current) => ({ ...current, value: event.target.value }))}
                    placeholder="e.g. Colorbond New Monument"
                    value={manualTileDraft.value}
                  />
                </label>
                <label className={styles.createModalField}>
                  <span>Colour</span>
                  <div className={styles.colorInputRow}>
                    <input
                      aria-label="Pick colour"
                      className={styles.colorPicker}
                      onChange={(event) => setManualTileDraft((current) => ({ ...current, color: event.target.value }))}
                      type="color"
                      value={manualTileDraft.color}
                    />
                    <input
                      onChange={(event) => setManualTileDraft((current) => ({ ...current, color: event.target.value }))}
                      placeholder="#d9d0c6"
                      value={manualTileDraft.color}
                    />
                  </div>
                </label>
                <label className={styles.createModalField}>
                  <span>Visual style</span>
                  <select
                    value={manualTileDraft.variant}
                    onChange={(event) =>
                      setManualTileDraft((current) => ({
                        ...current,
                        variant: event.target.value as ManualTileDraft["variant"],
                      }))
                    }
                  >
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                    <option value="texture">Texture</option>
                    <option value="wood">Wood</option>
                    <option value="metal">Metal</option>
                  </select>
                </label>
              </div>
            </div>

            <div className={styles.createModalPreview}>
              <div className={styles.createModalPreviewHeader}>
                <strong>{manualTileDraft.label || "New tile"}</strong>
                <span>Preview</span>
              </div>
              <div className={styles.createModalPreviewGrid}>
                <article>
                  <small>Section</small>
                  <strong>{manualTileDraft.sectionTitle || "Existing block"}</strong>
                  <span>{manualTileDraft.groupLabel || "Standard"}</span>
                </article>
                <article>
                  <small>Tile</small>
                  <strong>{manualTileDraft.label || "New tile"}</strong>
                  <span>{manualTileDraft.value || "New tile"}</span>
                </article>
              </div>
            </div>

            <footer className={styles.createModalFooter}>
              <button onClick={() => setIsAddTileModalOpen(false)} type="button">Cancel</button>
              <button
                onClick={() => {
                  const sectionKey = manualTileDraft.sectionKey;
                  const nextTile: Tile = {
                    label: manualTileDraft.label.trim() || "New tile",
                    value: manualTileDraft.value.trim() || manualTileDraft.label.trim() || "New tile",
                    color: manualTileDraft.color.trim() || "#d9d0c6",
                    variant: manualTileDraft.variant,
                  };

                  const targetGroupKey = manualTileDraft.groupKey;
                  const tileGroupKey = `${activeTab}:${sectionKey}:${targetGroupKey}`;
                  const targetGroup = activeManualTileSection?.groups.find((group) => group.key === targetGroupKey);

                  setManualTilesByGroup((current) => ({
                    ...current,
                    [tileGroupKey]: [...(current[tileGroupKey] ?? []), nextTile],
                  }));

                  setManualTileDraft((current) => ({
                    ...current,
                    label: "New tile",
                    value: "New tile",
                    color: "#d9d0c6",
                    variant: "texture",
                    groupLabel: targetGroup?.label ?? current.groupLabel,
                  }));
                  setIsAddTileModalOpen(false);
                }}
                type="button"
              >
                Add tile
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {isDoorFurnitureModalOpen ? (
        <div className={styles.modalOverlay} onClick={() => setIsDoorFurnitureModalOpen(false)} role="presentation">
          <section
            aria-labelledby="door-furniture-modal-title"
            aria-modal="true"
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Door furniture finish selection</p>
                <h3 id="door-furniture-modal-title">{activeDoorFurnitureProduct}</h3>
                <p className={styles.modalDescription}>
                  Select a finish for this product. The right-side finish panel will stay synced with the selected product.
                </p>
              </div>
              <button aria-label="Close door furniture modal" className={styles.modalCloseButton} onClick={() => setIsDoorFurnitureModalOpen(false)} type="button">
                <XIcon size={18} />
              </button>
            </header>

            <div className={styles.modalProductPreview}>
              <span className={styles.modalProductImage} aria-hidden="true">
                {renderTileMedia(
                  tabConfigs.Exterior.sections
                    .find((section) => section.title === DOOR_FURNITURE_SECTION_TITLE)
                    ?.groups.flatMap((group) => group.tiles)
                    .find((tile) => tile.label === activeDoorFurnitureProduct) ?? {
                    label: activeDoorFurnitureProduct,
                    value: activeDoorFurnitureProduct,
                    color: "#ddd",
                    variant: "metal",
                  },
                  DOOR_FURNITURE_SECTION_TITLE,
                )}
              </span>
              <div className={styles.modalProductMeta}>
                <span>Selected product</span>
                <strong>{activeDoorFurnitureProduct}</strong>
                <p>Current finish: {activeDoorFurnitureFinish}</p>
                <span className={styles.productFinishDots} aria-hidden="true">
                  {getDoorFurnitureProductFinishSummary(doorFurnitureFinishTiles, activeDoorFurnitureFinish).map((finish) => (
                    <span
                      className={`${styles.productFinishDot} ${finish.isSelected ? styles.productFinishDotActive : ""}`}
                      key={`preview-${activeDoorFurnitureProduct}-${finish.value}`}
                      style={getTileStyle(finish)}
                    />
                  ))}
                </span>
              </div>
            </div>

            <div className={styles.modalFinishGrid}>
              {doorFurnitureFinishTiles.map((tile) => {
                const isSelected = activeDoorFurnitureFinish === tile.value;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`${styles.modalFinishTile} ${isSelected ? styles.modalFinishTileSelected : ""}`}
                    key={tile.value}
                    onClick={() => {
                      setDoorFinishByProduct((current) => ({
                        ...current,
                        [activeDoorFurnitureProduct]: tile.value,
                      }));
                      setIsDoorFurnitureModalOpen(false);
                    }}
                    type="button"
                  >
                    <span className={`${styles.modalFinishCheck} ${isSelected ? styles.modalFinishCheckSelected : styles.modalFinishCheckUnselected}`} aria-hidden="true">
                      <CheckIcon size={9} />
                    </span>
                    <span className={`${styles.modalFinishSwatch} ${styles[tile.variant ?? "square"]}`} style={getTileStyle(tile)} aria-hidden="true" />
                    <span>{tile.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}

      {activeKitchenModal ? (
        <div className={styles.modalOverlay} onClick={() => setActiveKitchenModal(null)} role="presentation">
          <section
            aria-labelledby="kitchen-modal-title"
            aria-modal="true"
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <header className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Kitchen finish selection</p>
                <h3 id="kitchen-modal-title">{activeKitchenModal.groupLabel}</h3>
                <p className={styles.modalDescription}>
                  Select the finish for this kitchen product group. All available options remain checked for quick comparison.
                </p>
              </div>
              <button aria-label="Close kitchen modal" className={styles.modalCloseButton} onClick={() => setActiveKitchenModal(null)} type="button">
                <XIcon size={18} />
              </button>
            </header>

            <div className={styles.modalProductPreview}>
              <span className={styles.modalProductImage} aria-hidden="true">
                {renderTileMedia(
                  activeKitchenModal.tiles.find((tile) => tile.value === activeKitchenModalSelection) ?? activeKitchenModal.tiles[0] ?? {
                    label: activeKitchenModal.groupLabel,
                    value: activeKitchenModal.groupLabel,
                    color: "#ddd",
                    variant: "square",
                  },
                  activeKitchenModal.sectionTitle,
                )}
              </span>
              <div className={styles.modalProductMeta}>
                <span>Selected product</span>
                <strong>{activeKitchenModal.groupLabel}</strong>
                <p>Current finish: {activeKitchenModalSelection || "Not selected"}</p>
              </div>
            </div>

            <div className={styles.modalFinishGrid}>
              {activeKitchenModal.tiles.map((tile) => {
                const isSelected = activeKitchenModalSelection === tile.value;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`${styles.modalFinishTile} ${isSelected ? styles.modalFinishTileSelected : ""}`}
                    key={`kitchen-modal-${activeKitchenModal.groupKey}-${tile.value}`}
                    onClick={() => {
                      setKitchenSelectionsByKey((current) => ({
                        ...current,
                        [activeKitchenModal.groupKey]: tile.value,
                      }));
                      setActiveKitchenModal(null);
                    }}
                    type="button"
                  >
                    <span className={`${styles.modalFinishCheck} ${isSelected ? styles.modalFinishCheckSelected : styles.modalFinishCheckUnselected}`} aria-hidden="true">
                      <CheckIcon size={9} />
                    </span>
                    <span className={`${styles.modalFinishSwatch} ${styles[tile.variant ?? "square"]}`} style={getTileStyle(tile)} aria-hidden="true" />
                    <span>{tile.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}

    </div>
  );
}
