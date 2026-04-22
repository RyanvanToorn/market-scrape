import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,

  use: {
    // Scraping context — no visual browser needed by default
    headless: true,
    // Throttle requests to be respectful to public sources
    launchOptions: {
      slowMo: 500,
    },
    // Capture traces on failure for debugging
    trace: "on-first-retry",
    // Extra headers to avoid bot-detection rejections
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
