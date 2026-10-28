(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const header = $('#nav'), menu = $('#menu'), toggle = $('#menu-toggle');
  const cart = $('#cart-dialog'), cartToggle = $('#cart-toggle');
  if (!header || !menu || !cart) return;
  const G = window.gsap;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animate = () => G && !reduced.matches;
  const catalog = window.typicaCoffeeCatalog || [];
  const grinds = ['En grano','Molido para filtro','Molido para espresso','Molido para prensa'];
  const storageKey = 'typica-cart-v1';
  const money = amount => 'Bs ' + amount.toLocaleString('es-BO');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const main = $('main'), footer = $('footer'), primary = $('.nav-primary');
  let menuOpen = false, menuMotion = null, menuFocus = null, cartFocus = null;
  let cartMotion = null, noticeTimer = null, menuPreview = 'cafes';
  let lastY = Math.max(0, scrollY), direction = 0, travelled = 0, scrollFrame = 0;
  const previews = {
    cafes: {image:'assets/products/Image.png',alt:'Bolsa de café Gesha de Typica',sticker:'assets/stickers/Frame.svg',caption:'Tu próxima taza empieza aquí.',color:'#efbcd2'},
    espacios: {image:'assets/official/la-paz.avif',alt:'La entrada de una casa Typica en La Paz',sticker:'assets/stickers/Frame-2.svg',caption:'Hay una casa que va contigo.',color:'#cee3b8'},
    cultura: {image:'assets/official/barra.avif',alt:'El interior de Typica, entre plantas y objetos de la casa',sticker:'assets/stickers/truus.co-39.svg',caption:'El café es la excusa. Lo demás pasa aquí.',color:'#f0a7b8'},
    typica: {image:'assets/official/barista.avif',alt:'Una barista de Typica preparando un café',sticker:'assets/stickers/Frame-5.svg',caption:'Café de aquí. Hecho con mucho cariño.',color:'#c9dedc'}
  };

  function showHeader() { header.classList.remove('nav-is-hidden'); travelled = 0; }
  function updateTone() {
    const sample = header.getBoundingClientRect().height / 2 + 18;
    const section = $$('main>section,footer').find(el=>{const r=el.getBoundingClientRect();return r.top<=sample && r.bottom>sample;});
    let node=section, rgb=null;
    while(node && !rgb) {
      const color=getComputedStyle(node).backgroundColor;
      if(color!=='transparent' && color!=='rgba(0, 0, 0, 0)') rgb=color.match(/[\d.]+/g)?.slice(0,3).map(Number);
      node=node.parentElement;
    }
    const light=rgb && (.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2])<135;
    header.dataset.tone=light?'light':'dark';
  }
  function updateScroll() {
    scrollFrame = 0;
    updateTone();
    const y = Math.max(0, scrollY), change = y - lastY;
    lastY = y;
    if (menuOpen || document.querySelector('dialog[open]') || header.querySelector(':focus-visible') || y < 90) {
      showHeader(); return;
    }
    if (Math.abs(change) < 2) return;
    const nextDirection = Math.sign(change);
    travelled = nextDirection === direction ? travelled + Math.abs(change) : Math.abs(change);
    direction = nextDirection;
    if (change > 0 && y > 170 && travelled > 24) header.classList.add('nav-is-hidden');
    else if (change < 0 && travelled > 9) showHeader();
  }
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, {passive:true});
  header.addEventListener('focusin', showHeader);
  document.addEventListener('typica:add-to-cart', showHeader);

  function lockMenu(value) {
    document.body.classList.toggle('nav-overlay-open', value);
    document.body.classList.toggle('menu-open', value);
    main.inert = value; footer.inert = value; primary.inert = value;
    $('.skip').inert = value;
  }
  function buttonClip() {
    const r = toggle.getBoundingClientRect();
    return `inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px)`;
  }
  function syncToggle() {
    toggle.setAttribute('aria-expanded', String(menuOpen));
    toggle.firstElementChild.textContent = menuOpen ? 'cerrar' : 'menú';
    if (G) {
      G.to('.burger i:first-child', {y:menuOpen?4:0,rotation:menuOpen?45:0,duration:reduced.matches?0:.25,overwrite:true});
      G.to('.burger i:last-child', {y:menuOpen?-4:0,rotation:menuOpen?-45:0,duration:reduced.matches?0:.25,overwrite:true});
    } else toggle.classList.toggle('is-open', menuOpen);
  }
  function openMenu() {
    if (menuOpen) return;
    showHeader(); menuFocus = document.activeElement; menuOpen = true;
    lockMenu(true); menu.inert = false; menu.setAttribute('aria-hidden','false'); syncToggle();
    menuMotion?.kill();
    const first = menu.querySelector('nav a');
    if (!animate()) { menu.style.visibility='visible'; menu.style.clipPath='none'; first.focus({preventScroll:true}); return; }
    menuMotion = G.timeline({onComplete:()=>{if(menuOpen)first.focus({preventScroll:true});}})
      .fromTo(menu,{visibility:'visible',clipPath:buttonClip()},{clipPath:'inset(0px 0px 0px 0px)',duration:.56,ease:'power4.inOut'})
      .fromTo('.menu-link-title',{x:60,scale:.94,autoAlpha:0},{x:0,scale:1,autoAlpha:1,stagger:.055,duration:.58,ease:'power4.out'},.18)
      .fromTo('.menu-link-note',{y:12,autoAlpha:0},{y:0,autoAlpha:1,stagger:.045,duration:.4,ease:'power3.out'},.3)
      .fromTo('.menu-preview',{clipPath:'inset(0 -50px 100% -50px)',y:30},{clipPath:'inset(0 -50px -50px -50px)',y:0,duration:.65,ease:'power4.out',clearProps:'clipPath'},.22)
      .fromTo('.menu-bottom',{autoAlpha:0},{autoAlpha:1,duration:.35},.42);
  }
  function closeMenu(restore=true) {
    if (!menuOpen) return;
    menuOpen=false; menu.inert=true; menu.setAttribute('aria-hidden','true');
    lockMenu(false); syncToggle(); menuMotion?.kill();
    if (restore) (menuFocus || toggle).focus({preventScroll:true});
    if (!animate()) { menu.style.visibility='hidden'; return; }
    menuMotion=G.to(menu,{clipPath:buttonClip(),duration:.42,ease:'power4.inOut',onComplete:()=>{if(!menuOpen)menu.style.visibility='hidden';}});
  }
  toggle.addEventListener('click',()=>menuOpen?closeMenu():openMenu());

  function changePreview(key) {
    if (key===menuPreview || !previews[key]) return;
    menuPreview=key;
    const data=previews[key], figure=$('.menu-preview'), image=$('#menu-preview-photo'), sticker=$('#menu-preview-sticker');
    $$('[data-menu-preview]').forEach(link=>link.classList.toggle('is-active',link.dataset.menuPreview===key));
    figure.dataset.preview=key; image.src=data.image; image.alt=data.alt;
    sticker.src=data.sticker; $('#menu-preview-caption').textContent=data.caption;
    $('.menu-preview-image').style.backgroundColor=data.color;
    if (animate()) {
      G.fromTo(image,{clipPath:'inset(0 0 100% 0)',scale:1.04},{clipPath:'inset(0 0 0% 0)',scale:1,duration:.45,ease:'power3.out',overwrite:true});
      G.fromTo(sticker,{scale:.4,rotation:15},{scale:1,rotation:-10,duration:.5,ease:'power3.out',overwrite:true});
    }
  }
  $$('[data-menu-preview]').forEach(link=>{
    link.addEventListener('pointerenter',()=>changePreview(link.dataset.menuPreview));
    link.addEventListener('focus',()=>changePreview(link.dataset.menuPreview));
  });
  document.addEventListener('keydown',event=>{
    if (!menuOpen) return;
    if (event.key==='Escape') { event.preventDefault(); closeMenu(); return; }
    if (event.key!=='Tab') return;
    const focusable=[...header.querySelectorAll('a,button'),...menu.querySelectorAll('a,button')].filter(el=>!el.closest('[inert]') && el.getClientRects().length);
    const first=focusable[0], last=focusable.at(-1);
    if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement===last) {event.preventDefault();first.focus();}
  });

  function normalise(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(item=>item && catalog.some(p=>p.id===item.id) && grinds.includes(item.grind) && Number.isInteger(item.quantity) && item.quantity>0 && item.quantity<=99)
      .map(({id,grind,quantity})=>({id,grind,quantity}));
  }
  let items=[];
  try {items=normalise(JSON.parse(localStorage.getItem(storageKey)||'[]'));} catch { /* The cart still works when storage is unavailable. */ }
  const minusIcon='<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  const plusIcon='<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M10 4v12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  function renderCart() {
    const count=items.reduce((sum,item)=>sum+item.quantity,0);
    $('.cart-count').textContent=count;
    $('.cart-head-count').textContent=count+' '+(count===1?'bolsa':'bolsas');
    cartToggle.setAttribute('aria-label',`Abrir carrito, ${count} ${count===1?'bolsa':'bolsas'}`);
    $('#cart-empty').hidden=!!items.length; $('#cart-summary').hidden=!items.length;
    $('#cart-items').innerHTML=items.map((item,index)=>{
      const p=catalog.find(product=>product.id===item.id);
      return `<article class="cart-item" role="listitem"><div class="cart-item-photo"><img src="assets/products/${escape(p.image)}" alt="Bolsa de café ${escape(p.name)}" width="120" height="132"></div><div><h3>${escape(p.name)}</h3><p>250 g · ${escape(item.grind)}</p><p class="cart-item-price">${money(p.price*item.quantity)}</p><div class="cart-item-tools"><div class="cart-quantity"><button data-cart-step="-1" data-index="${index}" aria-label="Quitar una bolsa de ${escape(p.name)}" ${item.quantity===1?'disabled':''}>${minusIcon}</button><output>${item.quantity}</output><button data-cart-step="1" data-index="${index}" aria-label="Añadir una bolsa de ${escape(p.name)}" ${item.quantity===99?'disabled':''}>${plusIcon}</button></div><button class="cart-remove" data-cart-remove="${index}" aria-label="Eliminar ${escape(p.name)} del carrito">Eliminar</button></div></div></article>`;
    }).join('');
    const total=items.reduce((sum,item)=>sum+catalog.find(p=>p.id===item.id).price*item.quantity,0);
    $('#cart-total').textContent=money(total);
    $('#cart-copy .button-label').textContent='Copiar mi pedido';
  }
  function saveCart() {try {localStorage.setItem(storageKey,JSON.stringify(items));} catch {} renderCart();}
  function openCart() {
    closeMenu(false); showHeader(); cartFocus=document.activeElement;
    $('#cart-notice').hidden=true; clearTimeout(noticeTimer);
    cartMotion?.kill(); cart.showModal(); document.body.style.overflow='hidden';
    if (animate()) cartMotion=G.fromTo(cart,{xPercent:100},{xPercent:0,duration:.45,ease:'power4.out',clearProps:'transform'});
    $('#cart-close').focus({preventScroll:true});
  }
  function closeCart() {
    if (!cart.open) return;
    cartMotion?.kill();
    if (!animate()) {cart.close();return;}
    cartMotion=G.to(cart,{xPercent:100,duration:.3,ease:'power3.in',onComplete:()=>{cart.close();G.set(cart,{clearProps:'transform'});}});
  }
  cart.addEventListener('close',()=>{document.body.style.overflow='';(cartFocus?.isConnected?cartFocus:cartToggle).focus({preventScroll:true});showHeader();});
  cart.addEventListener('cancel',event=>{event.preventDefault();closeCart();});
  cartToggle.addEventListener('click',openCart); $('#cart-close').addEventListener('click',closeCart);
  $('#cart-notice-open').addEventListener('click',openCart);
  $('#cart-notice-close').addEventListener('click',()=>{$('#cart-notice').hidden=true;clearTimeout(noticeTimer);});
  document.addEventListener('typica:add-to-cart',event=>{
    const {id,quantity,grind}=event.detail||{},p=catalog.find(product=>product.id===id);
    if (!p || !grinds.includes(grind) || !Number.isInteger(quantity) || quantity<1 || quantity>12) return;
    const existing=items.find(item=>item.id===id && item.grind===grind);
    if (existing) existing.quantity=Math.min(99,existing.quantity+quantity); else items.push({id,grind,quantity});
    saveCart(); showHeader(); $('#cart-notice-text').textContent=p.name+' añadido al carrito.';
    $('#cart-notice').hidden=false; clearTimeout(noticeTimer);
    if (animate()) {G.fromTo('.cart-count',{scale:.65},{scale:1,duration:.35,ease:'power3.out',overwrite:true});G.fromTo('#cart-notice',{y:30,autoAlpha:0},{y:0,autoAlpha:1,duration:.35,ease:'power3.out',overwrite:true});}
    noticeTimer=setTimeout(()=>{$('#cart-notice').hidden=true;},6000);
  });
  $('#cart-items').addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if (button.hasAttribute('data-cart-remove')) {
      const index=Number(button.dataset.cartRemove),removed=items[index];if(!removed)return;
      items.splice(index,1);saveCart();$('#cart-status').textContent='Café eliminado del carrito.';
      ($('#cart-items .cart-remove')||$('#cart-empty a')).focus({preventScroll:true});
    } else if (button.hasAttribute('data-cart-step')) {
      const index=Number(button.dataset.index),step=Number(button.dataset.cartStep);if(!items[index])return;
      items[index].quantity=Math.max(1,Math.min(99,items[index].quantity+step));saveCart();
      const replacement=$(`#cart-items [data-index="${index}"][data-cart-step="${step}"]`);
      if(replacement&&!replacement.disabled)replacement.focus({preventScroll:true});
      $('#cart-status').textContent='Cantidad actualizada. Subtotal: '+$('#cart-total').textContent;
    }
  });
  $('#cart-copy').addEventListener('click',async()=>{
    if(!items.length)return;
    const lines=items.map(item=>{const p=catalog.find(product=>product.id===item.id);return `${item.quantity} × ${p.name} · 250 g · ${item.grind}`;});
    const text='Hola, Typica. Quisiera consultar este pedido:\n'+lines.join('\n')+'\n¿Me confirman precio, disponibilidad y entrega?';
    try {await navigator.clipboard.writeText(text);$('#cart-copy .button-label').textContent='Pedido copiado';$('#cart-status').textContent='Pedido copiado. Puedes consultarlo con Typica.';}
    catch {$('#cart-status').textContent='No se pudo copiar. Puedes consultar las bolsas de tu carrito con Typica.';}
  });
  addEventListener('storage',event=>{if(event.key!==storageKey)return;try{items=normalise(JSON.parse(event.newValue||'[]'));renderCart();}catch{}});
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');if(!link)return;
    const hash=link.getAttribute('href');if(hash==='#')return;
    const target=document.getElementById(hash.slice(1));if(!target)return;
    event.preventDefault();if(menuOpen)closeMenu(false);if(cart.open)cart.close();
    const offset=target.matches('.coffee-section,.hero-scene')?0:86;
    window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-offset),behavior:reduced.matches?'instant':'smooth'});
    history.replaceState(null,'',hash);
  });
  renderCart(); updateTone();
  addEventListener('resize',updateTone,{passive:true});
})();
