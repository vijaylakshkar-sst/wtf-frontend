export type MasterFieldType = "text" | "select" | "textarea";

export type MasterField = {
  key: string;
  label: string;
  type?: MasterFieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export type MasterRecord = {
  id: number;
  name: string;
  code: string;
  status: "Active" | "Inactive";
  description: string;
  [key: string]: string | number;
};

export type MasterConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  singular: string;
  fields: MasterField[];
  rows: MasterRecord[];
};
