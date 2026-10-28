(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const G=window.gsap, hasMotion=!!(G&&window.ScrollTrigger);
  if(G){const plugins=[window.ScrollTrigger,window.SplitText,window.Flip].filter(Boolean);G.registerPlugin(...plugins);}
  const animated=()=>G&&!reduced.matches;
  const catalog=[
    {id:'gesha',name:'Gesha',back:'GESHA',description:'Floral, delicado y con mucho que contar.',origin:'Caranavi · La Herminia',process:'Lavado',notes:'Jazmín, lavanda, piña y mandarina.',image:'Image.png',price:145,ground:'#f6b9d7'},
    {id:'java',name:'Java',back:'JAVA',description:'Flores blancas, fruta y una taza brillante.',origin:'Coroico · Nora Gemio',process:'Lavado',notes:'Naranja, limón, guayaba y chirimoya.',image:'Image-1.png',price:95,ground:'#ffd4b0'},
    {id:'blend',name:'Blend de la casa',back:'BLEND',description:'Tan paceño como mirar el Illimani al amanecer.',origin:'Bolivia · Selección de la casa',process:'Blend para el día a día',notes:'Un perfil equilibrado, para volver todos los días.',image:'Image-2.png',price:75,ground:'#ffe99b'},
    {id:'ipr',name:'IPR-103',back:'IPR–103',description:'Frutas maduras y dulzura de los valles.',origin:'Mairana · Finca Arlet',process:'Honey · Orgánico',notes:'Guayaba, durazno deshidratado, papaya y miel.',image:'Image-3.png',price:110,ground:'#cae7dc'}
  ];
  const money=value=>'Bs '+value.toLocaleString('es-BO');
  window.typicaCoffeeCatalog = catalog;
  const credits = $('#credits-dialog');
  let creditsFocus = null;
  $('#open-credits')?.addEventListener('click', () => {
    creditsFocus = document.activeElement;
    credits.showModal();
    document.body.style.overflow = 'hidden';
  });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => $('#' + button.dataset.close)?.close()));
  credits?.addEventListener('close', () => { document.body.style.overflow = ''; creditsFocus?.focus({preventScroll:true}); });
  $$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }));

  function setDetails(card, open, source) {
    const product = catalog.find(product => product.id === card.dataset.coffee);
    const options = card.querySelector('.coffee-product-options');
    const toggle = card.querySelector('[data-coffee-toggle]');
    card.classList.toggle('is-open', open);
    options.hidden = !open;
    card.querySelectorAll('.coffee-product-visual,.coffee-product-foot,.coffee-product-watermark,.coffee-sample-note').forEach(element => { element.hidden = open; });
    card.querySelectorAll('[data-coffee-toggle],[data-open-coffee]').forEach(button => button.setAttribute('aria-expanded', String(open)));
    toggle.setAttribute('aria-label', `${open ? 'Cerrar' : 'Ver'} detalles de ${product.name}`);
    if (open && source !== toggle) options.querySelector('select').focus({preventScroll:true});
    if (!open && options.contains(document.activeElement)) toggle.focus({preventScroll:true});
    if (open && animated()) G.fromTo(options, {opacity:0,y:10}, {opacity:1,y:0,duration:.22,ease:'power3.out',overwrite:true,clearProps:'opacity,transform'});
  }
  $$('[data-coffee-toggle]').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.coffee-product');
    setDetails(card, !card.classList.contains('is-open'), button);
  }));
  $$('[data-open-coffee]').forEach(button => button.addEventListener('click', () => setDetails(button.closest('.coffee-product'), true, button)));
  $$('.coffee-product').forEach(card => card.addEventListener('keydown', event => {
    if (event.key === 'Escape' && card.classList.contains('is-open')) {
      event.preventDefault(); setDetails(card, false); card.querySelector('[data-coffee-toggle]').focus({preventScroll:true});
    }
  }));
  $$('[data-coffee-order]').forEach(form => {
    const product = catalog.find(product => product.id === form.dataset.coffeeOrder);
    const count = form.querySelector('.coffee-inline-count');
    const status = form.querySelector('.coffee-inline-status');
    let quantity = 1;
    const update = () => {
      count.textContent = quantity;
      form.querySelector('[data-quantity-step="-1"]').disabled = quantity === 1;
      form.querySelector('[data-quantity-step="1"]').disabled = quantity === 12;
      form.querySelector('.coffee-inline-total').textContent = money(product.price * quantity);
    };
    form.querySelectorAll('[data-quantity-step]').forEach(button => button.addEventListener('click', () => {
      quantity = Math.max(1, Math.min(12, quantity + Number(button.dataset.quantityStep)));
      update();
    }));
    form.addEventListener('submit', event => {
      event.preventDefault();
      document.dispatchEvent(new CustomEvent('typica:add-to-cart', {detail:{id:product.id, quantity, grind:form.elements.grind.value}}));
      status.textContent = `${quantity} ${quantity === 1 ? 'bolsa añadida' : 'bolsas añadidas'} al carrito.`;
    });
    update();
  });
})();
