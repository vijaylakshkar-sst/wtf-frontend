import type { Metadata } from "next";
import { BuilderRegistration } from "@/components/builder-registration";

export const metadata: Metadata = {
  title: "Builder registration",
  description: "Register your building company with WTF? to showcase display homes, capture leads, and manage customer selections.",
  alternates: { canonical: "/builder/register" },
};

export default function BuilderRegistrationPage() {
  return <BuilderRegistration />;
}
