import type { Metadata } from "next";
import { AdminProfileDetailPage } from "@/components/admin/detail/admin-profile-detail-page";

export const metadata: Metadata = {
  title: "Builder details | Admin portal",
  robots: { index: false, follow: false },
};

export default async function AdminBuilderDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AdminProfileDetailPage id={id} type="builder" />;
}
