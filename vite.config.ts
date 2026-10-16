import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Load all env vars into process.env for server-side code (server routes and
// server functions). Client code still only sees VITE_-prefixed vars; these
// are never added to the client bundle.
const serverEnv = loadEnv(process.env["NODE_ENV"] || "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        // Pin entities to the hoisted v4.5.0 copy; a nested v7 breaks SSR.
        "entities/lib/decode.js": path.resolve(__dirname, "node_modules/entities/lib/decode.js"),
        "entities/lib/encode.js": path.resolve(__dirname, "node_modules/entities/lib/encode.js"),
        entities: path.resolve(__dirname, "node_modules/entities"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: true,
      proxy: {
        // The real backend API (server/index.ts) runs as a separate Node
        // process on this port in dev. The browser never talks to it
        // directly -- it only ever calls same-origin `/api/*`, which Vite's
        // dev server proxies here. In production this app would need an
        // equivalent reverse-proxy rule pointing at wherever the API process
        // is deployed.
        "/api": {
          target: "http://localhost:8787",
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:8787",
          changeOrigin: true,
        },
      },
    },
  },
});
