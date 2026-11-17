import { test, expect, type Page } from "@playwright/test";

let errors: string[] = [];
test.beforeEach(({ page }) => {
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(() => expect(errors, "Browser runtime errors").toEqual([]));

async function ready(page: Page, route = "/") {
  const response = await page.goto(route, { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);
  await page.evaluate(async () => {
    await document.fonts.ready;
    document
      .querySelectorAll<HTMLImageElement>('img[loading="lazy"]')
      .forEach((image) => (image.loading = "eager"));
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => {})),
    );
  });
}

async function scrollHero(page: Page, progress: number) {
  await page.evaluate((progress) => {
    const trigger = (window as any).ScrollTrigger.getById(
      "typica-tv-expansion",
    );
    scrollTo(0, trigger.start + (trigger.end - trigger.start) * progress);
  }, progress);
}

for (const width of [1920, 768, 390, 320]) {
  test(`hero layout and reversible video expansion at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 980 });
    await ready(page);
    await page.waitForFunction(
      () => !!(window as any).ScrollTrigger?.getById("typica-tv-expansion"),
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(
      "Café de especialidad para amantes del café en Bolivia",
    );
    const layout = await page.evaluate(() => {
      const image =
        document.querySelector<HTMLImageElement>(".television_image")!;
      const box = image.getBoundingClientRect();
      const frame = document.querySelector<HTMLElement>("[data-television]")!;
      const content = document.querySelector<HTMLElement>(
        "[data-hero-content]",
      )!;
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        naturalRatio: image.naturalWidth / image.naturalHeight,
        ratio: box.width / box.height,
        centerError: Math.abs(
          box.left + box.width * 0.502066892 - innerWidth / 2,
        ),
        framePosition: getComputedStyle(frame).position,
        imagePosition: getComputedStyle(image).position,
        contentGap:
          frame.getBoundingClientRect().top -
          content.getBoundingClientRect().bottom,
      };
    });
    expect(layout.overflow).toBe(false);
    expect(layout.ratio).toBeCloseTo(layout.naturalRatio, 3);
    expect(layout.centerError).toBeLessThan(1);
    expect(layout.framePosition).toBe("relative");
    expect(layout.imagePosition).toBe("relative");
    expect(Math.abs(layout.contentGap)).toBeLessThan(1);
    await page.screenshot({ path: testInfo.outputPath("hero.png") });
    await scrollHero(page, 0.84);
    await expect(page.locator('[data-controls="hero"]')).toBeVisible();
    await expect
      .poll(() =>
        page.locator("[data-hero-video]").evaluate((video) => {
          const box = video.getBoundingClientRect();
          return (
            box.left <= 0 &&
            box.top <= 0 &&
            box.right >= innerWidth &&
            box.bottom >= innerHeight
          );
        }),
      )
      .toBe(true);
    await page.screenshot({ path: testInfo.outputPath("expanded.png") });
    await page.locator('[data-play="hero"]').click();
    await expect
      .poll(() =>
        page
          .locator("[data-hero-video]")
          .evaluate((video: HTMLVideoElement) => video.paused),
      )
      .toBe(true);
    await page.locator('[data-play="hero"]').click();
    await expect
      .poll(() =>
        page
          .locator("[data-hero-video]")
          .evaluate((video: HTMLVideoElement) => video.paused),
      )
      .toBe(false);
    await page
      .locator('[data-sound="hero"]')
      .click({ position: { x: 100, y: 200 } });
    await expect
      .poll(() =>
        page
          .locator("[data-hero-video]")
          .evaluate((video: HTMLVideoElement) => video.muted),
      )
      .toBe(false);
    await page.locator('[data-fullscreen="hero"]').click();
    await expect
      .poll(() => page.evaluate(() => !!document.fullscreenElement))
      .toBe(true);
    await page.evaluate(() => document.exitFullscreen());
    await page.evaluate(() => scrollTo(0, 0));
    await expect(page.locator('[data-controls="hero"]')).toBeHidden();
    await expect(page.locator("[data-hero-cta]")).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator("[data-hero-content]")
          .evaluate((element: HTMLElement) => element.inert),
      )
      .toBe(false);
  });
}

test("catalogue grid, product options and persistent cart", async ({
  page,
}, testInfo) => {
  await ready(page);
  await page.locator("[data-hero-cta]").click();
  await expect
    .poll(() =>
      page
        .locator("#cafes")
        .evaluate((section) => Math.abs(section.getBoundingClientRect().top)),
    )
    .toBeLessThan(4);
  const grid = await page
    .locator(".coffee-cover_layout")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        columns: style.gridTemplateColumns.split(" ").map(parseFloat),
        rows: style.gridTemplateRows.split(" ").map(parseFloat),
      };
    });
  expect(grid.columns).toHaveLength(7);
  expect(grid.rows).toHaveLength(3);
  expect(Math.abs(grid.columns[0] - grid.rows[0])).toBeLessThan(1);
  await expect(page.locator(".coffee-cover_photo-top span")).toHaveText("EN");
  await expect(page.locator(".coffee-showcase_rail-nav")).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath("catalogue.png") });
  await page.locator(".coffee-cover_arrow").click();
  const card = page.locator('[data-coffee="gesha"]');
  await card.locator(".coffee-product_quick-add").click();
  await card.locator('select[name="grind"]').selectOption("Molido para filtro");
  await card.locator('[data-quantity-step="1"]').click();
  await card.locator('button[type="submit"]').click();
  await page.locator("#cart-notice-open").click();
  await expect(page.locator("#cart-dialog")).toBeVisible();
  await expect(page.locator("#cart-items")).toContainText("Molido para filtro");
  await expect(page.locator("#cart-total")).toHaveText("Bs 290");
  await expect
    .poll(() =>
      page
        .locator("#cart-items img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.locator('[data-cart-step="1"]').click();
  await expect(page.locator("#cart-total")).toHaveText("Bs 435");
  await page.screenshot({ path: testInfo.outputPath("cart.png") });
  await page.keyboard.press("Escape");
  await expect(page.locator("#cart-dialog")).toBeHidden();
  await page.goto("/sucursales/");
  await expect(page.locator(".site-header_count")).toHaveText("3");
  await page.locator("#cart-toggle").click();
  await expect
    .poll(() =>
      page
        .locator("#cart-items img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.locator("[data-cart-remove]").click();
  await expect(page.locator("#cart-empty")).toBeVisible();
});

test("mobile navigation, location filters and subscription consultation", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await page.locator("#menu-toggle").click();
  await expect(page.locator("#menu")).toHaveAttribute("aria-hidden", "false");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-toggle")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await ready(page, "/sucursales/");
  await page.locator('[data-city-filter="la-paz"]').click();
  await expect(page.locator("[data-city]:visible")).toHaveCount(1);
  await expect(page.locator("[data-city]:visible")).toHaveAttribute(
    "data-city",
    "la-paz",
  );
  await page.locator('[data-city-filter="mas"]').click();
  await expect(page.locator("[data-city]:visible")).toHaveCount(4);
  await page.locator('[data-city-filter="all"]').click();
  await expect(page.locator("[data-city]:visible")).toHaveCount(7);
  await ready(page, "/suscripciones/");
  await page.locator("#subscription-coffee").selectOption("java");
  await page.locator("#subscription-quantity").selectOption("2");
  await page.locator("#subscription-frequency").selectOption("Cada mes");
  await page.locator("#subscription-grind").selectOption("Molido para prensa");
  await expect
    .poll(() =>
      page
        .locator("#subscription-pack")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await expect(page.locator("#subscription-summary")).toHaveText(
    "2 bolsas de Java, cada mes.",
  );
  await page
    .locator(
      '#subscription-form button[type="submit"], #subscription-form .button_wrap',
    )
    .first()
    .click();
  await expect(page.locator("#subscription-result")).toBeVisible();
  await expect(page.locator("#subscription-message")).toHaveValue(
    /2 bolsas de Java de 250 g, molido para prensa, cada mes/,
  );
  await page.screenshot({ path: testInfo.outputPath("subscription.png") });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("reduced motion and no-JavaScript fallback keep content usable", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator("[data-hero-tv]")).not.toHaveClass(/is-animated/);
  expect(
    await page
      .locator("[data-hero-video]")
      .evaluate((video: HTMLVideoElement) => video.controls),
  ).toBe(true);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await context.newPage();
  await fallback.goto(new URL("/", page.url()).href);
  await expect(fallback.locator("h1")).toBeVisible();
  await fallback.locator("[data-hero-cta]").click();
  await expect(fallback).toHaveURL(/#cafes$/);
  expect(
    await fallback.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  expect(
    await fallback
      .locator(".coffee-showcase_viewport")
      .evaluate((element) => getComputedStyle(element).overflowX),
  ).toBe("auto");
  await context.close();
});

test("culture video expands and its controls operate independently", async ({
  page,
}, testInfo) => {
  await ready(page);
  await page.evaluate(() => {
    const trigger = (window as any).ScrollTrigger.getById("typica-inline-film");
    scrollTo(0, trigger.start + (trigger.end - trigger.start) * 0.9);
  });
  await expect
    .poll(() =>
      page.locator("#typica-film").evaluate((video) => {
        const box = video.getBoundingClientRect();
        return box.width >= innerWidth - 2 && box.height >= innerHeight - 2;
      }),
    )
    .toBe(true);
  await expect(page.locator("#film-toggle")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("#typica-film")
        .evaluate((video: HTMLVideoElement) => video.paused),
    )
    .toBe(false);
  await page.locator("#film-toggle").click();
  await expect
    .poll(() =>
      page
        .locator("#typica-film")
        .evaluate((video: HTMLVideoElement) => video.paused),
    )
    .toBe(true);
  await page.locator("#film-toggle").click();
  await page.locator("#film-sound").click({ position: { x: 150, y: 250 } });
  await expect
    .poll(() =>
      page
        .locator("#typica-film")
        .evaluate((video: HTMLVideoElement) => video.muted),
    )
    .toBe(false);
  await page.screenshot({ path: testInfo.outputPath("culture-film.png") });
});
