from pathlib import Path
import re
from html import escape

root = Path(__file__).resolve().parents[2]
page = (root / 'index.html').read_text(encoding='utf-8')
old_js = (root / 'js/typica.js').read_text(encoding='utf-8')
split_at = old_js.index("  const video=$('#typica-film')")
shop = old_js[:split_at]
shop = shop.replace("button.closest('.coffee-panel').querySelector('.poster-pack')", "button.closest('.coffee-product')?.querySelector('.coffee-product-visual img')")
shop = shop.replace('if(animated()&&window.Flip){', 'if(source&&animated()&&window.Flip){')
shop += '''
  const quickTimers = new WeakMap();
  $$('[data-quick-add]').forEach(button => button.addEventListener('click', () => {
    const product = catalog.find(product => product.id === button.dataset.quickAdd);
    if (!product) return;
    document.dispatchEvent(new CustomEvent('typica:add-to-cart', { detail: { id: product.id, quantity: 1, grind: 'En grano' } }));
    clearTimeout(quickTimers.get(button));
    button.classList.add('is-added');
    button.setAttribute('aria-label', product.name + ' añadido. Añadir otra bolsa de 250 g en grano');
    button.querySelector('.quick-plus').hidden = true;
    button.querySelector('.quick-check').hidden = false;
    quickTimers.set(button, setTimeout(() => {
      button.classList.remove('is-added');
      button.setAttribute('aria-label', 'Añadir una bolsa de ' + product.name + ', 250 g en grano, al carrito');
      button.querySelector('.quick-plus').hidden = false;
      button.querySelector('.quick-check').hidden = true;
    }, 1800));
  }));
})();
'''
(root / 'js/coffee-shop.js').write_text(shop, encoding='utf-8')
motion_prefix = old_js[:old_js.index('  const catalog=[')]
(root / 'js/typica.js').write_text(motion_prefix + old_js[split_at:], encoding='utf-8')

arrow = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 16h21M17 6l10 10-10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
plus = '<svg class="quick-plus" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5v14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><svg class="quick-check" viewBox="0 0 24 24" fill="none" aria-hidden="true" hidden><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def tile(letter, image, color):
    return f'<button class="coffee-tile" type="button" aria-label="Girar la letra {letter}" aria-pressed="false" style="--tile-color:{color}"><span class="tile-turn" aria-hidden="true"><span class="tile-front">{letter}</span><span class="tile-back"><img src="assets/stickers/{image}.svg" alt="" width="150" height="150" loading="lazy"></span></span></button>'

cover = f'''<div class="coffee-cover">
  <h2 class="sr-only" id="coffee-scene-title">Café en bolsa. De Bolivia a tu casa.</h2>
  <div class="coffee-cover-grid">
    <button class="cover-arrow" type="button" data-coffee-browse aria-label="Explorar los cafés">{arrow}</button>
    {tile('C','Frame-1','#ff5fa0')}{tile('A','Frame-3','#ffe52d')}{tile('F','Frame-6','#c8ded8')}{tile('É','Frame','#f3bbd3')}
    <figure class="cover-photo cover-photo-top"><img src="assets/official/tostador.avif" alt="El oficio del tueste en Typica" width="1500" height="1000" loading="lazy"></figure>
    <figure class="cover-photo cover-photo-tall"><img src="assets/official/barista.avif" alt="Una barista de Typica, del café a la taza" width="1500" height="1000" loading="lazy"><span>EN</span></figure>
    {tile('B','Frame-4','#c8ded8')}{tile('O','Frame-2','#ffe52d')}{tile('L','Frame-5','#f3bbd3')}{tile('S','Frame-1','#ffe52d')}{tile('A','Frame-3','#ff5fa0')}
    <div class="cover-message"><p>De Bolivia<br>a tu primera taza.</p><img src="assets/stickers/Frame.svg" alt="" aria-hidden="true" width="145" height="138" loading="lazy"></div>
  </div>
  <div class="coffee-cover-bottom"><span>Buen café. También en casa.</span><button type="button" data-coffee-browse>Desliza y encuentra el tuyo {arrow}</button></div>
</div>'''
products = [
    ('gesha','Gesha','Caranavi · La Herminia','Jazmín, lavanda, piña y mandarina','Image.png','145','Floral. Delicado.'),
    ('java','Java','Coroico · Nora Gemio','Flores blancas, cítricos y fruta','Image-1.png','95','Frutal. Brillante.'),
    ('blend','De la casa','Bolivia · Selección Typica','Un perfil equilibrado para todos los días','Image-2.png','75','Tu café de siempre.'),
    ('ipr','IPR-103','Mairana · Finca Arlet','Guayaba, papaya, durazno y miel','Image-3.png','110','Dulce. Tropical.'),
]
cards = ''
for id, name, origin, notes, image, price, flavor in products:
    cards += f'''<article class="coffee-product coffee-product-{id}" data-coffee="{id}" aria-labelledby="product-{id}">
      <div class="coffee-product-head"><p class="coffee-product-notes">{notes}</p><h3 id="product-{id}">{name}</h3><p class="coffee-product-origin">{origin}</p><button class="coffee-quick-add" type="button" data-quick-add="{id}" aria-label="Añadir una bolsa de {name}, 250 g en grano, al carrito" title="Añadir 250 g en grano">{plus}</button></div>
      <button class="coffee-product-visual" type="button" data-open-coffee="{id}" aria-label="Conocer {name} y elegir molienda"><img src="assets/products/{image}" alt="Bolsa de café {name} de Typica" width="500" height="500" loading="lazy"></button>
      <span class="coffee-product-watermark" aria-hidden="true">{name.upper()}</span>
      <div class="coffee-product-foot"><p class="coffee-product-price">Bs {price}<span>250 g · En grano</span></p><button class="coffee-product-details" type="button" data-open-coffee="{id}">Elegir molienda {arrow}</button></div>
      <p class="coffee-sample-note">Precio de muestra</p>
    </article>'''
