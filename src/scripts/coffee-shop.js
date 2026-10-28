import "@/scripts/motion";
import { coffees } from "@/data/coffees";
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const G = window.gsap;
  const animated = () => G && !reduced.matches;
  const catalog = coffees;
  const money = (value) => "Bs " + value.toLocaleString("es-BO");
  window.typicaCoffeeCatalog = catalog;
  const credits = $("#credits-dialog");
  let creditsFocus = null;
  $("#open-credits")?.addEventListener("click", () => {
    creditsFocus = document.activeElement;
    credits.showModal();
    document.body.style.overflow = "hidden";
  });
  $$("[data-close]").forEach((button) =>
    button.addEventListener("click", () =>
      $("#" + button.dataset.close)?.close(),
    ),
  );
  credits?.addEventListener("close", () => {
    document.body.style.overflow = "";
    creditsFocus?.focus({ preventScroll: true });
  });
  $$("dialog").forEach((dialog) =>
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    }),
  );

  function setDetails(card, open, source) {
    const product = catalog.find(
      (product) => product.id === card.dataset.coffee,
    );
    const options = card.querySelector(".coffee-options_wrap");
    const toggle = card.querySelector("[data-coffee-toggle]");
    card.classList.toggle("is-open", open);
    options.hidden = !open;
    card
      .querySelectorAll(
        ".coffee-product_visual,.coffee-product_foot,.coffee-product_watermark,.coffee-product_sample-note",
      )
      .forEach((element) => {
        element.hidden = open;
      });
    card
      .querySelectorAll("[data-coffee-toggle],[data-open-coffee]")
      .forEach((button) => button.setAttribute("aria-expanded", String(open)));
    toggle.setAttribute(
      "aria-label",
      `${open ? "Cerrar" : "Ver"} detalles de ${product.name}`,
    );
    if (open && source !== toggle)
      options.querySelector("select").focus({ preventScroll: true });
    if (!open && options.contains(document.activeElement))
      toggle.focus({ preventScroll: true });
    if (open && animated())
      G.fromTo(
        options,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power3.out",
          overwrite: true,
          clearProps: "opacity,transform",
        },
      );
  }
  $$("[data-coffee-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      const card = button.closest(".coffee-product_wrap");
      setDetails(card, !card.classList.contains("is-open"), button);
    }),
  );
  $$("[data-open-coffee]").forEach((button) =>
    button.addEventListener("click", () =>
      setDetails(button.closest(".coffee-product_wrap"), true, button),
    ),
  );
  $$(".coffee-product_wrap").forEach((card) =>
    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && card.classList.contains("is-open")) {
        event.preventDefault();
        setDetails(card, false);
        card
          .querySelector("[data-coffee-toggle]")
          .focus({ preventScroll: true });
      }
    }),
  );
  $$("[data-coffee-order]").forEach((form) => {
    const product = catalog.find(
      (product) => product.id === form.dataset.coffeeOrder,
    );
    const count = form.querySelector(".quantity-stepper_count");
    const status = form.querySelector(".coffee-options_status");
    let quantity = 1;
    const update = () => {
      count.textContent = quantity;
      form.querySelector('[data-quantity-step="-1"]').disabled = quantity === 1;
      form.querySelector('[data-quantity-step="1"]').disabled = quantity === 12;
      form.querySelector(".coffee-options_total").textContent = money(
        product.price * quantity,
      );
    };
    form.querySelectorAll("[data-quantity-step]").forEach((button) =>
      button.addEventListener("click", () => {
        quantity = Math.max(
          1,
          Math.min(12, quantity + Number(button.dataset.quantityStep)),
        );
        update();
      }),
    );
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      document.dispatchEvent(
        new CustomEvent("typica:add-to-cart", {
          detail: {
            id: product.id,
            quantity,
            grind: form.elements.grind.value,
          },
        }),
      );
      status.textContent = `${quantity} ${quantity === 1 ? "bolsa añadida" : "bolsas añadidas"} al carrito.`;
    });
    update();
  });
})();
