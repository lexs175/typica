import { test, expect } from "@playwright/test";

test("Capture Redesigned Home page sections at 1920 width", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/", { waitUntil: "networkidle" });

  // 1. Red Hero
  const heroRed = page.locator("#inicio");
  await expect(heroRed).toBeVisible();
  await heroRed.screenshot({
    path: "tests/01-hero-red-1920.png",
  });

  // 2. Film Reels (Cintas 35mm + Placa negra SE DISFRUTA)
  const filmReels = page.locator("#film-reels");
  await expect(filmReels).toBeVisible();
  await filmReels.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await filmReels.screenshot({
    path: "tests/02-film-reels-1920.png",
  });

  // 3. Café en Bolsa (Horizontal showcase)
  const cafes = page.locator("#cafes");
  await expect(cafes).toBeVisible();
  await cafes.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await cafes.screenshot({
    path: "tests/03-coffee-showcase-1920.png",
  });

  // 4. Menú Tabbed Section
  const menu = page.locator("#carta-menu");
  await expect(menu).toBeVisible();
  await menu.scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("#carta-menu img"));
    await Promise.all(
      images.map((img) => {
        img.loading = "eager";
        return img.complete ? Promise.resolve() : img.decode().catch(() => {});
      })
    );
  });
  await page.waitForTimeout(600);
  await menu.screenshot({
    path: "tests/04-menu-tabs-1920.png",
  });

  // Test 3D flip hover on letters
  const letterM = page.locator('.menu-letter_wrap[aria-label="Girar letra M"]');
  await letterM.hover();
  await page.waitForTimeout(500);
  await menu.screenshot({
    path: "tests/04-menu-tabs-flipped.png",
  });

  // Test interactive tab clicking
  const brunchTab = page.locator('[data-menu-tab="brunch"]');
  await brunchTab.click();
  await expect(page.locator('#panel-brunch')).toBeVisible();
  await expect(page.locator('#panel-espresso')).toBeHidden();

  const sandwichesTab = page.locator('[data-menu-tab="sandwiches"]');
  await sandwichesTab.click();
  await expect(page.locator('#panel-sandwiches')).toBeVisible();

  const espressoTab = page.locator('[data-menu-tab="espresso"]');
  await espressoTab.click();
  await expect(page.locator('#panel-espresso')).toBeVisible();

  // Test mobile view of menu
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    const el = document.getElementById("carta-menu");
    if (el) {
      el.scrollIntoView({ block: "start" });
      window.scrollBy(0, -90);
    }
  });
  await page.waitForTimeout(400);
  await menu.screenshot({
    path: "tests/04-menu-tabs-390.png",
  });
  await page.setViewportSize({ width: 1920, height: 1080 });

  // 5. Música y Arte (Un buen café se disfruta)
  const music = page.locator("#cultura-musica");
  await expect(music).toBeVisible();
  await music.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await music.screenshot({
    path: "tests/05-music-experience-1920.png",
  });

  // 5b. Vista de Transición: cinta inferior superpuesta a Las Casas
  const bottomTape = page.locator(".music-tape_stage--bottom");
  await bottomTape.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: "tests/05b-bottom-tape-transition.png",
  });

  // 6. Las Casas (Fila horizontal de 13 tarjetas)
  const casas = page.locator("#casas");
  await expect(casas).toBeVisible();
  await casas.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await casas.screenshot({
    path: "tests/06-las-casas-1920.png",
  });
});
