import type { ImageMetadata } from "astro";
import laPazImage from "@/assets/images/la-paz.avif";
import cochabambaImage from "@/assets/images/casa-cochabamba.jpg";
import santaCruzImage from "@/assets/images/casa-santa-cruz.png";

export interface Location {
  id: string;
  city: string;
  name: string;
  description: string;
  branches: string;
  image: ImageMetadata;
  alt: string;
  href: string;
  label: string;
}

export const locations: Location[] = [
  {
    id: "la-paz",
    city: "la-paz",
    name: "La Paz",
    description: "Entre patios, casonas y una buena taza.",
    branches:
      "San Miguel · Sopocachi · Centro · Satélite · Miraflores · Plaza 21 Mall · Obrajes · Achumani",
    image: laPazImage,
    alt: "Casa Typica en La Paz",
    href: "https://www.typica.com.bo/locales",
    label: "Direcciones, horarios y carta",
  },
  {
    id: "cochabamba",
    city: "cochabamba",
    name: "Cochabamba",
    description: "Un café y tiempo para quedarte.",
    branches: "España · Fidel Anze · Portales",
    image: cochabambaImage,
    alt: "Casa Typica en Cochabamba",
    href: "https://www.typica.com.bo/locales",
    label: "Direcciones, horarios y carta",
  },
  {
    id: "santa-cruz",
    city: "santa-cruz",
    name: "Santa Cruz",
    description: "Tu pausa entre plantas e historias.",
    branches: "Equipetrol",
    image: santaCruzImage,
    alt: "Casa Typica en Santa Cruz",
    href: "https://www.typica.com.bo/locales",
    label: "Direcciones, horarios y carta",
  },
];
