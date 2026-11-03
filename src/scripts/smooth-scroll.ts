import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./motion";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export function initSmoothScroll(): Lenis | undefined {
  if (typeof window === "undefined") return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (window.lenis) {
    return window.lenis;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  window.lenis = lenis;

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame to GSAP's ticker
  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000);
  });

  // Disable lag smoothing in GSAP to avoid jumps
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initSmoothScroll());
  } else {
    initSmoothScroll();
  }
}
