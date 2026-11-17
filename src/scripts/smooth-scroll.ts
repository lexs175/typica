import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./motion";

let instance: Lenis | undefined;
let userHasInteracted = false;

if (typeof window !== "undefined") {
  const markInteracted = () => {
    userHasInteracted = true;
  };
  window.addEventListener("wheel", markInteracted, { once: true, passive: true });
  window.addEventListener("touchstart", markInteracted, { once: true, passive: true });
  window.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", " "].includes(e.key)) {
      userHasInteracted = true;
    }
  }, { passive: true });
}

export function initSmoothScroll(): Lenis | undefined {
  if (typeof window === "undefined") return;

  if (!userHasInteracted) {
    window.scrollTo(0, 0);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (instance) {
    return instance;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  instance = lenis;
  (window as any).lenisInstance = lenis;

  if (!userHasInteracted) {
    lenis.scrollTo(0, { immediate: true, force: true });
  }

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame to GSAP's ticker
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });

  // Activar lag smoothing en GSAP para absorber micro-caídas de FPS y evitar tirones secos
  gsap.ticker.lagSmoothing(500, 33);

  window.addEventListener("load", () => {
    if (!userHasInteracted) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    ScrollTrigger.refresh();
  });

  return lenis;
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initSmoothScroll());
  } else {
    initSmoothScroll();
  }
}
