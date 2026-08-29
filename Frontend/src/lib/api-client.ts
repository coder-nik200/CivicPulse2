const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

/* =========================================================
   TYPES
========================================================= */

export type UserRole = "citizen" | "authority" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export interface RequestOptions extends RequestInit {}

export interface IssueResponse {
  success: boolean;
  message?: string;
  issue?: any;
  data?: any;
}

/* =========================================================
   GENERIC API REQUEST
========================================================= */

export async function request<T>(
  path: string,
  init: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(init.headers);

  // Never manually set Content-Type for FormData.
  // The browser automatically adds the multipart boundary.
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return payload as T;
}

/* =========================================================
   AUTH API
========================================================= */

export const authApi = {
  me: async (): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/me", {
      method: "GET",
    });
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  signup: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
  }): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<AuthResponse> => {
    return request<AuthResponse>("/auth/logout", {
      method: "POST",
    });
  },
};

/* =========================================================
   ISSUE API
========================================================= */

export const issueApi = {
  create: async (formData: FormData): Promise<IssueResponse> => {
    return request<IssueResponse>("/issues", {
      method: "POST",
      body: formData,
    });
  },

  getAll: async () => {
    return request("/issues", {
      method: "GET",
    });
  },

  getById: async (id: string) => {
    return request(`/issues/${id}`, {
      method: "GET",
    });
  },

  getMine: async () => {
    return request("/issues/my", {
      method: "GET",
    });
  },

  updateStatus: async (id: string, status: string) => {
    return request(`/issues/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    });
  },
};

/* =========================================================
   NOTIFICATION API
========================================================= */

export const notificationApi = {
  getAll: async () => {
    return request("/notifications", {
      method: "GET",
    });
  },

  markRead: async (id: string) => {
    return request(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  },
};

/* =========================================================
   DASHBOARD API
========================================================= */

export const dashboardApi = {
  getStats: async () => {
    return request("/issues/dashboard", {
      method: "GET",
    });
  },
};