section = f'''<section class="coffee-showcase" id="cafes" aria-labelledby="coffee-scene-title"><div class="coffee-viewport" tabindex="0" role="region" aria-label="Cafés en bolsa. Desliza para explorar."><div class="coffee-track">{cover}{cards}</div><div class="coffee-rail-nav" role="group" aria-label="Recorrer los cafés"><button type="button" data-coffee-step="-1" aria-label="Café anterior" disabled><span style="display:flex;transform:rotate(180deg)">{arrow}</span></button><button type="button" data-coffee-step="1" aria-label="Café siguiente">{arrow}</button></div></div></section>'''
start = page.index('<section class="coffee-section coffee-carousel"')
end = page.index('<section class="people-section"', start)
page = page[:start] + section + '\n' + page[end:]

promos = f'''<section class="visit-pair" id="espacios" aria-label="En Typica o en casa">
  <a class="visit-panel visit-houses" href="sucursales.html"><img src="assets/casa-santa-cruz.png" alt="La barra de una casa Typica, llena de objetos e historias" width="2400" height="1350" loading="lazy"><div class="visit-panel-copy"><h2>Siempre hay<br>una casa cerca.</h2><span class="visit-panel-link">Encuentra tu Typica {arrow}</span></div></a>
  <a class="visit-panel visit-subscriptions" href="suscripciones.html"><img src="assets/official/granos.avif" alt="Café de especialidad recién tostado para preparar en casa" width="1500" height="1500" loading="lazy"><img class="visit-pack" src="assets/products/Image-1.png" alt="Bolsa de café Java de Typica" width="500" height="500" loading="lazy"><div class="visit-panel-copy"><h2>Tu café.<br>A tu ritmo.</h2><span class="visit-panel-link">Explora las suscripciones {arrow}</span></div></a>
</section>'''
start = page.index('<section class="houses-section"')
end = page.index('</main>', start)
page = page[:start] + promos + '\n' + page[end:]

