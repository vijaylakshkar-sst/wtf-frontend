import { MasterCrudPage } from "@/components/masters/master-crud-page";
import { SupplierShell } from "@/components/supplier/supplier-shell";
import { supplierMasterConfigs, type SupplierMasterSlug } from "@/components/supplier/product-management/data";

export function SupplierMasterPage({ slug }: { slug: SupplierMasterSlug }) {
  return <MasterCrudPage config={supplierMasterConfigs[slug]} Shell={SupplierShell} />;
}
