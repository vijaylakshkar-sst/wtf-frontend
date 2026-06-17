"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { BookOpenIcon, CheckIcon, EditIcon, EyeIcon, FileIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/icons";
import { useToast } from "@/components/toast-provider";
import { adminCmsApi, getErrorMessage, type CmsFaqItem, type CmsPage, type CmsPageStatus } from "@/lib/api";

const toolbar = ["B", "I", "H1", "H2", "List", "Link", "Quote"] as const;

const statusLabels: Record<CmsPageStatus, string> = {
  draft: "Draft",
  review: "Review",
  published: "Published",
};

const getUpdatedLabel = (value?: string) => {
  if (!value) return "Not saved";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export function AdminCmsManagementPage() {
  const { showToast } = useToast();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [activePage, setActivePage] = useState<CmsPage | null>(null);
  const [content, setContent] = useState("");
  const [faqRows, setFaqRows] = useState<CmsFaqItem[]>([]);
  const [status, setStatus] = useState<CmsPageStatus>("draft");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadPages = async () => {
      setIsLoading(true);

      try {
        const response = await adminCmsApi.listPages();
        const nextPages = response.data.pages;

        if (!isCurrent) return;

        setPages(nextPages);
        const firstPage = nextPages[0] || null;
        setActivePage(firstPage);
        setContent(firstPage?.content || "");
        setFaqRows(firstPage?.faqItems?.length ? firstPage.faqItems : [{ question: "", answer: "" }]);
        setStatus(firstPage?.status || "draft");
      } catch (cmsError) {
        if (isCurrent) {
          showToast(getErrorMessage(cmsError), "error");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    loadPages();

    return () => {
      isCurrent = false;
    };
  }, [showToast]);

  useEffect(() => {
    if (!editorRef.current || !activePage) {
      return;
    }

    editorRef.current.innerHTML = content;
  }, [activePage]);

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return pages;
    }

    return pages.filter((page) => {
      const haystack = [page.title, page.slug, page.type, page.status].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [pages, searchQuery]);

  const selectPage = (page: CmsPage) => {
    setActivePage(page);
    setContent(page.content);
    setFaqRows(page.faqItems?.length ? page.faqItems : [{ question: "", answer: "" }]);
    setStatus(page.status);
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

  const addFaqRow = () => {
    setFaqRows((rows) => [
      ...rows,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  const updateFaqRow = (index: number, field: keyof CmsFaqItem, value: string) => {
    setFaqRows((rows) =>
      rows.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  const removeFaqRow = (index: number) => {
    setFaqRows((rows) => rows.filter((_, rowIndex) => rowIndex !== index));
  };

  const saveActivePage = async (nextStatus = status) => {
    if (!activePage) return;

    setIsSaving(true);

    try {
      const response = await adminCmsApi.updatePage(activePage.slug, {
        title: activePage.title,
        status: nextStatus,
        content: activePage.type === "faq" ? "" : content,
        faqItems: activePage.type === "faq" ? faqRows : [],
      });
      const savedPage = response.data.page;

      setPages((currentPages) =>
        currentPages.map((page) => (page.id === savedPage.id ? savedPage : page))
      );
      setActivePage(savedPage);
      setContent(savedPage.content);
      setFaqRows(savedPage.faqItems?.length ? savedPage.faqItems : [{ question: "", answer: "" }]);
      setStatus(savedPage.status);
      showToast(nextStatus === "published" ? "CMS page published." : "Draft saved.");
    } catch (cmsError) {
      showToast(getErrorMessage(cmsError), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const publishedCount = pages.filter((page) => page.status === "published").length;
  const reviewCount = pages.filter((page) => page.status !== "published").length;

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
            <input
              aria-label="Search CMS pages"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search content pages..."
              value={searchQuery}
            />
          </label>
        </header>

        <section className="admin-list-summary">
          <article><span><BookOpenIcon size={22} /></span><div><small>CMS pages</small><strong>{pages.length}</strong></div></article>
          <article><span><CheckIcon size={22} /></span><div><small>Published</small><strong>{publishedCount}</strong></div></article>
          <article><span><EditIcon size={22} /></span><div><small>Needs review</small><strong>{reviewCount}</strong></div></article>
        </section>

        <section className="admin-cms-layout">
          <aside className="admin-panel admin-cms-pages">
            <header>
              <div><h2>Pages</h2><p>Select content page to edit.</p></div>
            </header>
            <div>
              {isLoading ? <p>Loading CMS pages...</p> : null}
              {!isLoading && filteredPages.length === 0 ? (
                <p>No CMS pages match your search.</p>
              ) : null}
              {filteredPages.map((page) => (
                <button className={activePage?.id === page.id ? "active" : ""} key={page.id} onClick={() => selectPage(page)} type="button">
                  <FileIcon size={18} />
                  <span><strong>{page.title}</strong><small>{statusLabels[page.status]} - {getUpdatedLabel(page.updatedAt)}</small></span>
                </button>
              ))}
            </div>
          </aside>

          <section className="admin-panel admin-rich-editor">
            <header>
              <div><h2>{activePage?.title || "CMS page"}</h2><p>Rich editor content area for website CMS copy.</p></div>
              {activePage?.type === "faq" ? (
                <button onClick={addFaqRow} type="button"><PlusIcon size={16} /> Add row</button>
              ) : null}
            </header>

            <div className="admin-editor-meta">
              <label><span>Page title</span><input value={activePage?.title || ""} readOnly /></label>
              <label><span>Status</span><select onChange={(event) => setStatus(event.target.value as CmsPageStatus)} value={status}><option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option></select></label>
            </div>

            {activePage?.type === "faq" ? (
              <div className="admin-faq-editor">
                <div className="admin-faq-head"><span>Question</span><span>Answer</span><span>Action</span></div>
                {faqRows.map((row, index) => (
                  <article className="admin-faq-row" key={index}>
                    <label>
                      <span>Question {index + 1}</span>
                      <input
                        onChange={(event) => updateFaqRow(index, "question", event.target.value)}
                        placeholder="Enter frequently asked question"
                        value={row.question}
                      />
                    </label>
                    <label>
                      <span>Answer</span>
                      <textarea
                        onChange={(event) => updateFaqRow(index, "answer", event.target.value)}
                        placeholder="Write a clear answer"
                        value={row.answer}
                      />
                    </label>
                    <button
                      aria-label={`Delete FAQ row ${index + 1}`}
                      disabled={faqRows.length === 1}
                      onClick={() => removeFaqRow(index)}
                      title="Delete row"
                      type="button"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <>
                <div className="admin-editor-toolbar" aria-label="Rich editor toolbar">
                  {toolbar.map((tool) => <button key={tool} onMouseDown={(event) => event.preventDefault()} onClick={() => applyToolbarAction(tool)} type="button">{tool}</button>)}
                </div>

                <div
                  aria-label={`${activePage?.title || "CMS page"} content`}
                  className="admin-editor-surface"
                  contentEditable
                  onInput={(event) => setContent(event.currentTarget.innerHTML)}
                  ref={editorRef}
                  role="textbox"
                  suppressContentEditableWarning
                />
              </>
            )}

            <footer>
              <button disabled={!activePage || isSaving} onClick={() => saveActivePage(status === "published" ? "draft" : status)} type="button">{isSaving ? "Saving..." : "Save draft"}</button>
              <button className="primary" disabled={!activePage || isSaving} onClick={() => saveActivePage("published")} type="button"><CheckIcon size={16} /> Publish</button>
            </footer>
          </section>
        </section>
      </section>
    </AdminShell>
  );
}
