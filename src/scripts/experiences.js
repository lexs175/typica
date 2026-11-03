import "@/scripts/motion";
import { coffees } from "@/data/coffees";
(() => {
  "use strict";
  const filters = [...document.querySelectorAll("[data-city-filter]")];
  const cities = [...document.querySelectorAll("[data-city]")];
  function filterCities(key) {
    const main = ["la-paz", "cochabamba", "santa-cruz"];
    cities.forEach((city) => {
      city.hidden =
        key !== "all" &&
        !(key === "mas"
          ? !main.includes(city.dataset.city)
          : city.dataset.city === key);
    });
    filters.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.cityFilter === key),
      ),
    );
    const more = document.querySelector(".locations-directory_more-locations");
    if (more)
      more.hidden = !cities.some((city) => more.contains(city) && !city.hidden);
    const status = document.querySelector("#location-status");
    const count = cities.filter((city) => !city.hidden).length;
    if (status)
      status.textContent = `${count} ${count === 1 ? "ciudad" : "ciudades"} en el directorio.`;
  }
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      filterCities(button.dataset.cityFilter);
      history.replaceState(null, "", location.pathname);
    }),
  );
  function revealHash() {
    if (!filters.length) return;
    filterCities("all");
    const target = document.getElementById(
      decodeURIComponent(location.hash.slice(1)),
    );
    if (target?.matches("[data-city],.locations-directory_more-locations"))
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }
  addEventListener("hashchange", revealHash);
  revealHash();

  const form = document.querySelector("#subscription-form");
  if (!form) return;
  const catalog = coffees;
  const coffee = document.querySelector("#subscription-coffee");
  const quantity = document.querySelector("#subscription-quantity");
  const frequency = document.querySelector("#subscription-frequency");
  const grind = document.querySelector("#subscription-grind");
  const result = document.querySelector("#subscription-result");
  function update() {
    const product = catalog.find((product) => product.id === coffee.value);
    const pack = document.querySelector("#subscription-pack");
    pack.src = product.image.src;
    pack.alt = "Bolsa de café " + product.name + " de Typica";
    document.querySelector("#subscription-summary").textContent =
      `${quantity.value} ${quantity.value === "1" ? "bolsa" : "bolsas"} de ${product.name}, ${frequency.value.toLowerCase()}.`;
    document.querySelector("#subscription-message").value =
      `Hola, Typica. Me gustaría consultar una suscripción de café: ${quantity.value} ${quantity.value === "1" ? "bolsa" : "bolsas"} de ${product.name} de 250 g, ${grind.value.toLowerCase()}, ${frequency.value.toLowerCase()}. ¿Me confirman disponibilidad, precio y opciones de entrega?`;
    document.querySelector("#subscription-copy").textContent =
      "Copiar consulta";
    document.querySelector("#subscription-status").textContent = "";
  }
  form.addEventListener("change", update);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    update();
    result.hidden = false;
    document.querySelector("#subscription-copy").focus({ preventScroll: true });
    result.scrollIntoView({
      block: "nearest",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });
  document
    .querySelector("#subscription-copy")
    .addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          document.querySelector("#subscription-message").value,
        );
        document.querySelector("#subscription-copy").textContent =
          "Consulta copiada";
        document.querySelector("#subscription-status").textContent =
          "Ya puedes compartir tu consulta con Typica.";
      } catch {
        document.querySelector("#subscription-message").select();
        document.querySelector("#subscription-status").textContent =
          "Selecciona y copia el texto de tu consulta.";
      }
    });
  update();
})();
