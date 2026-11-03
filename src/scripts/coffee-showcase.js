import "@/scripts/motion";
(() => {
  "use strict";
  const section = document.querySelector(".coffee-showcase_wrap");
  if (!section) return;
  const viewport = section.querySelector(".coffee-showcase_viewport");
  const track = section.querySelector(".coffee-showcase_track");
  const cover = section.querySelector(".coffee-cover_wrap");
  const cards = [...section.querySelectorAll(".coffee-product_wrap")];
  const previous = section.querySelector('[data-coffee-step="-1"]');
  const next = section.querySelector('[data-coffee-step="1"]');
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let scrollScene = null;
  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  function goTo(offset) {
    offset = Math.max(0, Math.min(distance(), offset));
    if (scrollScene) {
      // The intro has its own pins. Measure them in document order before jumping tracks.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      // ScrollTrigger already smooths the track; a second smooth scroll can fight refreshes upstream.
      window.scrollTo({ top: scrollScene.start + offset, behavior: "instant" });
    } else {
      viewport.scrollTo({
        left: offset,
        behavior: reduced.matches ? "instant" : "smooth",
      });
    }
  }
  section
    .querySelectorAll("[data-coffee-browse]")
    .forEach((button) =>
      button.addEventListener("click", () => goTo(cover.offsetWidth)),
    );
  previous.addEventListener("click", () =>
    goTo(
      (scrollScene ? scrollScene.progress * distance() : viewport.scrollLeft) -
        cards[0].offsetWidth,
    ),
  );
  next.addEventListener("click", () =>
    goTo(
      (scrollScene ? scrollScene.progress * distance() : viewport.scrollLeft) +
        cards[0].offsetWidth,
    ),
  );
  section.querySelectorAll(".coffee-letter_wrap").forEach((tile) =>
    tile.addEventListener("click", () => {
      const turned = tile.classList.toggle("is-turned");
      tile.setAttribute("aria-pressed", String(turned));
    }),
  );

  // Keyboard focus follows the horizontal track without moving a card on pointer input.
  let keyboardNavigation = false;
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") keyboardNavigation = true;
  });
  document.addEventListener(
    "pointerdown",
    () => {
      keyboardNavigation = false;
    },
    { passive: true },
  );
  track.addEventListener("focusin", (event) => {
    const card = event.target.closest(".coffee-product_wrap");
    if (!card || !keyboardNavigation) return;
    const box = card.getBoundingClientRect(),
      bounds = viewport.getBoundingClientRect();
    if (box.left >= bounds.left - 1 && box.right <= bounds.right + 1) return;
    if (scrollScene) viewport.scrollLeft = 0;
    goTo(card.offsetLeft);
  });
  document.addEventListener("typica:show-coffee", (event) => {
    const card = cards.find((card) => card.dataset.coffee === event.detail?.id);
    if (card) goTo(card.offsetLeft);
  });

  async function init() {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 901px) and (min-height: 621px) and (prefers-reduced-motion: no-preference)",
      () => {
        section.classList.add("is-scroll-driven");
        viewport.scrollLeft = 0;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            pin: section,
            pinSpacing: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              previous.disabled = self.progress < 0.002;
              next.disabled = self.progress > 0.998;
            },
          },
        });
        scrollScene = tween.scrollTrigger;
        return () => {
          section.classList.remove("is-scroll-driven");
          scrollScene = null;
          previous.disabled = false;
          next.disabled = false;
        };
      },
    );
    ScrollTrigger.refresh();
  }
  init().catch((error) => console.warn("Recorrido del café:", error));
})();
