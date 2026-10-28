import "@/scripts/motion";
(() => {
  "use strict";

  const stage = document.querySelector(".photo-fan_wrap");
  const cards = stage ? [...stage.querySelectorAll(".photo-fan_photo")] : [];
  if (!stage || cards.length !== 3 || !window.gsap || !window.ScrollTrigger)
    return;

  const G = window.gsap;
  G.registerPlugin(window.ScrollTrigger);

  // 1. CONFIGURACIÓN CENTRALIZADA: 3 cartas [izq, centro, der]
  const CONFIG = {
    deck: {
      rotations: [9, 0, -9], // Ángulos del mazo apilado
      xOffsets: [-10, 9, 0], // Desfase horizontal para desordenar el mazo
    },
    fan: {
      rotations: [-9, 0, 9], // Ángulos del abanico final
    },
  };

  const media = G.matchMedia();

  media.add(
    {
      all: "(min-width: 0px)",
      phone: "(max-width: 700px)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      if (context.conditions.reduce) return;

      const phone = context.conditions.phone;

      // Centro del contenedor para apilar las cartas
      const stackX = (i, card) =>
        stage.clientWidth / 2 -
        card.offsetLeft -
        card.offsetWidth / 2 +
        CONFIG.deck.xOffsets[i];

      const stackY = (_i, card) =>
        stage.clientHeight / 2 - card.offsetTop - card.offsetHeight / 2;

      const lift = () =>
        Math.min(innerHeight * (phone ? 0.12 : 0.21), phone ? 110 : 190);

      const sequence = G.timeline({
        scrollTrigger: {
          id: "typica-photo-fan",
          trigger: stage,
          start: "top bottom",
          end: "center 56%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      // FASE 1: Suben apiladas como mazo
      sequence
        .fromTo(
          cards,
          {
            x: stackX,
            y: (i, card) => stackY(i, card) + lift(),
            rotation: (i) => CONFIG.deck.rotations[i],
            scale: CONFIG.deck.scale,
          },
          {
            x: stackX,
            y: stackY,
            rotation: (i) => CONFIG.deck.rotations[i],
            scale: CONFIG.deck.scale,
            duration: 0.45,
            ease: "none",
          },
        )
        // FASE 2: Se abren en abanico a sus posiciones naturales
        .to(cards, {
          x: 0,
          y: 0,
          rotation: (i) => CONFIG.fan.rotations[i],
          scale: CONFIG.fan.scale,
          duration: 0.85,
          ease: "power2.inOut",
        });
    },
  );
})();
