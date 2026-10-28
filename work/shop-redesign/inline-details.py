from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
page = (root / 'index.html').read_text(encoding='utf-8')
descriptions = {
    'gesha': 'Floral, delicado y con mucho que contar. Un café de La Herminia, en Caranavi, de proceso lavado. En la taza: jazmín, lavanda, piña y mandarina. Un origen boliviano para disfrutar con calma.',
    'java': 'Flores blancas, fruta y una taza brillante. Cultivado por Nora Gemio en Coroico y de proceso lavado. Sus notas de naranja, limón, guayaba y chirimoya acompañan tu ritual de cada día.',
    'blend': 'Nuestra selección para el café de todos los días. Un perfil equilibrado, tan paceño como mirar el Illimani al amanecer. El blend de Typica para hacer de una buena taza una costumbre.',
    'ipr': 'Frutas maduras y dulzura de los valles. Desde la Finca Arlet, en Mairana, un café de proceso honey con notas de guayaba, durazno, papaya y miel. Dulce, tropical y con carácter propio.'
}
names = {'gesha':'Gesha','java':'Java','blend':'De la casa','ipr':'IPR-103'}
prices = {'gesha':145,'java':95,'blend':75,'ipr':110}

def edit_card(match):
    card = match.group(0)
    id = re.search(r'data-coffee="([^"]+)"',card).group(1)
    name = names[id]
    card = re.sub(r'<button class="coffee-quick-add".*?</button>', f'<button class="coffee-quick-add" type="button" data-coffee-toggle="{id}" aria-label="Ver detalles de {name}" aria-expanded="false" aria-controls="coffee-options-{id}"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path class="toggle-vertical" d="M12 5v14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>', card, count=1, flags=re.S)
    for trigger in ['coffee-product-visual','coffee-product-details']:
        card = card.replace(f'class="{trigger}" type="button"',f'class="{trigger}" type="button" aria-expanded="false" aria-controls="coffee-options-{id}"')
    form = f'''<div class="coffee-product-options" id="coffee-options-{id}" hidden>
      <p class="coffee-product-description">{descriptions[id]}</p>
      <form class="coffee-order-form" data-coffee-order="{id}" aria-label="Elegir {name}">
        <div class="coffee-option-row"><label for="weight-{id}">Peso</label><select id="weight-{id}" name="weight"><option value="250">250 g</option></select></div>
        <div class="coffee-option-row"><label for="grind-{id}">Molienda</label><select id="grind-{id}" name="grind"><option>En grano</option><option>Molido para filtro</option><option>Molido para espresso</option><option>Molido para prensa</option></select></div>
        <div class="coffee-option-row"><span id="quantity-label-{id}">Cantidad</span><div class="coffee-inline-quantity" role="group" aria-labelledby="quantity-label-{id}"><button type="button" data-quantity-step="-1" aria-label="Reducir cantidad de {name}" disabled>−</button><output class="coffee-inline-count" aria-label="Bolsas de {name}" aria-live="polite">1</output><button type="button" data-quantity-step="1" aria-label="Aumentar cantidad de {name}">+</button></div></div>
        <button class="coffee-inline-add" type="submit"><span>Añadir al carrito</span><output class="coffee-inline-total">Bs {prices[id]}</output></button>
        <p class="coffee-inline-note">250 g · Precio de muestra</p>
        <p class="sr-only coffee-inline-status" role="status" aria-live="polite"></p>
      </form>
    </div>'''
    return card.replace('</article>', form + '</article>')

page = re.sub(r'<article class="coffee-product coffee-product-.*?</article>',edit_card,page,flags=re.S)
(root / 'index.html').write_text(page,encoding='utf-8')
for name in ['index.html','sucursales.html','suscripciones.html']:
    path = root / name
    html = path.read_text(encoding='utf-8')
    html = re.sub(r'<dialog class="coffee-dialog".*?</dialog>','',html,flags=re.S)
    path.write_text(html,encoding='utf-8')
print('The plus now opens inline product details; the old product modal was removed.')
