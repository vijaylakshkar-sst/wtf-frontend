import type { Metadata } from "next";
import "./globals.css";
import "./dashboard.css";
import "./registration.css";
export const metadata: Metadata = { title: "WTF? | Display home platform", description: "Connect display homes with the right buyers." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
