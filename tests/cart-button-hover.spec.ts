import { test, expect } from "@playwright/test";

test("verify cart button is a Button variant and presses on hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:4322/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const cartButton = page.locator("#cart-toggle");
  await expect(cartButton).toBeVisible();

  // Verify it has the button_wrap and cart classes
  await expect(cartButton).toHaveClass(/button_wrap/);
  await expect(cartButton).toHaveClass(/cart/);

  const box = await cartButton.boundingBox();
  if (box) {
    await page.screenshot({
      path: "tests/cart-button-normal.png",
      clip: {
        x: box.x - 20,
        y: box.y - 20,
        width: box.width + 40,
        height: box.height + 40,
      },
    });
  }

  // Check initial styles
  const normalStyles = await cartButton.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      boxShadow: cs.boxShadow,
      transform: cs.transform,
      backgroundColor: cs.backgroundColor,
    };
  });
  console.log("Normal styles:", normalStyles);

  // Hover over the cart button
  await cartButton.hover();
  await page.waitForTimeout(300);

  if (box) {
    await page.screenshot({
      path: "tests/cart-button-hover.png",
      clip: {
        x: box.x - 20,
        y: box.y - 20,
        width: box.width + 40,
        height: box.height + 40,
      },
    });
  }

  const hoverStyles = await cartButton.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      boxShadow: cs.boxShadow,
      transform: cs.transform,
      backgroundColor: cs.backgroundColor,
    };
  });
  console.log("Hover styles:", hoverStyles);

  // Test data-tone="dark" (over light background sections)
  await page.evaluate(() => {
    document.querySelector("#nav")?.setAttribute("data-tone", "dark");
  });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(200);

  const darkToneNormalStyles = await cartButton.evaluate((el) => {
    return window.getComputedStyle(el).boxShadow;
  });
  console.log("Dark tone normal shadow:", darkToneNormalStyles);
  expect(darkToneNormalStyles).toContain("rgb(0, 0, 0)");

  await cartButton.hover();
  await page.waitForTimeout(200);
  const darkToneHoverStyles = await cartButton.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return { boxShadow: cs.boxShadow, transform: cs.transform };
  });
  console.log("Dark tone hover styles:", darkToneHoverStyles);
  expect(darkToneHoverStyles.transform).toContain("matrix(1, 0, 0, 1, -4, 4)");
  expect(darkToneHoverStyles.boxShadow).toMatch(/(none|rgba\(0, 0, 0, 0\))/);
});
