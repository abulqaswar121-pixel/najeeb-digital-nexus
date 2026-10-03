import { createFileRoute } from "@tanstack/react-router";

async function handle({ request }: { request: Request }) {
  (globalThis as { __ndhStorage?: string }).__ndhStorage = "cloud";
  const { handleApiRequest } = await import("../../../server/fetchApp");
  return handleApiRequest(request);
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: { GET: handle, POST: handle, PUT: handle, PATCH: handle, DELETE: handle },
  },
});
