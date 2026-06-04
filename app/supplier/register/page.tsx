import type { Metadata } from "next";
import { SupplierRegistration } from "@/components/supplier-registration";

export const metadata: Metadata = {
  title: "Supplier registration",
  description: "Register your supplier business with WTF? to feature products inside display homes and reach buyers.",
  alternates: { canonical: "/supplier/register" },
};

export default function SupplierRegistrationPage() {
  return <SupplierRegistration />;
}
