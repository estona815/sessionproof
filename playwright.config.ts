import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3107",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm exec next dev -p 3107",
    env: {
      AI_MODE: "fixture",
      APP_MODE: "demo",
      APP_ORIGIN: "http://127.0.0.1:3107",
    },
    url: "http://127.0.0.1:3107/api/health",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
