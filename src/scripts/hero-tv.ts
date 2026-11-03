import { gsap, ScrollTrigger } from "./motion";

export function initHeroTv() {
  const scene = document.querySelector<HTMLElement>("[data-hero-tv]");
  if (!scene) return;
  const stage = scene.querySelector<HTMLElement>("[data-hero-stage]")!;
  const content = scene.querySelector<HTMLElement>("[data-hero-content]")!;
  const frame = scene.querySelector<HTMLElement>("[data-television]")!;
  const video = scene.querySelector<HTMLVideoElement>("[data-hero-video]")!;
  const controls = scene.querySelector<HTMLElement>('[data-controls="hero"]')!;
  const play = scene.querySelector<HTMLButtonElement>('[data-play="hero"]')!;
  const sound = scene.querySelector<HTMLButtonElement>('[data-sound="hero"]')!;
  const fullscreen = scene.querySelector<HTMLButtonElement>(
    '[data-fullscreen="hero"]',
  )!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;
  let source = { x: 0, y: 0, width: 1, height: 1 };
  let timeline: gsap.core.Timeline | null = null;
  function measure() {
    scene!.style.setProperty("--hero-stage-height", stage.offsetHeight + "px");
    stage.style.setProperty(
      "--hero-sticky-top",
      Math.min(0, innerHeight - stage.offsetHeight) + "px",
    );
    const saved = {
      x: gsap.getProperty(frame, "x"),
      y: gsap.getProperty(frame, "y"),
      scale: gsap.getProperty(frame, "scale"),
    };
    gsap.set(frame, { x: 0, y: 0, scale: 1 });
    const rect = frame.getBoundingClientRect(),
      screen = video.getBoundingClientRect(),
      view = stage.getBoundingClientRect();
    const x = screen.left + screen.width / 2;
    const y = screen.top + screen.height / 2;
    gsap.set(frame, {
      transformOrigin: `${x - rect.left}px ${y - rect.top}px`,
      ...saved,
    });
    source = {
      x: x - view.left,
      y: y - view.top,
      width: screen.width,
      height: screen.height,
    };
  }
  function target() {
    const height = Math.min(innerHeight, stage.offsetHeight);
    return {
      x: stage.offsetWidth / 2 - source.x,
      y: stage.offsetHeight - height / 2 - source.y,
      scale:
        Math.max(stage.offsetWidth / source.width, height / source.height) *
        1.1,
    };
  }
  function expanded(value: boolean) {
    controls.hidden = !value;
    sound.hidden = !value;
  }
  function sync() {
    play.classList.toggle("is-playing", !video.paused);
    play.setAttribute(
      "aria-label",
      video.paused ? "Reproducir vídeo" : "Pausar vídeo",
    );
    sound.classList.toggle("is-audible", !video.muted);
    sound.setAttribute(
      "aria-label",
      video.muted ? "Activar sonido" : "Silenciar vídeo",
    );
    sound.setAttribute("aria-pressed", String(!video.muted));
  }
  play.addEventListener("click", () => {
    paused = !video.paused;
    if (paused) video.pause();
    else void video.play().catch(() => {});
  });
  sound.addEventListener("click", () => {
    video.muted = !video.muted;
    sync();
  });
  ["play", "pause", "volumechange"].forEach((event) =>
    video.addEventListener(event, sync),
  );
  fullscreen.addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await stage.requestFullscreen?.();
  });
  document.addEventListener("fullscreenchange", () => {
    measure();
    if (document.fullscreenElement === stage) {
      timeline?.scrollTrigger?.disable(false);
      gsap.set(frame, target());
      expanded(true);
    } else {
      timeline?.scrollTrigger?.enable();
      ScrollTrigger.refresh();
    }
  });
  new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !paused && !reduce.matches)
        void video.play().catch(() => {});
      else if (!entries[0].isIntersecting) video.pause();
    },
    { threshold: 0.15 },
  ).observe(stage);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
  });
  expanded(false);
  sync();
  void document.fonts.ready.then(() => {
    const media = gsap.matchMedia();
    const soundSticker = sound.querySelector<HTMLElement>(".sound-toggle_sticker");
    if (soundSticker) {
      media.add("(hover: hover) and (pointer: fine)", () => {
        stage.classList.add("has-sound-cursor");
        gsap.set(soundSticker, { left: 0, top: 0, xPercent: -50, yPercent: -50 });
        const moveX = gsap.quickTo(soundSticker, "x", { duration: 0.32, ease: "power3.out" });
        const moveY = gsap.quickTo(soundSticker, "y", { duration: 0.32, ease: "power3.out" });
        const place = (x: number, y: number) => {
          const b = stage.getBoundingClientRect(), pad = 60;
          const point = {
            x: Math.max(pad, Math.min(b.width - pad, x)),
            y: Math.max(pad, Math.min(b.height - pad, y)),
          };
          if (reduce.matches) gsap.set(soundSticker, point);
          else {
            moveX(point.x);
            moveY(point.y);
          }
        };
        const rest = () => {
          const b = stage.getBoundingClientRect();
          place(b.width - 70, b.height - 70);
        };
        const move = (event: PointerEvent) => {
          const b = stage.getBoundingClientRect();
          place(event.clientX - b.left, event.clientY - b.top);
        };
        sound.addEventListener("pointermove", move as EventListener);
        sound.addEventListener("pointerleave", rest as EventListener);
        stage.addEventListener("pointermove", move as EventListener);
        stage.addEventListener("pointerleave", rest as EventListener);
        const observer = new ResizeObserver(rest);
        observer.observe(stage);
        rest();
        return () => {
          observer.disconnect();
          sound.removeEventListener("pointermove", move as EventListener);
          sound.removeEventListener("pointerleave", rest as EventListener);
          stage.removeEventListener("pointermove", move as EventListener);
          stage.removeEventListener("pointerleave", rest as EventListener);
          stage.classList.remove("has-sound-cursor");
          gsap.set(soundSticker, { clearProps: "left,top,transform" });
        };
      });
    }
    media.add(
      {
        normal: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        video.controls = !!context.conditions?.reduce;
        measure();
        if (context.conditions?.reduce) {
          expanded(false);
          video.pause();
          return;
        }
        scene.classList.add("is-animated");
        timeline = gsap.timeline({
          onUpdate() {
            const active = this.time() >= 1.13;
            expanded(active);
            content.inert = this.time() > 0.4;
          },
          scrollTrigger: {
            id: "typica-tv-expansion",
            trigger: scene,
            start: () =>
              `top ${Math.min(0, innerHeight - stage.offsetHeight)}px`,
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
        });
        timeline
          .fromTo(
            frame,
            { x: 0, y: 0, scale: 1 },
            {
              x: () => target().x,
              y: () => target().y,
              scale: () => target().scale,
              duration: 1,
              ease: "power2.inOut",
            },
            0.14,
          )
          .to(
            content,
            { autoAlpha: 0, y: -24, duration: 0.26, ease: "power2.out" },
            0.16,
          )
          .to({}, { duration: 0.56 });
        return () => {
          scene.classList.remove("is-animated");
          expanded(false);
          content.inert = false;
          timeline = null;
        };
      },
    );
    let task = 0;
    new ResizeObserver(() => {
      cancelAnimationFrame(task);
      task = requestAnimationFrame(() => {
        if (document.fullscreenElement === stage) {
          measure();
          gsap.set(frame, target());
        } else ScrollTrigger.refresh();
      });
    }).observe(stage);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}
