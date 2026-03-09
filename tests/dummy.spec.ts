import { test, expect } from "@playwright/test";

test("dummy test - check page title", async ({ page }) => {
  // Navigate to example.com
  await page.goto("https://example.com");

  // Check that the page has the expected title
  await expect(page).toHaveTitle(/example/i);
});

test("dummy test - verify heading exists", async ({ page }) => {
  // Navigate to example.com
  await page.goto("https://example.com");

  // Check that the h1 heading exists
  const heading = page.locator("h1");
  await expect(heading).toBeVisible();
});
