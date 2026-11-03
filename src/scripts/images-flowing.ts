import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export interface FlowCardItem {
  country: string;
  city: string;
  color: string;
  img: string;
}

export function initImagesFlowing(rootElement?: HTMLElement | null): () => void {
  if (typeof window === "undefined") return () => {};

  const root = rootElement || document.querySelector<HTMLElement>(".mwg_effect068");
  if (!root) return () => {};

  const pinHeight = root.querySelector<HTMLElement>(".pin-height");
  const track = root.querySelector<HTMLElement>(".cards-track");
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".media"));

  if (!pinHeight || !track || cards.length === 0) return () => {};

  // Modo reducido si el usuario lo prefiere
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    root.classList.add("is-reduced-motion");
    return () => {};
  }

  const N = cards.length;
  // Pendiente diagonal suave (~ -16.8 grados)
  const TILT_ANGLE = -16.8 * (Math.PI / 180);

  // Setters optimizados con GSAP quickSetter para 60-120fps puros sin jank
  const setters = cards.map((card) => ({
    card,
    setX: gsap.quickSetter(card, "x", "px"),
    setY: gsap.quickSetter(card, "y", "px"),
    setZ: gsap.quickSetter(card, "z", "px"),
    setRotX: gsap.quickSetter(card, "rotationX", "deg"),
    setRotY: gsap.quickSetter(card, "rotationY", "deg"),
    setRotZ: gsap.quickSetter(card, "rotationZ", "deg"),
    setScale: gsap.quickSetter(card, "scale"),
    setOpacity: gsap.quickSetter(card, "opacity"),
    setZIndex: gsap.quickSetter(card, "zIndex"),
  }));

  function updateCylinder(progress: number) {
    const W = window.innerWidth;
    
    // Espaciado compacto y ceñido: las cartas van juntas sin huecos gigantes
    const spacing = W < 600 ? 210 : W < 1024 ? 230 : 250;
    
    // Rango de viaje del scroll para que entren y salgan suavemente
    const range = (N - 1) + 4.2;
    const currentCenter = -2.1 + progress * range;

    setters.forEach(({ card, setX, setY, setZ, setRotX, setRotY, setRotZ, setScale, setOpacity, setZIndex }, i) => {
      // u = 0 en el centro de la pantalla
      // u < 0 hacia la izquierda
      // u > 0 hacia la derecha
      const u = currentCenter - i;
      const absU = Math.abs(u);

      // Posicionamiento en diagonal a lo largo de la pantalla
      const x = u * spacing;
      const y = x * Math.tan(TILT_ANGLE);

      // Profundidad 3D suave: el centro está al frente, los laterales retroceden sutilmente
      const z = -Math.pow(absU, 1.25) * 35;

      // Rotaciones 3D sutiles: NO deforman ni destruyen las cartas
      // En el centro (u = 0): todos los ángulos son exactamente 0deg (recta)
      const rotY = -u * 13;
      const rotX = absU * 4;
      const rotZ = -u * 7;

      // Escala sutil para acentuar el centro
      const scale = 1 - absU * 0.03;

      // Opacidad: se desvanecen gradualmente al salir de la pantalla
      const opacity = absU > 3.6 ? 0 : absU > 2.6 ? Math.max(0, 1 - (absU - 2.6)) : 1;
      const zIndex = Math.max(1, 100 - Math.round(absU * 10));

      setX(x);
      setY(y);
      setZ(z);
      setRotX(rotX);
      setRotY(rotY);
      setRotZ(rotZ);
      setScale(scale);
      setOpacity(opacity);
      setZIndex(zIndex);

      card.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
    });
  }

  // ScrollTrigger con GSAP
  const st = ScrollTrigger.create({
    trigger: pinHeight,
    start: "top top",
    end: "bottom bottom",
    scrub: 1, // GSAP scrub fluido
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      updateCylinder(self.progress);
    },
  });

  // Render inicial
  updateCylinder(0);

  const handleResize = () => {
    updateCylinder(st.progress);
  };
  window.addEventListener("resize", handleResize);

  return () => {
    st.kill();
    window.removeEventListener("resize", handleResize);
  };
}

if (typeof window !== "undefined") {
  const init = () => {
    const el = document.querySelector<HTMLElement>(".mwg_effect068");
    if (el) initImagesFlowing(el);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
