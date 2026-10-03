// Edge entry for the API: hydrate data from the managed database, run the
// shared routes, then save whatever the request changed.
import { dispatchFetch } from "./http.js";
import { MOUNTS } from "./routes.js";
import { hydrateAll, flushAll } from "./db.js";
import { supabaseAdmin } from "../src/integrations/supabase/client.server.js";

let queue: Promise<unknown> = Promise.resolve();

export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/api/health") {
    return Response.json({ ok: true, service: "ndh-agency-api" });
  }
  // Serialize requests within this instance so shared in-memory state is
  // never interleaved between hydrate and flush.
  const run = async () => {
    try {
      await hydrateAll(supabaseAdmin);
      const response = await dispatchFetch(request, MOUNTS);
      await flushAll(supabaseAdmin);
      return response;
    } catch (err) {
      console.error("[ndh-api] Unhandled error:", err);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  };
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}
