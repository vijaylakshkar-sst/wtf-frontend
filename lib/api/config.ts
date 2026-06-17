export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

export const apiRoutes = {
  auth: {
    me: "/auth/me",
    login: "/auth/login",
    refresh: "/auth/refresh-token",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
    logout: "/auth/logout",
  },
  admin: {
    builders: "/admin/builders",
    cmsPages: "/admin/cms-pages",
    suppliers: "/admin/suppliers",
  },
  builders: {
    register: "/builders/register",
    permissions: "/builders/permissions",
    roles: "/builders/roles",
    staff: "/builders/staff",
  },
  suppliers: {
    industryCategories: "/suppliers/industry-categories",
    register: "/suppliers/register",
  },
} as const;
