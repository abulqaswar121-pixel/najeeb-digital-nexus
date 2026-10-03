// Thin fetch wrapper for talking to the real backend (server/index.ts). All
// requests go to same-origin `/api/*` (proxied to the API process by Vite in
// dev, and by whatever reverse proxy sits in front of this app in
// production) and always send cookies, since auth is a signed httpOnly
// session cookie, never a token the client manages itself.

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore unparseable error body
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", ...(body ? { body: JSON.stringify(body) } : {}) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", ...(body ? { body: JSON.stringify(body) } : {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", ...(body ? { body: JSON.stringify(body) } : {}) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
