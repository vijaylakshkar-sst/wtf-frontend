"use client";

import { useRef, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { BookOpenIcon, CheckIcon, EditIcon, EyeIcon, FileIcon, SearchIcon } from "@/components/icons";

const cmsPages = [
  {
    key: "about",
    title: "About Us",
    status: "Published",
    updated: "Today",
    content: "<p>Where's From That helps display home visitors discover products, save favourites and connect builders with suppliers through a guided product discovery platform.</p>",
  },
  {
    key: "faqs",
    title: "FAQs",
    status: "Draft",
    updated: "Yesterday",
    content: "<p>Add customer, builder and supplier frequently asked questions here. Keep answers clear, short and easy to scan.</p>",
  },
  {
    key: "terms",
    title: "Terms & Conditions",
    status: "Review",
    updated: "3 days ago",
    content: "<p>Add platform usage terms, account responsibilities, product information disclaimers, moderation rules and service conditions.</p>",
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    status: "Published",
    updated: "Last week",
    content: "<p>Add privacy collection notices, usage details, retention rules, customer rights and contact details for privacy requests.</p>",
  },
] as const;

const toolbar = ["B", "I", "H1", "H2", "List", "Link", "Quote"] as const;
type CmsPage = typeof cmsPages[number];

export function AdminCmsManagementPage() {
  const [activePage, setActivePage] = useState<CmsPage>(cmsPages[0]);
  const [content, setContent] = useState<string>(cmsPages[0].content);
  const editorRef = useRef<HTMLDivElement>(null);

  const selectPage = (page: CmsPage) => {
    setActivePage(page);
    setContent(page.content);
  };

  const applyToolbarAction = (tool: typeof toolbar[number]) => {
    editorRef.current?.focus();
    if (tool === "B") document.execCommand("bold");
    if (tool === "I") document.execCommand("italic");
    if (tool === "H1") document.execCommand("formatBlock", false, "h1");
    if (tool === "H2") document.execCommand("formatBlock", false, "h2");
    if (tool === "List") document.execCommand("insertUnorderedList");
    if (tool === "Quote") document.execCommand("formatBlock", false, "blockquote");
    if (tool === "Link") {
      const url = window.prompt("Enter link URL", "https://");
      if (!url) return;
      document.execCommand("createLink", false, url);
    }
    setContent(editorRef.current?.innerHTML || "");
  };

  return (
    <AdminShell>
      <section className="builder-main admin-main">
        <header className="admin-page-header">
          <div>
            <p>CMS management</p>
            <h1>Content pages</h1>
            <span>Manage website content for About Us, FAQs, Terms & Conditions and Privacy Policy using a rich editor flow.</span>
          </div>
          <label className="admin-search">
            <SearchIcon size={17} />
            <input aria-label="Search CMS pages" placeholder="Search content pages..." />
          </label>
        </header>

        <section className="admin-list-summary">
          <article><span><BookOpenIcon size={22} /></span><div><small>CMS pages</small><strong>4</strong></div></article>
          <article><span><CheckIcon size={22} /></span><div><small>Published</small><strong>2</strong></div></article>
          <article><span><EditIcon size={22} /></span><div><small>Needs review</small><strong>2</strong></div></article>
        </section>

        <section className="admin-cms-layout">
          <aside className="admin-panel admin-cms-pages">
            <header>
              <div><h2>Pages</h2><p>Select content page to edit.</p></div>
            </header>
            <div>
              {cmsPages.map((page) => (
                <button className={activePage.key === page.key ? "active" : ""} key={page.key} onClick={() => selectPage(page)} type="button">
                  <FileIcon size={18} />
                  <span><strong>{page.title}</strong><small>{page.status} - {page.updated}</small></span>
                </button>
              ))}
            </div>
          </aside>

          <section className="admin-panel admin-rich-editor">
            <header>
              <div><h2>{activePage.title}</h2><p>Rich editor content area for website CMS copy.</p></div>
              <button type="button"><EyeIcon size={16} /> Preview</button>
            </header>

            <div className="admin-editor-meta">
              <label><span>Page title</span><input value={activePage.title} readOnly /></label>
              <label><span>Status</span><select defaultValue={activePage.status}><option>Draft</option><option>Review</option><option>Published</option></select></label>
            </div>

            <div className="admin-editor-toolbar" aria-label="Rich editor toolbar">
              {toolbar.map((tool) => <button key={tool} onMouseDown={(event) => event.preventDefault()} onClick={() => applyToolbarAction(tool)} type="button">{tool}</button>)}
            </div>

            <div
              aria-label={`${activePage.title} content`}
              className="admin-editor-surface"
              contentEditable
              dangerouslySetInnerHTML={{ __html: content }}
              key={activePage.key}
              onInput={(event) => setContent(event.currentTarget.innerHTML)}
              ref={editorRef}
              role="textbox"
              suppressContentEditableWarning
            />

            <footer>
              <button type="button">Save draft</button>
              <button className="primary" type="button"><CheckIcon size={16} /> Publish</button>
            </footer>
          </section>
        </section>
      </section>
    </AdminShell>
  );
}
