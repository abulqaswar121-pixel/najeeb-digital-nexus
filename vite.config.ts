import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
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
