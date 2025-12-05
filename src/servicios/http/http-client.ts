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
  const token = sessionStorage.getItem("auth:token");
  if (token && !Object.prototype.hasOwnProperty.call(headers, "Authorization")) {
    headers["Authorization"] = token;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Usuario o contraseña incorrectos. Inténtalo de nuevo.");
    }
    if (response.status === 403) {
      throw new Error("No tienes permisos para realizar esta acción.");
    }

    let message = `HTTP ${response.status} on ${path}`;
    const text = await response.text();
    if (text) {
      message = text;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
