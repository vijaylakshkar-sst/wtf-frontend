export type ContactEnquiryType = "customer" | "supplier" | "builder" | "general";

export type ContactEnquiryPriority = "low" | "medium" | "high";

export type ContactEnquiryStatus = "new" | "in_progress" | "closed";

export type ContactEnquiry = {
  id: string;
  referenceCode: string;
  enquiryType: ContactEnquiryType;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  subject: string;
  message: string;
  priority: ContactEnquiryPriority;
  status: ContactEnquiryStatus;
  source?: string;
  respondedAt?: string | null;
  closedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactEnquiryStats = {
  totalCount: number;
  newCount: number;
  highPriorityCount: number;
  closedCount: number;
  newThisWeekCount: number;
  resolvedThisMonthCount: number;
};

export type ContactEnquiriesResponse = {
  enquiries: ContactEnquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: ContactEnquiryStats;
};

export type ContactEnquiryResponse = {
  enquiry: ContactEnquiry;
};

export type ContactEnquiryStatusPayload = {
  status: ContactEnquiryStatus;
};
