import { test, expect } from "@playwright/test";

test("Verify stickers in HeroRed and FilmReels across viewports", async ({ page }) => {
  const viewports = [
    { name: "1920", width: 1920, height: 1080 },
    { name: "1024", width: 1024, height: 768 },
    { name: "834", width: 834, height: 1194 },
    { name: "390", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/", { waitUntil: "networkidle" });

    // Hero Red
    const heroRed = page.locator("#inicio");
    await expect(heroRed).toBeVisible();
    await heroRed.screenshot({
      path: `tests/sticker-hero-${vp.name}.png`,
    });

    // Film Reels
    const filmReels = page.locator("#film-reels");
    await expect(filmReels).toBeVisible();
    await filmReels.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await filmReels.screenshot({
      path: `tests/sticker-filmreels-${vp.name}.png`,
    });
  }
});
