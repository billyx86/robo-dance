import { defineConfig } from "vitest/config";

// The lib/ modules are pure (no DOM, no canvas, no localStorage), so the
// default "node" environment is enough — no jsdom needed.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
  },
});
