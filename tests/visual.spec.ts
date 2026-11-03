import { test, expect } from "@playwright/test";

test("capture visual verification screenshots", async ({ page }, testInfo) => {
  for (const width of [1920, 1440, 1024, 375]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 750 });
    await page.goto("/", { waitUntil: "networkidle" });
    const res = await page.evaluate(() => {
      const layout = document.querySelector(".coffee-cover_layout");
      const c = document.querySelector(".coffee-letter_wrap");
      const arrow = document.querySelector(".coffee-cover_arrow");
      const barista = document.querySelector(".coffee-cover_photo-tall");
      const computed = window.getComputedStyle(layout!);
      return {
        aspectRatio: computed.aspectRatio,
        computedHeight: computed.height,
        computedWidth: computed.width,
        gridTemplateRows: computed.gridTemplateRows,
        gridTemplateColumns: computed.gridTemplateColumns,
        cBox: c?.getBoundingClientRect(),
        arrowBox: arrow?.getBoundingClientRect(),
        baristaBox: barista?.getBoundingClientRect(),
        layoutBox: layout?.getBoundingClientRect(),
      };
    });
    console.log("WIDTH " + width + ":", JSON.stringify(res, null, 2));

    const lenisExists = await page.evaluate(() => typeof (window as any).lenis === "object" && (window as any).lenis !== null);
    expect(lenisExists).toBe(true);

    const coffeeCover = page.locator(".coffee-cover_wrap");
    await page.evaluate(() => {
      const section = document.querySelector("#cafes");
      const trigger = (window as any).ScrollTrigger?.getAll().find(
        (item: any) => item.trigger === section,
      );
      window.scrollTo(
        0,
        trigger ? trigger.start : section!.getBoundingClientRect().top + scrollY,
      );
    });
    await page.waitForTimeout(600);
    await coffeeCover.screenshot({
      path: `C:/Users/Lex/.gemini/antigravity/brain/d4d9a034-65b7-442c-ad12-2515d00fbdc9/coffee-cover-${width}.png`,
    });
  }
});
