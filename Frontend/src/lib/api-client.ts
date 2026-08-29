const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`,
    );
  }

  return data;
}

export const authApi = {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: "citizen" | "authority" | "admin";
  }) =>
    request<{
      success: boolean;
      message: string;
      user: any;
    }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{
      success: boolean;
      message: string;
      user: any;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () =>
    request<{
      success: boolean;
      user: any;
    }>("/auth/me"),

  logout: () =>
    request<{
      success: boolean;
      message: string;
    }>("/auth/logout", {
      method: "POST",
    }),
};
