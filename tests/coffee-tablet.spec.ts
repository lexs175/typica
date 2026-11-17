import { test, expect } from "@playwright/test";

test("Capture Cafe en Bolsa on Tablet (834px) and Mobile (390px)", async ({ page }) => {
  // 1. Tablet Portrait Viewport (834x1194 - iPad Air)
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto("/", { waitUntil: "networkidle" });

  const cafesSection = page.locator("#cafes");
  await expect(cafesSection).toBeVisible();
  await cafesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Capture Tablet Cover (6 columns layout)
  const cover = page.locator(".coffee-cover_wrap");
  await cover.screenshot({
    path: "tests/tablet-coffee-cover-834.png",
  });

  // Capture Tablet Products Grid (2 columns)
  const products = page.locator(".coffee-products_grid");
  await products.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await products.screenshot({
    path: "tests/tablet-coffee-products-834.png",
  });

  // 2. Mobile Viewport (390x844 - iPhone)
  await page.setViewportSize({ width: 390, height: 844 });
  await cafesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await cover.screenshot({
    path: "tests/mobile-coffee-cover-390.png",
  });

  await products.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await products.screenshot({
    path: "tests/mobile-coffee-products-390.png",
  });
});
