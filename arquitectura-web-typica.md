# Arquitectura del sitio web de Typica

Propuesta de organización y contenido · 20 de octubre de 2026

## 1. Decisión principal

El home presenta Typica y abre recorridos claros. La carta, el catálogo, cada casa, la actividad cultural y los servicios profesionales tienen destinos propios. Una animación puede conectar estos contenidos; la información necesaria para elegir, visitar o consultar permanece disponible sin completar una animación.

Esta propuesta distingue hechos publicados de decisiones de diseño. No presupone pagos en línea, envíos, cursos, franquicias, disponibilidad local de equipos ni una frecuencia fija de eventos.

## 2. Base comprobada

| Contenido real | Evidencia | Consecuencia para la arquitectura |
|---|---|---|
| Cafés en bolsa | La home oficial presenta Gesha, Java, Blend de la casa e IPR-103. [Fuente](https://www.typica.com.bo/) | Catálogo y ficha de café; la selección comercial debe mantenerse actualizada. |
| Casas con información distinta | El directorio enumera ciudades y sucursales. San Miguel publica dirección, horarios, carta, contactos y comodidades. [Directorio](https://www.typica.com.bo/locales) · [San Miguel](https://www.typica.com.bo/san-miguel) | Directorio y ficha de cada casa. La carta se vincula con su sucursal. |
| Cartas en PDF por local | San Miguel y Sopocachi tienen enlaces propios «Ver Menú». [San Miguel](https://www.typica.com.bo/san-miguel) · [Sopocachi](https://www.typica.com.bo/dopocachi) | Migrar las cartas a contenido web, preservando las diferencias reales entre locales. |
| Servicio de tueste | La página oficial ofrece recibir café del cliente y tostarlo según sus necesidades. [Tostaduría](https://www.typica.com.bo/tostaduria) | Página de servicio con consulta dirigida al contacto de la tostaduría. |
| Distribución de Aillio | Aillio Latam identifica a Typica Café como distribuidor en Bolivia. [Fuente](https://latam.aillio.com/pages/retailers) | Página Aillio con explicación de equipos y contacto comercial. |
| Campeonato organizado con Aillio | La convocatoria publica 11–13 de junio de 2026; la página Aillio × Typica relata el encuentro realizado. [Convocatoria](https://typica.com.bo/campeonato-de-tueste-mas-alto-del-mundo) · [Resumen](https://www.typica.com.bo/aillio-x-typica) | Ficha de evento pasado conectada con Aillio y Cultura. |
| Música en vivo | Golden Hour Sessions anunció a Insulin Kid para el 23 de octubre de 2026 en San Miguel. [Publicación](https://www.instagram.com/typica.cafe/p/DeuVzUQFWTH/) | Agenda por fechas y locales. No publicar una programación semanal fija sin confirmación. |
| Artes visuales | Hay antecedentes de Las Amazonas en 2023, Wara Vargas en 2024 y Cromática Cocalera de Freddy Barragán en 2024, en Obrajes. [Las Amazonas](https://bolivia.conservation.org/news/exposicion-de-artes-visuales-las-amazonas-lideresas-indigenas) · [Wara Vargas](https://www.vision360.bo/noticias/2024/05/15/4468-de-la-casa-museo-de-perez-alcala-a-una-muestra-de-ugalde) · [Freddy Barragán](https://www.vision360.bo/noticias/2024/10/21/13873-cromatica-cocalera-freddy-barragan-une-el-periodismo-y-el-arte-plastico-en-una-muestra-de-12-piezas) | Cultura incluye arte y fotografía; archivo y créditos por artista. |
| Postulaciones laborales | Existe un formulario de trabajo. [Fuente](https://www.typica.com.bo/trabaja-con-nosotros) | Conservar «Trabaja con nosotros» como destino explícito. |

Los antecedentes culturales prueban actividad histórica; no se presentan como exposiciones vigentes. No se incluye a una persona como invitada de Typica sin una fuente que confirme esa relación.

## 3. Navegación

### Cabecera

Logo de Typica, acceso visible a **Carta** y control **menú**. «Carta» identifica comida y bebidas; «menú» abre la navegación del sitio.

### Navegación principal al desplegar

**Carta · Cafés en bolsa · Casas · Arte y cultura · Typica**

En el mismo panel, como accesos secundarios visibles: **Tostaduría · Aillio × Typica · Galería**. Trabaja con nosotros, contacto y redes quedan en la franja de utilidades y en el pie.

### Pie de página

- Visítanos: Carta, Casas, Arte y cultura, Galería.
- El café: Cafés en bolsa, Tostaduría, Aillio × Typica.
- Typica: Historia y equipo, Trabaja con nosotros, Contacto.
- Privacidad, condiciones aplicables y redes oficiales.

No duplicar todo el directorio de sucursales en el pie. El acceso Casas resuelve esa consulta.

## 4. Mapa del sitio

```text
Inicio /
├── Carta /carta/
│   └── Carta del local seleccionado — una vista del mismo sistema
├── Cafés en bolsa /cafes/
│   └── Ficha de café /cafes/{cafe}/
├── Casas /casas/
│   └── Ficha de casa /casas/{casa}/
├── Arte y cultura /cultura/
│   ├── Próximas actividades y archivo — filtros de la misma agenda
│   ├── Ficha de actividad /cultura/{actividad}/
│   └── Perfil de artista /cultura/artistas/{artista}/
├── Galería /galeria/
├── Typica /typica/
├── Tostaduría /tostaduria/
├── Aillio × Typica /aillio/
├── Contacto /contacto/
├── Trabaja con nosotros /trabaja-con-nosotros/
├── Privacidad /privacidad/
└── Condiciones /condiciones/
```

Las fichas son plantillas reutilizables. Una nueva casa o actividad se incorpora al mismo sistema y aparece donde corresponde; no exige diseñar otra web.

No hacen falta páginas independientes para cada plato, cada categoría de la carta o cada filtro de ciudad. Cada artista obtiene perfil cuando existe material confirmado suficiente para presentar su trabajo; mientras tanto, se acredita en la actividad correspondiente.

## 5. Home: orden y límites

Cinco bloques de contenido y un pie. La profundidad se resuelve en las páginas interiores.

| Orden | Sección | Contenido que sí lleva | Destino y límite |
|---|---|---|---|
| 1 | Hero | Identidad de Typica, fotografía o vídeo real, frase principal y accesos a carta y casas. La navegación ofrece también Cafés en bolsa. | Presentar y orientar. No incluir aquí catálogo, agenda y premios completos. |
| 2 | Esto es Typica | Un texto breve que conecte café boliviano, personas, casas y cultura. Las tres fotos 4:5 con su apertura por scroll pertenecen a este bloque. | Historia de Typica y Galería. La frase curva puede integrarse aquí; no necesita otra sección con el mismo mensaje. |
| 3 | Una casa y una mesa | Entrada al directorio, elección de ciudad/local y una muestra breve de la experiencia de carta con fotografías reales. | Encontrar casa y consultar su carta. No desplegar todas las sucursales ni todos los platos. |
| 4 | Café para llevar a casa | Un café destacado con bolsa real, nombre, origen y perfil breve; acceso al catálogo. | Ver su ficha o explorar Cafés en bolsa. El catálogo completo y las opciones de compra viven fuera del home. |
| 5 | Lo que pasa en Typica | Hasta tres actividades confirmadas, con disciplina, fecha y local. Prioridad a lo próximo o vigente. | Arte y cultura. Cuando no haya programación confirmada, mostrar el archivo identificado como pasado. |
| 6 | Pie | Navegación completa, acceso a tostaduría y Aillio, contacto y redes. | Los servicios profesionales quedan a un clic sin convertirse en dos secciones comerciales adicionales. |

No añadir una galería completa después de las tres fotos introductorias ni repetir las mismas imágenes como otra sección. El home ofrece una entrada visual; Galería permite explorar.

## 6. Carta: contenido web por sucursal

**Pregunta que resuelve:** qué puedo comer o beber en la casa que quiero visitar y cuánto cuesta.

Secuencia:

1. Selección de ciudad y sucursal, conservando la elección durante el recorrido.
2. Nombre de la casa y contexto visible de la carta seleccionada.
3. Categorías tomadas de la carta real de ese local, con navegación directa entre ellas.
4. Productos con nombre, descripción, precio y fotografía donde exista una adecuada.
5. Variantes, disponibilidad y datos alimentarios únicamente cuando estén proporcionados y verificados.
6. Acceso a dirección, horario y contacto de esa misma casa.

La página de una casa abre directamente su carta seleccionada. El visitante no vuelve a elegir ciudad y local. Cambiar de sucursal debe ser una acción explícita para evitar mezclar precios y ofertas.

Los PDF existentes son material de migración. La experiencia principal será HTML legible en móvil, con texto seleccionable, precios editables y categorías navegables. No se sustituye el PDF por capturas de sus páginas.

Cada plato se consulta dentro de la carta. No necesita una página individual para inflar el sitio. No se incorpora un carrito de comida sin confirmar un servicio de pedidos que lo sostenga.

## 7. Cafés en bolsa: catálogo y fichas

**Pregunta que resuelve:** qué café elegir y cómo conseguirlo.

### Catálogo

Presentación de la selección disponible, empaques reales, variedad/nombre, origen, perfil y precio vigente cuando esté aprobado. Los cuatro cafés publicados en la home actual son una base de contenido, no una afirmación de que sean todo el catálogo comercial.

Con una selección pequeña no hacen falta filtros complejos. La lectura de los productos debe permitir compararlos directamente.

### Ficha de café

1. Bolsa e identificación del café.
2. Perfil de sabor y notas.
3. Productor o finca, región, variedad y proceso según información disponible.
4. Presentación y peso reales.
5. Precio y disponibilidad aprobados.
6. Preparación o molienda, si se ofrece, y cantidad.
7. Acción para consultar o realizar el pedido por el canal comercial confirmado.
8. Otros cafés relacionados y vínculo a la tostaduría cuando resulte pertinente.

La investigación no acredita un sistema operativo de pago y envíos en línea. Por ello el lanzamiento puede resolver una selección y consulta real sin simular una compra terminada. Carrito, pago, entrega y seguimiento constituyen un alcance comercial adicional que requiere definir stock, cobros, cobertura y responsables antes de diseñar sus pantallas.

## 8. Casas: directorio y página de cada sede

**Pregunta que resuelve:** dónde ir y qué encontrar allí.

### Directorio

Selección por país y ciudad, listado con fotografías reales, barrio, dirección resumida y acceso a cada casa. Un mapa puede complementar el listado. El listado debe poder usarse sin abrir el mapa.

El directorio oficial incluye La Paz, Cochabamba, Santa Cruz, Oruro, Sucre, Asunción y Florianópolis. Se deben validar las sucursales publicadas y sus datos antes del lanzamiento. No se inventan aperturas o estados operativos.

### Ficha de casa

1. Nombre, barrio y fotografía de entrada o ambiente.
2. Dirección, horario y contacto fáciles de encontrar.
3. Acciones: cómo llegar, ver carta y consultar; reservas únicamente donde estén confirmadas.
4. Historia breve y carácter propio de esa casa.
5. Galería de sus ambientes.
6. Comodidades verificadas: patio, accesibilidad, mascotas, estacionamiento, reuniones u otras.
7. Actividades de Cultura vinculadas con esa sede.

No repetir textos turísticos genéricos sobre ciudades. La ficha describe la casa y ayuda a visitarla. No presentar comodidades de una sucursal como atributos de toda la marca.

## 9. Arte y cultura: agenda, actividades y artistas

**Pregunta que resuelve:** qué sucede, cuándo, dónde y quién participa.

### Página principal

Una actividad destacada, próximas fechas y exposiciones vigentes. Filtros por ciudad, casa y disciplina: música, artes visuales/fotografía, encuentros y café. Los filtros se muestran cuando haya contenido que los justifique.

El archivo de actividades pasadas se consulta desde esta misma página. Una exposición con duración de varias semanas necesita fecha de inicio y fin; una sesión musical necesita su fecha y horario. No se confunden esos formatos.

### Ficha de actividad

Título, disciplina, estado temporal, fechas/horarios, casa, artista o participantes, explicación, cartel, condiciones de acceso y contacto o inscripción cuando existan. Las exposiciones incorporan obras y créditos; las actividades pasadas pueden incorporar fotografías y una reseña.

Cada actividad mantiene una sola ficha. Tras celebrarse, pasa al archivo y conserva su dirección. No se publica el mismo evento varias veces para llenar Agenda, Galería y Artistas.

### Artistas invitados

Perfiles con nombre, disciplina, retrato autorizado, biografía confirmada, selección de obras y actividades realizadas en Typica. La información describe su vínculo real: exposición, intervención, colaboración o presentación. No se atribuye una residencia o colaboración permanente sin confirmación.

Los perfiles nacen de las actividades y permiten descubrir el trabajo de sus autores. No hace falta un directorio vacío de nombres sin obra o contexto.

### Campeonato Aillio

El encuentro de junio de 2026 se trata como actividad pasada del área de café: contexto, categorías, fechas, resultados verificados y fotografías. Se enlaza desde Aillio × Typica y desde el archivo de Cultura. Una futura edición tendría su propia ficha y convocatoria, después de confirmarse.

## 10. Galería: archivo visual con contexto

**Pregunta que resuelve:** cómo se vive y qué ha ocurrido en Typica.

Página fotográfica para explorar casas, personas, preparación del café y actividad cultural. Las imágenes se agrupan por tema o casa y se abren con descripción, fecha cuando corresponda, autor/crédito y enlace a su contexto.

Una obra expuesta conserva el nombre del artista y el vínculo a la exposición. Una fotografía de un concierto enlaza a esa actividad. Una imagen de un patio puede llevar a su casa. La galería no reemplaza la agenda ni publica fotografías sueltas sin identificar.

No son obligatorias páginas individuales para cada foto. Los relatos amplios se resuelven en las fichas de casa o actividad ya existentes.

## 11. Tostaduría: servicio de tueste

**Pregunta que resuelve:** qué puede hacer Typica con mi café verde y cómo consultarlo.

1. Explicación directa del servicio publicado.
2. Fotografías reales del trabajo de selección y tueste.
3. Qué información preparar para una consulta: café, cantidad y objetivo del tueste.
4. Cómo se coordina el servicio, con condiciones confirmadas por el equipo.
5. Preguntas frecuentes basadas en sus condiciones reales.
6. Contacto específico de la tostaduría.

El proceso cuenta la experiencia de Typica. No se añaden tarifas, cantidades mínimas, tiempos de entrega, cursos, certificaciones o ventas mayoristas como servicios existentes sin validación.

## 12. Aillio × Typica: distribución y equipos

**Pregunta que resuelve:** qué es Aillio, qué relación tiene con Typica y a quién consultar.

1. Explicación sencilla: Aillio fabrica tostadoras; Typica aparece en su directorio de distribuidores de Bolivia.
2. Máquinas y usos: presentación de la línea Bullet y comparación breve de modelos con especificaciones del fabricante.
3. Qué se puede consultar con Typica: modelo, disponibilidad y condiciones comerciales locales.
4. El campeonato organizado con Aillio, con acceso a su ficha histórica.
5. Contacto comercial correcto y acceso a las fuentes oficiales del fabricante.

Inicialmente una página completa puede resolver la explicación y comparación; no hacen falta fichas vacías para cada modelo. No presentar un precio internacional como precio final en Bolivia. No prometer demostraciones, formación, garantía local o servicio técnico sin confirmar quién los presta y en qué condiciones.

## 13. Typica y páginas de utilidad

### Typica

Historia, relación con el café boliviano, personas detrás del proyecto, evolución de las casas y reconocimientos. Cada premio lleva año, edición y fuente. No convertir la home en una cronología completa ni mezclar puestos de años distintos.

### Trabaja con nosotros

Destino laboral explícito con vacantes o áreas confirmadas y formulario. La navegación actual usa «Nosotros» para un enlace que lleva al formulario de trabajo; la propuesta distingue la presentación de la marca de las postulaciones.

### Contacto

Orienta hacia una casa, tostaduría, Aillio o contacto general. Los contactos de las sucursales se mantienen en sus fichas. Una persona que busca horarios debe encontrar Casas y Carta antes de tener que enviar un mensaje.

### Privacidad y condiciones

Páginas con contenido aprobado y enlaces funcionales. Su alcance depende de los formularios y operaciones efectivamente incorporados; no se dejan enlaces a «#» aparentando documentos publicados.

## 14. Recorridos que debe permitir el sitio

| Intención | Recorrido propuesto |
|---|---|
| Quiero ver qué comer | Carta → elegir casa → categorías y precios. |
| Quiero visitar una sucursal | Casas → ficha → mapa, horario y carta contextual. |
| Quiero una bolsa de café | Cafés en bolsa → ficha → selección y canal de compra confirmado. |
| Quiero ver una exposición | Arte y cultura → actividad → artista, obras, fechas y local. |
| Quiero asistir a música en vivo | Arte y cultura → fecha → condiciones de acceso y contacto. |
| Vi una foto y quiero conocer el lugar | Galería → casa o actividad relacionada. |
| Necesito tostar mi café | Tostaduría → información del servicio → contacto especializado. |
| Busco una tostadora Aillio | Aillio × Typica → comparación → consulta comercial. |
| Quiero trabajar allí | Trabaja con nosotros → vacante/área → postulación. |

## 15. Contenido que se administra una sola vez

| Registro | Información principal | Dónde se reutiliza |
|---|---|---|
| Casa | Ubicación, contactos, horario, comodidades, fotos | Directorio, ficha, selección de carta, actividades. |
| Carta y productos | Categorías, productos, precios y variantes por casa | Carta seleccionada y muestra editorial de la home. |
| Café en bolsa | Empaque, trazabilidad, perfil, presentación y oferta vigente | Catálogo, ficha y destacado de home. |
| Actividad | Disciplina, fechas, casa, participantes, acceso, imágenes | Cultura, ficha, casa, artistas y destacado de home. |
| Artista | Identidad confirmada, biografía, obras y vínculos | Perfil y actividades relacionadas. |
| Imagen/serie | Autor, descripción y relación con casa/actividad/obra | Galería y páginas de contexto. |
| Reconocimiento | Premio, año, edición, puesto y fuente | Typica y, si se decide, una mención puntual en home. |
| Equipo Aillio | Modelo, especificaciones y fuente, contacto comercial | Página Aillio y consulta por modelo. |

La home selecciona registros existentes. No mantiene una segunda copia de precios, fechas o direcciones que pueda quedar desactualizada.

## 16. Migración y decisiones necesarias antes de publicar

1. Inventariar cartas actuales y obtener los precios, variantes y disponibilidad aprobados por sucursal. Migrar esos datos a HTML y comprobarlos con cada local.
2. Confirmar oferta de bolsas, presentaciones, precios y canal de pedido. Los precios ficticios del diseño no pasan al sitio publicado.
3. Revisar el directorio y contactos, incluyendo los destinos internacionales que ya enumera el sitio.
4. Confirmar programación vigente y reunir créditos/material de actividades históricas. Los eventos de 2023–2025 permanecen en archivo.
5. Confirmar condiciones del servicio de tueste y alcance comercial local de Aillio.
6. Redirigir las direcciones actuales a sus destinos equivalentes. Por ejemplo, `/locales` al directorio nuevo y `/dopocachi` a la ficha correctamente nombrada de Sopocachi. Preservar enlaces externos a cartas y actividades mediante una migración planificada.
7. Revisar fuentes, textos institucionales y documentos legales. Publicar únicamente páginas con contenido suficiente y acciones reales.

No se incorporan de partida blog genérico, franquicias, membresías, cursos, tienda de entradas o envíos internacionales: la investigación realizada no acredita esas ofertas. Podrán añadirse con contenido y operación confirmados, sin cambiar la estructura central.
