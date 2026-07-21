import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium, type Page } from "@playwright/test";

const baseUrl = process.env.VIDEO_BASE_URL ?? "http://localhost:4173";
const outputDirectory = path.resolve("output/video");
const outputPath = path.join(outputDirectory, "sessionproof-local-fixture-demo.webm");

const errors: string[] = [];

async function caption(page: Page, text: string) {
  await page.evaluate((nextText) => {
    const existing = document.querySelector("[data-video-caption]");
    if (existing) existing.remove();

    const element = document.createElement("div");
    element.dataset.videoCaption = "true";
    element.textContent = nextText;
    Object.assign(element.style, {
      background: "rgba(5, 10, 20, 0.94)",
      border: "1px solid rgba(141, 255, 196, 0.72)",
      borderRadius: "12px",
      bottom: "22px",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
      color: "#f7fbff",
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      fontWeight: "700",
      left: "50%",
      lineHeight: "1.35",
      maxWidth: "1060px",
      padding: "14px 20px",
      position: "fixed",
      textAlign: "center",
      transform: "translateX(-50%)",
      width: "calc(100% - 80px)",
      zIndex: "2147483647",
    });
    document.body.append(element);
  }, text);
}

async function hold(page: Page, text: string, milliseconds: number) {
  await caption(page, text);
  await page.waitForTimeout(milliseconds);
}

async function navigate(page: Page, pathname: string) {
  await page.goto(`${baseUrl}${pathname}`, { waitUntil: "domcontentloaded" });
}

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  recordVideo: { dir: outputDirectory, size: { width: 1280, height: 720 } },
  viewport: { width: 1280, height: 720 },
});
const page = await context.newPage();
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

const video = page.video();
if (!video) throw new Error("Playwright video recording did not start.");

try {
  await navigate(page, "/");
  await page.getByRole("heading", { name: "Confirm the credits before the release." }).waitFor();
  await hold(
    page,
    "SESSIONPROOF turns scattered music-credit records into an evidence-linked review before release.",
    6_000,
  );

  await page.getByRole("heading", { name: "How it works" }).scrollIntoViewIfNeeded();
  await hold(
    page,
    "The workflow keeps source evidence, AI candidate extraction, deterministic rules, human review, and export separate.",
    6_000,
  );

  await navigate(page, "/demo");
  await page.getByRole("heading", { name: "GLASS CITY source inventory" }).waitFor();
  await hold(
    page,
    "This public GLASS CITY demo uses seven fictional files. Fixture mode makes zero Gemini calls.",
    7_000,
  );

  await page.getByRole("button", { name: "Run Credit Agent" }).click();
  await page.getByRole("heading", { name: "Evidence inspector" }).waitFor();
  await hold(
    page,
    "The local agent creates 25 supported claims and flags 12 unresolved conflicts. Readiness is 18/100: BLOCKED.",
    8_000,
  );

  await page.getByText("Composition split totals 110%").first().click();
  await page.getByRole("heading", { name: "Evidence inspector" }).scrollIntoViewIfNeeded();
  await hold(
    page,
    "Deterministic code detects the 110% composition total. The inspector preserves the file, lines, exact quote, confidence, and rule.",
    9_000,
  );

  await page.getByText("Contributor ledger (5)").scrollIntoViewIfNeeded();
  await hold(
    page,
    "Composition and master ownership remain separate. The system never invents missing shares or decides ownership.",
    7_000,
  );

  await page.getByRole("heading", { name: "Agent trace" }).scrollIntoViewIfNeeded();
  await hold(
    page,
    "The trace records tool steps, rule version, readiness output, and the truthful fixture backend: Gemini calls 0.",
    7_000,
  );

  await page.getByRole("heading", { name: "Clarification questions" }).scrollIntoViewIfNeeded();
  await hold(
    page,
    "The agent asks focused clarification questions and exports the ledger, claims, conflicts, evidence bundle, and PDF review pack.",
    8_000,
  );

  await navigate(page, "/confirm/demo-lena");
  await page.getByRole("heading", { name: "Review your GLASS CITY credit." }).waitFor();
  await hold(
    page,
    "A contributor sees only their proposed credit. An acknowledgement is recorded as workflow evidence, not a legal signature.",
    7_000,
  );

  await navigate(page, "/trust");
  await page.getByRole("heading", { name: "Original sources stay authoritative." }).waitFor();
  await hold(
    page,
    "Production design keeps uploads private, rejects unsupported claims, and leaves samples and legal clearance to humans.",
    7_000,
  );

  await navigate(page, "/operator");
  await page.getByRole("heading", { name: "Operator dashboard" }).waitFor();
  await hold(
    page,
    "Current business evidence is honest: 0 real users, 0 paid customers, $0 revenue, and 0 production Gemini calls.",
    8_000,
  );

  await navigate(page, "/");
  await page.getByRole("heading", { name: "Confirm the credits before the release." }).waitFor();
  await hold(
    page,
    "Local fixture demo complete. Google Cloud deployment, live Gemini evidence, users, and revenue remain unverified.",
    6_000,
  );
} finally {
  await context.close();
  await video.saveAs(outputPath);
  await browser.close();
}

if (errors.length > 0) throw new Error(`Browser errors during capture:\n${errors.join("\n")}`);
console.log(`Captured truthful local fixture demo at ${outputPath}`);
