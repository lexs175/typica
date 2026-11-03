# Typica · Astro + Lumos

Sitio estático con Astro, TypeScript, los componentes y tokens de [Lumos for Astro](https://github.com/lumosframework/lumos-for-astro) 1.0.1 y animaciones GSAP.

## Ejecutar

Requiere Node.js 22.23.4 o superior.

```sh
npm ci
npm run dev
```

La vista de desarrollo se abre en `http://127.0.0.1:4321`. `npm run check` comprueba Astro y TypeScript; `npm run build` genera `dist/`; `npm run preview` sirve esa compilación.

## Dónde editar

| Cambio                                        | Archivo o carpeta                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| Colores, tipografía, espaciado, temas y botón | `src/styles/base.css`                                                                |
| Botón compartido y variantes                  | `src/components/Button.astro`                                                        |
| Texto y composición del hero                  | `src/components/section/HeroTv.astro`                                                |
| Imagen, pantalla y stickers del televisor     | `src/components/media/Television.astro`                                              |
| Expansión y controles del hero                | `src/scripts/hero-tv.ts`                                                             |
| Portada del catálogo                          | `src/components/content/CoffeeCover.astro`                                           |
| Ficha y opciones de café                      | `src/components/item/CoffeeProduct.astro`, `src/components/form/CoffeeOptions.astro` |
| Cafés, precios y moliendas                    | `src/data/coffees.ts`                                                                |
| Sucursales principales                        | `src/data/locations.ts`                                                              |
| Composición de las páginas                    | `src/pages/`                                                                         |
| Cabecera, menú, pie y carrito                 | `src/components/global/`                                                             |

Las rutas actuales son `/`, `/sucursales/` y `/suscripciones/`, además de la página 404 y las redirecciones de las antiguas URLs `.html`. `arquitectura-web-typica.md` contiene la propuesta de ampliación del sitio.

## Jerarquía de componentes

Los elementos base de Lumos están en `typography/`, `wrapper/`, `form/` y `media/`, junto con `Button.astro`. Las piezas de Typica se componen sobre esa base:

```text
SiteLayout
├── global/             cabecera, navegación, pie, carrito
└── pages/
    └── section/        hero, catálogo, cultura, directorio, suscripción
        ├── content/    portada, abanico de fotos, historia
        ├── item/       café, letra, sucursal, enlace destacado
        ├── form/       opciones, cantidad, suscripción
        └── media/      televisor, vídeo, controles, sonido
```

Cada componente propio reúne su marcado y estilos. Los módulos de interacción se importan desde el componente que los necesita. Las páginas ensamblan secciones; los datos repetidos se editan en `src/data/`.

```astro
---
import HeroTv from "@/components/section/HeroTv.astro";
import Button from "@/components/Button.astro";
---

<HeroTv
  title="Café de especialidad para amantes del café en Bolivia"
  action="Elegir mi café"
  href="#cafes"
/>

<Button element="link" href="/sucursales/">
  Encontrar una sucursal
</Button>
```

## Convenciones Lumos

- La cascada se ordena en `base`, `patterns`, `components` y `utilities`.
- La paleta y los valores compartidos viven en `base.css`; los componentes consumen variables. Los temas disponibles son `theme-light`, `theme-dark` y `theme-brand`.
- Los componentes propios usan una raíz `nombre_wrap` y elementos con el mismo prefijo. La guía completa del framework está en `LUMOS.md` y su licencia en `LICENSE-LUMOS`.
- Los componentes usan props y slots de Astro. `render={false}` permite omitir una pieza sin cambiar su composición.
- Las imágenes importadas de `src/assets/` son metadatos de Astro. En JavaScript de navegador se utiliza `imagen.src` para asignar una URL. Los vídeos están en `public/videos/`.

El hero coloca el texto y después el televisor en flujo normal. La imagen mantiene sus proporciones; el vídeo y los stickers se superponen dentro del marco. El scroll amplía el conjunto mediante una transformación uniforme. Con movimiento reducido se muestra el vídeo con controles nativos.

## Verificar

```sh
npm run check
npm run build
npx playwright install chromium
npm test
```

Las pruebas arrancan una vista de producción en el puerto 4322 y comprueban el hero en cuatro anchos, expansión y controles de ambos vídeos, catálogo, carrito persistente, menú móvil, filtros y formulario de suscripción. Las capturas y trazas se guardan en `test-results/`.

El catálogo conserva los precios de muestra y las consultas comerciales existentes. El vídeo del televisor conserva el material de ejemplo.
