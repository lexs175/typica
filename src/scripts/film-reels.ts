import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFilmReels(rootSelector = "#film-reels"): () => void {
  if (typeof window === "undefined") return () => {};

  const section = document.querySelector<HTMLElement>(rootSelector);
  if (!section) return () => {};

  const topTrack = section.querySelector<HTMLElement>("[data-reel-top]");
  const bottomTrack = section.querySelector<HTMLElement>("[data-reel-bottom]");

  if (!topTrack || !bottomTrack) return () => {};

  const topStage =
    section.querySelector<HTMLElement>(".film-reels_stage--top") || topTrack;
  const bottomStage =
    section.querySelector<HTMLElement>(".film-reels_stage--bottom") ||
    bottomTrack;

  const mm = gsap.matchMedia();

  mm.add(
    {
      all: "(min-width: 0px)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { reduce } = (ctx.conditions || {}) as { reduce?: boolean };
      if (reduce) return;

      ScrollTrigger.sort();

      // Desplazamiento proporcional a la pantalla (3.8 anchos de pantalla) para velocidad constante en móvil y desktop
      const getDistance = () => Math.round(window.innerWidth * 3.8);

      // 1. CINTA SUPERIOR:
      // En reposo NO se ve absolutamente nada (100% fuera de pantalla a la derecha, ni la puntita).
      // Activador: "60% bottom" -> cuando el 60% del contenedor entra al viewport, la cinta emerge desde afuera y recorre rápido hacia la izquierda.
      const topStart = () => window.innerWidth + 30;
      const topEnd = () => topStart() - getDistance();

      gsap.set(topTrack, { x: topStart() });

      gsap.fromTo(
        topTrack,
        { x: topStart },
        {
          x: topEnd,
          ease: "none",
          scrollTrigger: {
            trigger: topStage,
            start: "60% bottom",
            end: "bottom top",
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        }
      );

      // 2. CINTA INFERIOR:
      // En reposo NO se ve absolutamente nada (100% fuera de pantalla a la izquierda, ni la puntita).
      // Activador: "60% bottom" -> cuando el 60% del contenedor entra al viewport, la cinta emerge desde afuera y recorre rápido hacia la derecha.
      const bottomStart = () => -(bottomTrack.scrollWidth + 30);
      const bottomEnd = () => bottomStart() + getDistance();

      gsap.set(bottomTrack, { x: bottomStart() });

      gsap.fromTo(
        bottomTrack,
        { x: bottomStart },
        {
          x: bottomEnd,
          ease: "none",
          scrollTrigger: {
            trigger: bottomStage,
            start: "60% bottom",
            end: "bottom top",
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        }
      );
    }
  );

  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  return () => {
    mm.revert();
  };
}
