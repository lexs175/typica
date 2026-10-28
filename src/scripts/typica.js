import "@/scripts/motion";
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const G = window.gsap,
    hasMotion = !!(G && window.ScrollTrigger);
  if (G) {
    const plugins = [
      window.ScrollTrigger,
      window.SplitText,
      window.Flip,
    ].filter(Boolean);
    G.registerPlugin(...plugins);
  }
  const animated = () => G && !reduced.matches;
  const video = $("#typica-film"),
    filmButton = $("#film-toggle");
  let filmLoaded = false,
    manualPaused = false;
  function loadFilm() {
    if (filmLoaded) return;
    filmLoaded = true;
    const source = video.querySelector("source");
    source.src = source.dataset.src;
    video.load();
  }
  function syncFilmButton() {
    filmButton.querySelector(".video-controls_label").textContent = video.paused
      ? "Reproducir vídeo"
      : "Pausar vídeo";
    filmButton.classList.toggle("is-playing", !video.paused);
    filmButton.setAttribute(
      "aria-label",
      video.paused ? "Reproducir vídeo de Typica" : "Pausar vídeo de Typica",
    );
    filmButton.title = video.paused ? "Reproducir vídeo" : "Pausar vídeo";
  }
  filmButton.addEventListener("click", () => {
    loadFilm();
    if (video.paused) {
      manualPaused = false;
      video.play().catch(() => {});
    } else {
      manualPaused = true;
      video.pause();
    }
  });
  video.addEventListener("play", syncFilmButton);
  video.addEventListener("pause", syncFilmButton);
  new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting && !reduced.matches && !manualPaused) {
          loadFilm();
          video.play().catch(() => {});
        } else video.pause();
      }),
    { threshold: 0.3 },
  ).observe(video);
  reduced.addEventListener("change", () => {
    if (reduced.matches) video.pause();
  });
  const filmFrame = $(".film-player_wrap"),
    soundButton = $("#film-sound"),
    soundSticker = soundButton.querySelector(".sound-toggle_sticker"),
    fullscreenButton = $("#film-fullscreen");
  function syncSound() {
    soundButton.classList.toggle("is-audible", !video.muted);
    soundButton.setAttribute("aria-pressed", String(!video.muted));
    soundButton.setAttribute(
      "aria-label",
      video.muted ? "Activar sonido" : "Silenciar vídeo",
    );
  }
  soundButton.addEventListener("click", () => {
    video.muted = !video.muted;
    syncSound();
    if (animated())
      G.fromTo(
        soundSticker,
        { rotation: -13, scale: 0.83 },
        {
          rotation: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          overwrite: "auto",
        },
      );
  });
  video.addEventListener("volumechange", syncSound);
  syncSound();
  const pointerMotion = G ? G.matchMedia() : null;
  pointerMotion?.add("(hover: hover) and (pointer: fine)", () => {
    filmFrame.classList.add("has-sound-cursor");
    G.set(soundSticker, { left: 0, top: 0, xPercent: -50, yPercent: -50 });
    const moveX = G.quickTo(soundSticker, "x", {
        duration: 0.32,
        ease: "power3.out",
      }),
      moveY = G.quickTo(soundSticker, "y", {
        duration: 0.32,
        ease: "power3.out",
      });
    const place = (x, y) => {
      const b = filmFrame.getBoundingClientRect(),
        pad = 60;
      const px = Math.max(pad, Math.min(b.width - pad, x)),
        py = Math.max(pad, Math.min(b.height - pad, y));
      if (reduced.matches) G.set(soundSticker, { x: px, y: py });
      else {
        moveX(px);
        moveY(py);
      }
    };
    const rest = () => {
      const b = filmFrame.getBoundingClientRect();
      place(b.width - 70, b.height - 70);
    };
    const move = (e) => {
      const b = filmFrame.getBoundingClientRect();
      place(e.clientX - b.left, e.clientY - b.top);
    };
    soundButton.addEventListener("pointermove", move);
    soundButton.addEventListener("pointerleave", rest);
    rest();
    const observer = new ResizeObserver(rest);
    observer.observe(filmFrame);
    return () => {
      observer.disconnect();
      soundButton.removeEventListener("pointermove", move);
      soundButton.removeEventListener("pointerleave", rest);
      filmFrame.classList.remove("has-sound-cursor");
      G.set(soundSticker, { clearProps: "left,top,transform" });
    };
  });
  fullscreenButton.hidden = !(
    document.fullscreenEnabled || video.webkitSupportsFullscreen
  );
  fullscreenButton.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (filmFrame.requestFullscreen) await filmFrame.requestFullscreen();
      else video.webkitEnterFullscreen?.();
    } catch (error) {
      console.warn("Pantalla completa no disponible:", error.message);
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const active = document.fullscreenElement === filmFrame;
    fullscreenButton.setAttribute(
      "aria-label",
      active ? "Salir de pantalla completa" : "Ver vídeo en pantalla completa",
    );
    fullscreenButton.title = active
      ? "Salir de pantalla completa"
      : "Pantalla completa";
  });
  async function initMotion() {
    await document.fonts.ready;
    if (!hasMotion) return;
    const mm = G.matchMedia();
    mm.add(
      {
        all: "(min-width: 0px)",
        desktop: "(min-width: 901px) and (min-height: 680px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions;
        if (reduce) return;
        if (desktop) document.body.classList.add("motion-ready");
        // The TV module owns the hero; this module animates the remaining page.
        G.from(".site-header_bar", {
          y: -24,
          opacity: 0,
          duration: 0.65,
          ease: "power4.out",
          clearProps: "transform,opacity",
        });
        const serifLine = $(".coffee-intro_serif-line");
        if (serifLine) {
          const handPaths = serifLine.querySelectorAll(".hand-path");
          handPaths.forEach((p) => {
            const len = p.getTotalLength();
            G.set(p, { strokeDasharray: len + 1, strokeDashoffset: len + 1 });
          });
          const lineTl = G.timeline({
            scrollTrigger: {
              trigger: serifLine,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          });
          lineTl.to(handPaths, {
            strokeDashoffset: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
          });
        }

        // Animación rápida y suavizada en out para los trazos SVG (Truus lines)
        $$(
          ".draw-path:not(.culture-film_subtitle-flourish .draw-path)",
        ).forEach((p) => {
          G.set(p, { strokeDasharray: "102 102", strokeDashoffset: 102 });
          G.to(p, {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                p.closest(
                  ".culture-story_wrap, .houses-section, .culture-story_photo, .culture-story_flourish-wrap, .oval-word",
                ) || p,
              start: "top 85%",
              toggleActions: "play reverse play reverse",
            },
          });
        });

        // Stickers apareciendo con escala y rebote suave
        $$(
          ".photo-fan_wrap .sticker, .poster-sticker, .film-player_sticker, .culture-story_photo>.sticker, .house-sticker",
        ).forEach((st) => {
          G.from(st, {
            scale: 0,
            opacity: 0,
            duration: 0.65,
            ease: "back.out(1.8)",
            scrollTrigger: {
              trigger: st,
              start: "top 88%",
              toggleActions: "play reverse play reverse",
            },
          });
        });
        $$(".house").forEach((el) =>
          G.from(el.querySelector(".house-photo"), {
            y: 70,
            scale: 1.08,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }),
        );

        ScrollTrigger.refresh();
        return () => {
          document.body.classList.remove("motion-ready");
        };
      },
    );
    $$('img[loading="lazy"]').forEach((img) =>
      img.addEventListener("load", () => ScrollTrigger.refresh(), {
        once: true,
      }),
    );
  }
  initMotion().catch((error) => {
    console.error("Typica motion:", error);
    document.body.classList.remove("motion-ready");
  });
})();
