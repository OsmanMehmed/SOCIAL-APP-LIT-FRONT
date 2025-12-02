const API_BASE = (import.meta.env?.VITE_API_BASE as string | undefined) ?? "/api";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type RequestOptions = {
  method?: Method;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} on ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
