import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import "./globals.css";
import "./dashboard.css";
import "./registration.css";
import "./supplier-dashboard.css";
import "./admin-dashboard.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | WTF?",
  },
  description: siteConfig.description,
  keywords: ["display homes", "home builders", "building suppliers", "product selections", "Australia"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/hero.png", width: 1600, height: 900, alt: "Modern Australian display home interior" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/hero.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
