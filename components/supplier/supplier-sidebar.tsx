"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, ChartIcon, ClipboardIcon, GridIcon, UploadIcon, UsersIcon } from "@/components/icons";
import { supplierMasterNavigation } from "@/components/supplier/product-management/data";

export function SupplierSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={`builder-sidebar${isOpen ? " open" : " closed"}`}>
      <nav aria-label="Supplier portal navigation">
        <small>Main</small>
        <Link className={pathname === "/supplier/dashboard" ? "active" : ""} href="/supplier/dashboard"><GridIcon size={18} /> Dashboard</Link>
        <Link className={pathname.startsWith("/supplier/product-management") ? "active" : ""} href="/supplier/product-management"><ClipboardIcon size={18} /> Product Management</Link>
        {pathname.startsWith("/supplier/product-management") ? (
          <div className="builder-subnav">
            <Link className={pathname === "/supplier/product-management/add" ? "active" : ""} href="/supplier/product-management/add"><BoxIcon size={15} /> Add product</Link>
            <Link className={pathname === "/supplier/product-management/upload-pdf" ? "active" : ""} href="/supplier/product-management/upload-pdf"><UploadIcon size={15} /> Upload PDF</Link>
            {supplierMasterNavigation.map((item) => (
              <Link className={pathname === item.href ? "active" : ""} href={item.href} key={item.slug}><ClipboardIcon size={15} /> {item.label}</Link>
            ))}
          </div>
        ) : null}
        <Link className={pathname.startsWith("/supplier/product-inventory") ? "active" : ""} href="/supplier/product-inventory"><BoxIcon size={18} /> Product Inventory</Link>
        <Link className={pathname.startsWith("/supplier/builder-associations") ? "active" : ""} href="/supplier/builder-associations"><UsersIcon size={18} /> Builder Associations</Link>
        <Link className={pathname.startsWith("/supplier/customer-engagement-analytics") ? "active" : ""} href="/supplier/customer-engagement-analytics"><ChartIcon size={18} /> Customer Engagement Analytics</Link>
      
      </nav>
      <div className="builder-sidebar-quote"><strong>Reach more.<br />Grow more.</strong><span aria-hidden="true">&rarr;</span></div>
    </aside>
  );
}
