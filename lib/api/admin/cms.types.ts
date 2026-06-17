export type CmsPageStatus = "draft" | "review" | "published";

export type CmsPageType = "rich_text" | "faq";

export type CmsFaqItem = {
  question: string;
  answer: string;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  type: CmsPageType;
  status: CmsPageStatus;
  content: string;
  faqItems: CmsFaqItem[];
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CmsPagesResponse = {
  pages: CmsPage[];
};

export type CmsPageResponse = {
  page: CmsPage;
};

export type CmsPagePayload = {
  title: string;
  status: CmsPageStatus;
  content?: string;
  faqItems?: CmsFaqItem[];
};

export type CmsPageCreatePayload = {
  slug?: string;
  title: string;
  type?: CmsPageType;
  status?: CmsPageStatus;
  content?: string;
  faqItems?: CmsFaqItem[];
};
