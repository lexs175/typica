import "@/scripts/motion";
(() => {
  "use strict";
  const scene = document.querySelector("#film-story");
  if (!scene) return;
  const stage = scene.querySelector(".culture-film_stage");
  const frame = scene.querySelector(".film-player_wrap");
  const slot = scene.querySelector(".culture-film_mini-slot");
  const G = window.gsap,
    ST = window.ScrollTrigger;
  if (!G || !ST) return;
  G.registerPlugin(ST);

  document.fonts.ready.then(async () => {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    const media = G.matchMedia();
    media.add(
      {
        all: "(min-width:0px)",
        phone: "(max-width:700px)",
        reduce: "(prefers-reduced-motion:reduce)",
      },
      (context) => {
        const { reduce } = context.conditions;
        scene.classList.add("scene", reduce ? "is-rest" : "is-live");
        scene.dataset.scene = "inline-video";
        if (reduce) return () => scene.classList.remove("scene", "is-rest");

        scene.classList.add("culture-film_animating");

        const source = () => {
          const a = slot.getBoundingClientRect(),
            b = stage.getBoundingClientRect();
          const targetW = stage.clientWidth || window.innerWidth;
          const targetH = stage.clientHeight || window.innerHeight;
          return {
            x: a.left - b.left,
            y: a.top - b.top,
            scaleX: Math.max(0.01, a.width / targetW),
            scaleY: Math.max(0.01, a.height / targetH),
          };
        };

        // Initialize frame inside the mini-slot immediately with GPU transform matrix
        G.set(frame, {
          x: () => source().x,
          y: () => source().y,
          scaleX: () => source().scaleX,
          scaleY: () => source().scaleY,
          transformOrigin: "0 0",
          borderRadius: 12,
          force3D: true,
        });

        const controls = scene.querySelectorAll(
          ".video-controls_wrap, .sound-toggle_wrap, .film-player_sticker",
        );
        const flourishPath = scene.querySelector(
          ".culture-film_subtitle-flourish .draw-path",
        );
        if (flourishPath) {
          G.set(flourishPath, {
            strokeDasharray: "102 102",
            strokeDashoffset: 102,
          });
          G.to(flourishPath, {
            strokeDashoffset: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".culture-film_subtitle",
              start: "top 90%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        const timeline = G.timeline({
          scrollTrigger: {
            id: "typica-inline-film",
            trigger: scene,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        // 1. Initial resting hold so headline + mini video + rooster are presented cleanly
        timeline
          .to({}, { duration: 0.35 })
          // 2. Video expands smoothly from mini slot to full-bleed stage via GPU transform
          .fromTo(
            frame,
            {
              x: () => source().x,
              y: () => source().y,
              scaleX: () => source().scaleX,
              scaleY: () => source().scaleY,
              borderRadius: 12,
            },
            {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              borderRadius: 0,
              duration: 1,
              ease: "power2.inOut",
              force3D: true,
            },
            0.35,
          )
          // 3. Rooster sticker fades out
          .to(
            ".culture-film_rooster",
            { autoAlpha: 0, duration: 0.3, ease: "power2.in" },
            0.35,
          )
          // 4. Headline parts separate and fade
          .to(
            ".culture-film_title-start",
            { xPercent: -45, duration: 0.8, ease: "power2.inOut" },
            0.35,
          )
          .to(
            ".culture-film_title-end",
            { xPercent: 45, duration: 0.8, ease: "power2.inOut" },
            0.35,
          )
          .to(
            ".culture-film_title-start, .culture-film_title-end",
            { autoAlpha: 0, duration: 0.45, ease: "power2.in" },
            0.55,
          )
          .to(
            ".culture-film_subtitle",
            { y: 24, scale: 0.96, duration: 0.75, ease: "power2.inOut" },
            0.4,
          )
          .to(
            ".culture-film_subtitle",
            { autoAlpha: 0, duration: 0.45, ease: "power2.in" },
            0.58,
          )
          // 5. Cinema controls fade in
          .fromTo(
            controls,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25, ease: "power2.out" },
            1.1,
          )
          // 6. Hold at full screen for an immersive watching window
          .to({}, { duration: 0.65 });

        return () =>
          scene.classList.remove("culture-film_animating", "scene", "is-live");
      },
    );

    ST.refresh();
  });
})();
