import type { ImageMetadata } from "astro";
import geshaImage from "@/assets/products/Image.png";
import javaImage from "@/assets/products/Image-1.png";
import blendImage from "@/assets/products/Image-2.png";
import iprImage from "@/assets/products/Image-3.png";

export interface Coffee {
  id: string;
  name: string;
  notes: string;
  origin: string;
  image: ImageMetadata;
  alt: string;
  price: number;
  description: string;
  watermark: string;
  back: string;
  ground: string;
  process: string;
  theme: string;
}

export const coffees: Coffee[] = [
  {
    id: "gesha",
    name: "Gesha",
    notes: "Jazmín, lavanda, piña y mandarina",
    origin: "Caranavi · La Herminia",
    image: geshaImage,
    alt: "Bolsa de café Gesha de Typica",
    price: 145,
    description:
      "Floral, delicado y con mucho que contar. Un café de La Herminia, en Caranavi, de proceso lavado. En la taza: jazmín, lavanda, piña y mandarina. Un origen boliviano para disfrutar con calma.",
    watermark: "GESHA",
    back: "GESHA",
    ground: "",
    process: "",
    theme: "coffee-product_gesha",
  },
  {
    id: "java",
    name: "Java",
    notes: "Flores blancas, cítricos y fruta",
    origin: "Coroico · Nora Gemio",
    image: javaImage,
    alt: "Bolsa de café Java de Typica",
    price: 95,
    description:
      "Flores blancas, fruta y una taza brillante. Cultivado por Nora Gemio en Coroico y de proceso lavado. Sus notas de naranja, limón, guayaba y chirimoya acompañan tu ritual de cada día.",
    watermark: "JAVA",
    back: "JAVA",
    ground: "",
    process: "",
    theme: "coffee-product_java",
  },
  {
    id: "blend",
    name: "De la casa",
    notes: "Un perfil equilibrado para todos los días",
    origin: "Bolivia · Selección Typica",
    image: blendImage,
    alt: "Bolsa de café De la casa de Typica",
    price: 75,
    description:
      "Nuestra selección para el café de todos los días. Un perfil equilibrado, tan paceño como mirar el Illimani al amanecer. El blend de Typica para hacer de una buena taza una costumbre.",
    watermark: "DE LA CASA",
    back: "DE LA CASA",
    ground: "",
    process: "",
    theme: "coffee-product_blend",
  },
  {
    id: "ipr",
    name: "IPR-103",
    notes: "Guayaba, papaya, durazno y miel",
    origin: "Mairana · Finca Arlet",
    image: iprImage,
    alt: "Bolsa de café IPR-103 de Typica",
    price: 110,
    description:
      "Frutas maduras y dulzura de los valles. Desde la Finca Arlet, en Mairana, un café de proceso honey con notas de guayaba, durazno, papaya y miel. Dulce, tropical y con carácter propio.",
    watermark: "IPR-103",
    back: "IPR-103",
    ground: "",
    process: "",
    theme: "coffee-product_ipr",
  },
];

export const grindOptions = [
  "En grano",
  "Molido para filtro",
  "Molido para espresso",
  "Molido para prensa",
];

export function money(value: number) {
  return "Bs " + value.toFixed(0);
}
