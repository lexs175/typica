import { test, expect } from "@playwright/test";

test("verify Cartel component rendering in both sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  // 1. FilmReels section (black cartel with white border and tilt)
  const filmCartel = page.locator("#film-reels .cartel-plaque");
  await expect(filmCartel).toBeVisible();
  await filmCartel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const filmCenter = page.locator(".film-reels_center");
  await filmCenter.screenshot({ path: "tests/cartel-filmreels-verification.png" });
  await filmCartel.screenshot({ path: "tests/cartel-filmreels-badge.png" });

  // 2. MusicExperience section (red cartel with black border)
  const musicCartel = page.locator("#cultura-musica .cartel-plaque");
  await expect(musicCartel).toBeVisible();
  await musicCartel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const musicHeader = page.locator(".music-exp_header");
  await musicHeader.screenshot({ path: "tests/cartel-music-verification.png" });
});
