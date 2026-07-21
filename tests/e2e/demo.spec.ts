import { expect, test } from "@playwright/test";

test("runs the guided demo and exposes evidence-linked outputs", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Confirm the credits before the release." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Run Guided Demo" }).first().click();
  await expect(page.getByRole("heading", { name: "GLASS CITY source inventory" })).toBeVisible();
  await page.getByRole("button", { name: "Run Credit Agent" }).click();
  await expect(page.getByText("Composition split totals 110%").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence inspector" })).toBeVisible();
  await expect(page.getByText("18/100").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Release credit pack/ })).toBeVisible();
});

test("trust and confirmation fixture are readable", async ({ page }) => {
  await page.goto("/trust");
  await expect(
    page.getByRole("heading", { name: "Original sources stay authoritative." }),
  ).toBeVisible();
  await page.goto("/confirm/demo-lena");
  await expect(page.getByRole("heading", { name: "Review your GLASS CITY credit." })).toBeVisible();
});
