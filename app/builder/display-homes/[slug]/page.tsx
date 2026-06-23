import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisplayHomeDetailPage } from "@/components/builder/display-homes/detail/display-home-detail-page";
import { displayHomes, displayHomeSlug, findDisplayHomeBySlug } from "@/components/builder/display-homes/data";

type DisplayHomePageParams = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return displayHomes.map((home) => ({ slug: displayHomeSlug(home.name) }));
}

export async function generateMetadata({ params }: DisplayHomePageParams): Promise<Metadata> {
  const { slug } = await params;
  const home = findDisplayHomeBySlug(slug);

  if (!home) {
    return {
      title: "Display home preview",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${home.name} | Display home preview`,
    robots: { index: false, follow: false },
  };
}

export default async function BuilderDisplayHomeDetailPage({ params }: DisplayHomePageParams) {
  const { slug } = await params;
  const home = findDisplayHomeBySlug(slug);

  if (!home) {
    notFound();
  }

  return <DisplayHomeDetailPage home={home} />;
}