nav = '''<nav class="nav-primary" aria-label="Navegación principal">
<a href="#cafes">Cafés en bolsa</a>
<details class="nav-dropdown"><summary>Sucursales <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5"/></svg></summary><div class="nav-dropdown-panel"><a href="sucursales.html">Todas las sucursales <span>↗</span></a><a href="sucursales.html#la-paz">La Paz</a><a href="sucursales.html#cochabamba">Cochabamba</a><a href="sucursales.html#santa-cruz">Santa Cruz</a><a href="sucursales.html#mas-casas">Más ciudades</a></div></details>
<a href="suscripciones.html">Suscripciones</a><a href="#cultura">Cultura</a>
</nav>'''
page = re.sub(r'<nav class="nav-primary".*?</nav>', nav, page, count=1, flags=re.S)
page = page.replace('<a href="#espacios" data-menu-preview="espacios">', '<a href="sucursales.html" data-menu-preview="espacios">')
page = page.replace('<span class="menu-link-title">Espacios</span>', '<span class="menu-link-title">Sucursales</span>')
page = page.replace('<a href="#cultura" data-menu-preview="cultura">', '<a href="suscripciones.html" data-menu-preview="suscripciones"><span class="menu-link-title">Suscripciones</span><span class="menu-link-note">Tu café, a tu ritmo</span></a><a href="#cultura" data-menu-preview="cultura">')
page = page.replace('href="#espacios"', 'href="sucursales.html"')
page = page.replace('<li><a href="#cafes">Cafés en bolsa</a></li>', '<li><a href="#cafes">Cafés en bolsa</a></li><li><a href="suscripciones.html">Suscripciones</a></li>')
page = page.replace('<link rel="stylesheet" href="css/coffee-carousel.css">', '<link rel="stylesheet" href="css/coffee-showcase.css"><link rel="stylesheet" href="css/experiences.css">')
page = page.replace('<script defer src="js/typica.js">', '<script defer src="js/coffee-shop.js"></script><script defer src="js/typica.js">')
page = page.replace('js/coffee-carousel.js', 'js/coffee-showcase.js')
(root / 'index.html').write_text(page, encoding='utf-8')

header = page[page.index('<a class="skip"'):page.index('<main id="contenido">')]
footer = page[page.index('<footer class="footer"'):page.index('</body>')]
for hash in ['#cafes','#cultura','#de-cerca','#inicio']:
    header = header.replace(f'href="{hash}"', f'href="index.html{hash}"')
    footer = footer.replace(f'href="{hash}"', f'href="index.html{hash}"')
head = '''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} · Typica</title><meta name="description" content="{description}"><meta name="theme-color" content="#ffffff"><link rel="stylesheet" href="assets/fonts/epilogue.css"><link rel="stylesheet" href="assets/fonts/serif.css"><link rel="stylesheet" href="css/typica.css"><link rel="stylesheet" href="css/navigation.css"><link rel="stylesheet" href="css/experiences.css"><script defer src="assets/vendor/gsap.min.js"></script><script defer src="assets/vendor/Flip.min.js"></script><script defer src="js/coffee-shop.js"></script><script defer src="js/navigation.js"></script><script defer src="js/experiences.js"></script></head><body class="inner-page">'''

locations = [
    ('la-paz','La Paz','assets/official/la-paz.avif','San Miguel · Sopocachi · Centro · Satélite · Miraflores · Plaza 21 Mall · Obrajes · Achumani','Entre patios, casonas y una buena taza.','Bolivia'),
    ('cochabamba','Cochabamba','assets/casa-cochabamba.jpg','España · Fidel Anze · Portales','Un café y tiempo para quedarte.','Bolivia'),
    ('santa-cruz','Santa Cruz','assets/casa-santa-cruz.png','Equipetrol','Tu pausa entre plantas e historias.','Bolivia'),
]
location_cards = ''
for id,name,image,branches,description,country in locations:
    location_cards += f'''<article class="location-card" id="{id}" data-city="{id}"><div class="location-image"><img src="{image}" alt="Casa Typica en {name}" width="1200" height="900" loading="lazy"></div><div class="location-copy"><div><h2>{name}</h2><p>{description}</p></div><p class="location-branches">{branches}</p><a class="location-link" href="https://www.typica.com.bo/locales" target="_blank" rel="noopener">Direcciones, horarios y carta {arrow}</a></div></article>'''
