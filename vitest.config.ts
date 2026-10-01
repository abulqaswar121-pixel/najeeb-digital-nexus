import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Deliberately separate from vite.config.ts: the main config is wrapped by
// @lovable.dev/vite-tanstack-config (TanStack Start SSR/router codegen),
// which isn't a plain Vite config object and isn't a safe place to bolt on
// Vitest's `test` block. This file is only used by `npm run test`.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/data/**"],
    },
  },
});
