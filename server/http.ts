// Framework-neutral routing layer. The route modules only depend on the tiny
// request/response surface defined here, so the exact same handlers run:
//   - under Express (local Node process + supertest tests, via toExpress), and
//   - inside the edge runtime (production), via dispatchFetch.
import type { UserRecord } from "./collections.js";

export interface CookieOptions {
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  maxAge?: number; // milliseconds (Express convention)
  path?: string;
}

export interface Request {
  body: unknown;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Record<string, string | string[] | undefined>;
  cookies: Record<string, string>;
  ndhUser?: UserRecord;
}

export interface Response {
  status(code: number): Response;
  json(body: unknown): Response;
  /**
   * Terminate with no body — used for 204 responses. Express provides this
   * natively; the edge adapter needs it too, otherwise `res.status(204).end()`
   * throws when the same routes are served via dispatchFetch.
   */
  end(): Response;
  cookie(name: string, value: string, options?: CookieOptions): Response;
  clearCookie(name: string, options?: CookieOptions): Response;
}

export type NextFunction = (err?: unknown) => void;
export type Handler = (req: Request, res: Response, next: NextFunction) => unknown;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
interface RouteDef {
  method: Method;
  path: string;
  handlers: Handler[];
}

export class MiniRouter {
  routes: RouteDef[] = [];
  private add(method: Method, path: string, handlers: Handler[]) {
    this.routes.push({ method, path, handlers });
    return this;
  }
  get(path: string, ...h: Handler[]) {
    return this.add("GET", path, h);
  }
  post(path: string, ...h: Handler[]) {
    return this.add("POST", path, h);
  }
  put(path: string, ...h: Handler[]) {
    return this.add("PUT", path, h);
  }
  patch(path: string, ...h: Handler[]) {
    return this.add("PATCH", path, h);
  }
  delete(path: string, ...h: Handler[]) {
    return this.add("DELETE", path, h);
  }
}

export function Router() {
  return new MiniRouter();
}

/** Runs a handler chain with Express-style next() semantics. */
async function runChain(handlers: Handler[], req: Request, res: Response) {
  let index = 0;
  const next = async (err?: unknown): Promise<void> => {
    if (err) throw err;
    const handler = handlers[index++];
    if (!handler) return;
    let nextCalled: Promise<void> | undefined;
    await handler(req, res, (e?: unknown) => {
      nextCalled = next(e);
    });
    if (nextCalled) await nextCalled;
  };
  await next();
}

/** Mounts a MiniRouter onto an Express app (used by the Node server + tests). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mountOnExpress(app: any, prefix: string, router: MiniRouter) {
  for (const route of router.routes) {
    const fullPath = prefix + (route.path === "/" ? "" : route.path) || "/";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app[route.method.toLowerCase()](fullPath, async (req: any, res: any, next: any) => {
      try {
        await runChain(route.handlers, req as Request, res as Response);
      } catch (e) {
        next(e);
      }
    });
  }
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const p = pattern.split("/").filter(Boolean);
  const s = pathname.split("/").filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    const seg = p[i]!;
    const val = s[i]!;
    if (seg.startsWith(":")) params[seg.slice(1)] = decodeURIComponent(val);
    else if (seg !== val) return null;
  }
  return params;
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function serializeCookie(name: string, value: string, o: CookieOptions = {}) {
  let c = `${name}=${encodeURIComponent(value)}; Path=${o.path ?? "/"}`;
  if (o.maxAge !== undefined) c += `; Max-Age=${Math.floor(o.maxAge / 1000)}`;
  if (o.httpOnly) c += "; HttpOnly";
  if (o.secure) c += "; Secure";
  if (o.sameSite) c += `; SameSite=${o.sameSite[0]!.toUpperCase()}${o.sameSite.slice(1)}`;
  return c;
}

export interface Mount {
  prefix: string;
  router: MiniRouter;
  /** When true the handler receives the raw body as a Buffer (webhooks). */
  rawBody?: boolean;
}

/** Dispatches a Fetch API Request through the mounted routers. */
export async function dispatchFetch(request: globalThis.Request, mounts: Mount[]) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase() as Method;

  for (const mount of mounts) {
    if (url.pathname !== mount.prefix && !url.pathname.startsWith(mount.prefix + "/")) continue;
    const sub = url.pathname.slice(mount.prefix.length) || "/";
    for (const route of mount.router.routes) {
      if (route.method !== method) continue;
      const params = matchPath(route.path, sub);
      if (!params) continue;

      let body: unknown = {};
      if (method !== "GET" && method !== "DELETE") {
        if (mount.rawBody) {
          body = Buffer.from(await request.arrayBuffer());
        } else {
          const text = await request.text();
          if (text) {
            try {
              body = JSON.parse(text);
            } catch {
              return Response.json({ error: "Invalid JSON body." }, { status: 400 });
            }
          }
        }
      }

      const headers: Record<string, string> = {};
      request.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));

      const req: Request = {
        body,
        params,
        query: Object.fromEntries(url.searchParams.entries()),
        headers,
        cookies: parseCookies(request.headers.get("cookie")),
      };

      let statusCode = 200;
      let payload: unknown = undefined;
      const setCookies: string[] = [];
      const res: Response = {
        status(code) {
          statusCode = code;
          return res;
        },
        json(b) {
          payload = b;
          return res;
        },
        end() {
          // Deliberately leaves `payload` as undefined so the Response is built
          // with a null body, which is what a 204 requires.
          return res;
        },
        cookie(name, value, options) {
          setCookies.push(serializeCookie(name, value, options));
          return res;
        },
        clearCookie(name, options) {
          setCookies.push(serializeCookie(name, "", { ...options, maxAge: 0 }));
          return res;
        },
      };

      await runChain(route.handlers, req, res);

      const out = new Headers({ "content-type": "application/json" });
      for (const c of setCookies) out.append("set-cookie", c);
      return new Response(payload === undefined ? null : JSON.stringify(payload), {
        status: statusCode,
        headers: out,
      });
    }
  }
  return Response.json({ error: "Not found" }, { status: 404 });
}
