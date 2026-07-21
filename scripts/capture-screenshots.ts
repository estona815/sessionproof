import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium, type BrowserContext, type Page } from "@playwright/test";

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:4173";
const outputDirectory = path.resolve("output/playwright");

async function trackBrowserErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function captureLanding(context: BrowserContext, filename: string, fullPage: boolean) {
  const page = await context.newPage();
  const errors = await trackBrowserErrors(page);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Confirm the credits before the release." }).waitFor();
  await page.screenshot({ path: path.join(outputDirectory, filename), fullPage });
  await page.close();
  return errors;
}

async function captureWorkspace(context: BrowserContext, filename: string, fullPage: boolean) {
  const page = await context.newPage();
  const errors = await trackBrowserErrors(page);
  await page.goto(`${baseUrl}/demo`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Run Credit Agent" }).click();
  await page.getByRole("heading", { name: "Evidence inspector" }).waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(outputDirectory, filename), fullPage });
  await page.close();
  return errors;
}

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();
try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mobile = await browser.newContext({
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const errors = (
    await Promise.all([
      captureLanding(desktop, "landing-desktop.png", true),
      captureWorkspace(desktop, "workspace-desktop.png", false),
      captureLanding(mobile, "landing-mobile.png", true),
      captureWorkspace(mobile, "workspace-mobile.png", true),
    ])
  ).flat();
  await Promise.all([desktop.close(), mobile.close()]);
  if (errors.length > 0) throw new Error(`Browser console errors:\n${errors.join("\n")}`);
  console.log(`Captured four validated screenshots in ${outputDirectory}`);
} finally {
  await browser.close();
}
