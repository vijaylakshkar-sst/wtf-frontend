"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoxIcon, ChartIcon, ClipboardIcon, GearIcon, GridIcon, HomeIcon, PlusIcon, ShieldIcon, UploadIcon, UsersIcon } from "@/components/icons";
import { masterNavigation } from "@/components/builder/masters/data";

export function BuilderSidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={`builder-sidebar${isOpen ? " open" : " closed"}`}>
      <section className="builder-company"><span>AH</span><div><strong>Acme Homes</strong><small>4 display homes active</small></div></section>
      <nav aria-label="Builder portal navigation">
        <small>Main</small>
        <Link className={pathname === "/builder" ? "active" : ""} href="/builder"><GridIcon size={18} /> Dashboard</Link>
        <Link className={pathname.startsWith("/builder/display-homes") ? "active" : ""} href="/builder/display-homes"><HomeIcon size={18} /> Display homes</Link>
        <Link className={pathname.startsWith("/builder/products") ? "active" : ""} href="/builder/products"><BoxIcon size={18} /> Products</Link>
        {pathname.startsWith("/builder/products") ? (
          <div className="builder-subnav">
            <Link className={pathname === "/builder/products/add" ? "active" : ""} href="/builder/products/add"><PlusIcon size={15} /> Add product</Link>
            <Link className={pathname === "/builder/products/upload-pdf" ? "active" : ""} href="/builder/products/upload-pdf"><UploadIcon size={15} /> Upload PDF</Link>
          </div>
        ) : null}
        <small>Customers</small>
        <Link className={pathname.startsWith("/builder/leads") ? "active" : ""} href="/builder/leads"><UsersIcon size={18} /> Leads & Customers</Link>
        <a href="#"><ClipboardIcon size={18} /> Selections</a>
        <small>Business</small>
        <Link className={pathname.startsWith("/builder/analytics") ? "active" : ""} href="/builder/analytics"><ChartIcon size={18} /> Analytics</Link>
        <Link className={pathname.startsWith("/builder/masters") ? "active" : ""} href="/builder/masters"><GearIcon size={18} /> Masters</Link>
        {pathname.startsWith("/builder/masters") ? (
          <div className="builder-subnav">
            {masterNavigation.map((item) => (
              <Link className={pathname === item.href ? "active" : ""} href={item.href} key={item.slug}><ClipboardIcon size={15} /> {item.label}</Link>
            ))}
          </div>
        ) : null}
        <Link className={pathname.startsWith("/builder/staff") ? "active" : ""} href="/builder/staff"><UsersIcon size={18} /> Staff</Link>
        <Link className={pathname.startsWith("/builder/roles-permissions") ? "active" : ""} href="/builder/roles-permissions"><ShieldIcon size={18} /> Roles & Permissions</Link>
        <a href="#"><GearIcon size={18} /> Settings</a>
      </nav>
      <div className="builder-sidebar-quote"><strong>Build more.<br />Grow more.</strong><span aria-hidden="true">&rarr;</span></div>
    </aside>
  );
}