more_cities = [('oruro','Oruro','Soria Galvarro · Junín','Bolivia'),('sucre','Sucre','Azurduy','Bolivia'),('asuncion','Asunción','Asunción','Paraguay'),('florianopolis','Florianópolis','Florianópolis','Brasil')]
more = ''.join(f'<article class="location-city" id="{id}" data-city="{id}"><p>{country}</p><h2>{name}</h2><p>{branches}</p><a href="https://www.typica.com.bo/locales" target="_blank" rel="noopener">Ver sucursales {arrow}</a></article>' for id,name,branches,country in more_cities)
branches_body = f'''<main id="contenido"><section class="locations-intro"><h1>Encuentra<br>tu Typica.</h1><div><p>Cada casa tiene su propia mezcla.<br>El buen café nos encuentra en todas.</p><img src="assets/stickers/Frame-2.svg" alt="" aria-hidden="true" width="130" height="130"></div></section><section class="locations-directory" aria-label="Directorio de sucursales"><div class="city-filters" role="group" aria-label="Filtrar por ciudad"><button type="button" data-city-filter="all" aria-pressed="true">Todas</button><button type="button" data-city-filter="la-paz" aria-pressed="false">La Paz</button><button type="button" data-city-filter="cochabamba" aria-pressed="false">Cochabamba</button><button type="button" data-city-filter="santa-cruz" aria-pressed="false">Santa Cruz</button><button type="button" data-city-filter="mas" aria-pressed="false">Más ciudades</button></div><p class="sr-only" id="location-status" role="status" aria-live="polite"></p><div class="locations-grid">{location_cards}</div><div class="more-locations" id="mas-casas">{more}</div><p class="directory-note">Consulta dirección, horario y carta de cada casa en el directorio oficial de Typica.</p></section></main>'''
(root / 'sucursales.html').write_text(head.format(title='Sucursales',description='Encuentra tu casa Typica en La Paz, Cochabamba, Santa Cruz y más ciudades. Consulta los locales, su carta y cómo visitarlos.') + header + branches_body + footer + '</body></html>',encoding='utf-8')

subscription_body = f'''<main id="contenido"><section class="subscription-scene" aria-labelledby="subscription-title"><div class="subscription-photo"><img class="subscription-ground" src="assets/official/granos.avif" alt="Café boliviano recién tostado" width="1500" height="1500"><img class="subscription-pack" id="subscription-pack" src="assets/products/Image.png" alt="Bolsa de café Gesha de Typica" width="500" height="500"><img class="subscription-sticker" src="assets/stickers/Frame-1.svg" alt="" aria-hidden="true" width="130" height="130"><p>Buen café.<br>Buena costumbre.</p></div><div class="subscription-copy"><h1 id="subscription-title">Tu café.<br>A tu ritmo.</h1><p>Hay rituales que vale la pena repetir. Elige tu café y cuéntanos cada cuánto te gustaría recibirlo.</p><form class="subscription-form" id="subscription-form"><label>Tu café<select id="subscription-coffee" name="cafe"><option value="gesha">Gesha · Floral y delicado</option><option value="java">Java · Frutal y brillante</option><option value="blend">Blend de la casa · Tu café de siempre</option><option value="ipr">IPR-103 · Dulce y tropical</option></select></label><div class="subscription-fields"><label>Cantidad<select id="subscription-quantity" name="cantidad"><option value="1">1 bolsa de 250 g</option><option value="2">2 bolsas de 250 g</option><option value="3">3 bolsas de 250 g</option><option value="4">4 bolsas de 250 g</option></select></label><label>Frecuencia<select id="subscription-frequency" name="frecuencia"><option>Cada dos semanas</option><option>Cada mes</option></select></label></div><label>¿Cómo lo preparas?<select id="subscription-grind" name="molienda"><option>En grano</option><option>Molido para filtro</option><option>Molido para espresso</option><option>Molido para prensa</option></select></label><p class="subscription-summary" id="subscription-summary">1 bolsa de Gesha, cada dos semanas.</p><button class="cut-button yellow-button" type="submit"><span class="button-label">Preparar mi consulta</span><span class="button-icon">{arrow}</span></button><p class="subscription-note">Consulta con Typica la disponibilidad, el precio y la entrega de este servicio.</p><div class="subscription-result" id="subscription-result" hidden><p>Tu selección está lista para consultar.</p><textarea id="subscription-message" rows="5" readonly aria-label="Tu consulta de suscripción"></textarea><button type="button" id="subscription-copy">Copiar consulta</button><a href="https://linktr.ee/typicacafetostaduria" target="_blank" rel="noopener">Contactar con Typica {arrow}</a><p id="subscription-status" role="status" aria-live="polite"></p></div></form></div></section></main>'''
(root / 'suscripciones.html').write_text(head.format(title='Suscripciones',description='Elige tu café Typica, la molienda y la frecuencia que va contigo. Prepara tu consulta de suscripción de café boliviano de especialidad.') + header + subscription_body + footer + '</body></html>',encoding='utf-8')
print('Home, shared coffee shop, branches page and subscription page created.')
