import { test, expect } from "@playwright/test";

test("Verify Hero and Navbar implementation matching Figma 219:558", async ({ page }) => {
  // 1. Desktop 1920x1080 - Prueba de FOUC / Cronología estricta
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navegar e inspeccionar el estado inicial inmediato
  await page.goto("http://127.0.0.1:4321/", { waitUntil: "commit" });

  // A los 100ms: el video está expandiéndose (scale < 1) y el header y el botón DEBEN estar 100% invisibles
  await page.waitForTimeout(100);
  const earlyState = await page.evaluate(() => {
    const header = document.querySelector(".site-header_wrap");
    const btn = document.querySelector("#hero-floating-btn");
    const headerStyle = header ? window.getComputedStyle(header) : null;
    const btnStyle = btn ? window.getComputedStyle(btn) : null;
    return {
      headerOpacity: headerStyle?.opacity,
      headerVisibility: headerStyle?.visibility,
      btnOpacity: btnStyle?.opacity,
      btnVisibility: btnStyle?.visibility,
    };
  });

  await page.screenshot({ path: "tests/entrance-frame-100ms.png" });
  expect(earlyState.headerOpacity).toBe("0");
  expect(earlyState.headerVisibility).toBe("hidden");
  expect(earlyState.btnOpacity).toBe("0");
  expect(earlyState.btnVisibility).toBe("hidden");

  // A los 500ms: video a mitad de expansión, header y botón TODAVÍA invisibles
  await page.waitForTimeout(400);
  await page.screenshot({ path: "tests/entrance-frame-500ms.png" });

  // A los 2500ms: secuencia completamente terminada, todo visible en orden
  await page.waitForTimeout(2000);
  const settledState = await page.evaluate(() => {
    const header = document.querySelector(".site-header_wrap");
    const btn = document.querySelector("#hero-floating-btn");
    const headerStyle = header ? window.getComputedStyle(header) : null;
    const btnStyle = btn ? window.getComputedStyle(btn) : null;
    return {
      headerOpacity: headerStyle?.opacity,
      headerVisibility: headerStyle?.visibility,
      btnOpacity: btnStyle?.opacity,
      btnVisibility: btnStyle?.visibility,
    };
  });

  await page.screenshot({ path: "tests/01-hero-figma-1920.png" });
  expect(settledState.headerOpacity).toBe("1");
  expect(settledState.headerVisibility).toBe("visible");
  expect(settledState.btnOpacity).toBe("1");
  expect(settledState.btnVisibility).toBe("visible");

  // 1a. Mover mouse al área de video libre: el botón debe estar visible y seguir el cursor
  const copyRect = await page.evaluate(() => {
    const el = document.querySelector(".hero-red_copy");
    const r = el?.getBoundingClientRect();
    return { top: r?.top, bottom: r?.bottom, left: r?.left, right: r?.right };
  });
  console.log("COPY RECT:", copyRect);
  await page.mouse.move(1400, 400);
  await page.waitForTimeout(400);
  await page.screenshot({ path: "tests/01-hero-follower-moved-1920.png" });
  let btnVisible = await page.evaluate(() => {
    const btn = document.querySelector("#hero-floating-btn");
    return !btn?.classList.contains("is-hidden");
  });
  expect(btnVisible).toBe(true);

  // 1b. Entrar al texto desde ARRIBA (hacia el H1 / sticker): debe ocultarse inmediatamente
  await page.mouse.move(960, 780);
  await page.waitForTimeout(300);
  let isHiddenFromTop = await page.evaluate(() => {
    const btn = document.querySelector("#hero-floating-btn");
    return btn?.classList.contains("is-hidden");
  });
  expect(isHiddenFromTop).toBe(true);

  // 1c. Moverse al espacio libre a la IZQUIERDA: debe reaparecer
  await page.mouse.move(250, 450);
  await page.waitForTimeout(300);
  btnVisible = await page.evaluate(() => {
    const btn = document.querySelector("#hero-floating-btn");
    return !btn?.classList.contains("is-hidden");
  });
  expect(btnVisible).toBe(true);

  // 1d. Entrar al texto desde la IZQUIERDA (directo al H1): debe ocultarse
  await page.mouse.move(700, 750);
  await page.waitForTimeout(300);
  let isHiddenFromLeft = await page.evaluate(() => {
    const btn = document.querySelector("#hero-floating-btn");
    return btn?.classList.contains("is-hidden");
  });
  expect(isHiddenFromLeft).toBe(true);

  // 1e. Entrar al subtítulo desde ABAJO: debe ocultarse
  await page.mouse.move(960, 900);
  await page.waitForTimeout(300);
  let isHiddenFromBottom = await page.evaluate(() => {
    const btn = document.querySelector("#hero-floating-btn");
    return btn?.classList.contains("is-hidden");
  });
  expect(isHiddenFromBottom).toBe(true);

  // 1f. Regresar al espacio libre de la DERECHA: debe reaparecer suavemente con scale(1)
  await page.mouse.move(1350, 480);
  await page.waitForTimeout(400);
  btnVisible = await page.evaluate(() => {
    const btn = document.querySelector("#hero-floating-btn");
    return !btn?.classList.contains("is-hidden");
  });
  expect(btnVisible).toBe(true);

  // 2. Laptop 1440x900
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tests/01-hero-figma-1440.png" });

  // 2b. Laptop 1366x768
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tests/01-hero-figma-1366.png" });

  // 2c. Small desktop / tablet landscape 1024x768
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tests/01-hero-figma-1024.png" });

  // 3. Tablet 834x1194
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tests/01-hero-figma-834.png" });

  // 4. Mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tests/01-hero-figma-390.png" });
});
