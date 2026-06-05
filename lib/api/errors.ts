export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again.") => {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
};
