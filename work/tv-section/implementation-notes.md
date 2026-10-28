# Sección del televisor

Se añade `#typica-tv` al `index.html` existente, entre Cultura y Espacios.
La sección anterior y sus scripts permanecen intactos.

El vídeo proporcionado por el usuario es una muestra, no metraje de Typica.
La fotografía del escenario se generó con ImageGen y se editó con la misma
herramienta para abrir un hueco de transparencia real en la pantalla.
El PNG se coloca delante del vídeo; ambos comparten un único transform de
GSAP. El borde visible corresponde al bisel fotografiado, sin redondeado CSS.
La expansión usa sólo transformaciones y se revierte con el scroll.

Assets: `assets/tv-section/television-overlay.png`, `typica-tv.mp4` y poster.
Anton se distribuye junto con su licencia OFL.

Los controles permanecen ocultos y fuera del teclado mientras se ve el
televisor. Sólo aparecen al completarse el zoom. Reutilizan el HTML, las
clases CSS y los SVG de los controles originales: dos botones claros de
44 px y el sticker de sonido que sigue al puntero. No hay controles nativos.

Comprobado en navegador: reproducción, pausa, sonido, entrada y salida de
pantalla completa, expansión y ocultación al retroceder. Los controles
comparten color, medidas, bordes e iconos con los originales. Sin errores
de consola del módulo. Los archivos originales se compararon con su copia.

## Prompt final de edición (herramienta integrada ImageGen)

Edit target: the supplied 1672×941 photograph. Use case: precise-object-edit / transparent cutout. Make ONLY the black glass viewing area INSIDE the CRT screen truly transparent (alpha zero), following its original gently curved irregular inner silhouette precisely up to the inner glass/bezel seam. The surrounding black television bezel, plastic frame, knobs, speaker, cream wall, yellow stripe, wooden counter, grinder, dripper and kettle must remain opaque and visually unchanged. Preserve the camera, exact object positions, image dimensions and edges. This is a web compositing overlay: HTML video will sit behind this one transparent screen aperture. Do NOT remove the wall or outer background. Do NOT render a checkerboard, gray fill, black fill, new picture, or simulated transparency inside the aperture; use actual PNG alpha. Do not redraw or restyle the photograph. Preserve all physical shading and the slim dark inner rim around the opening.
