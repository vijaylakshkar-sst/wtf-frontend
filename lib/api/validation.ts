export type ValidationErrors<TForm extends Record<string, unknown>> = Partial<Record<keyof TForm, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const splitCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const getFirstAndLastName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "";

  return {
    firstName,
    lastName: parts.join(" "),
  };
};

export const requireText = (value: string, label: string) => {
  if (!value.trim()) {
    return `${label} is required.`;
  }

  return "";
};

export const validateEmail = (value: string, label: string) => {
  if (!value.trim()) {
    return `${label} is required.`;
  }

  if (!emailPattern.test(value.trim())) {
    return `Enter a valid ${label.toLowerCase()}.`;
  }

  return "";
};

export const validateOptionalEmail = (value: string, label: string) => {
  if (!value.trim()) {
    return "";
  }

  if (!emailPattern.test(value.trim())) {
    return `Enter a valid ${label.toLowerCase()}.`;
  }

  return "";
};

export const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include letters and numbers.";
  }

  return "";
};

export const validateOptionalUrl = (value: string, label: string) => {
  if (!value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol)) {
      return `${label} must start with http:// or https://.`;
    }
  } catch {
    return `Enter a valid ${label.toLowerCase()}.`;
  }

  return "";
};

export const validateNonNegativeInteger = (value: string, label: string, required = false) => {
  if (!value.trim()) {
    return required ? `${label} is required.` : "";
  }

  if (!/^\d+$/.test(value.trim())) {
    return `${label} must be a whole number.`;
  }

  return "";
};
