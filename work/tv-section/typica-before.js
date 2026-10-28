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
  let selected='gesha',quantity=1;
  const money=value=>'Bs '+value.toLocaleString('es-BO');
  window.typicaCoffeeCatalog = catalog;

  let dialogFocus=null;const coffeeDialog=$('#coffee-dialog');
  function showDialog(dialog){dialogFocus=document.activeElement;dialog.showModal();document.body.style.overflow='hidden';if(animated())G.fromTo(dialog,{y:40,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:.5,ease:'power3.out',overwrite:true});}
  $$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{document.body.style.overflow='';dialogFocus?.focus({preventScroll:true});});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});});
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>$('#'+button.dataset.close).close()));$('#open-credits').addEventListener('click',()=>showDialog($('#credits-dialog')));
  function updateQuantity(){const p=catalog.find(p=>p.id===selected);$('#quantity').textContent=quantity;$('#quantity-minus').disabled=quantity===1;$('#quantity-plus').disabled=quantity===12;$('#dialog-price').textContent=money(p.price*quantity);$('#copy-order .button-label').textContent='Copiar mi selección';}
  $$('[data-open-coffee]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.openCoffee;const p=catalog.find(p=>p.id===selected);quantity=1;$('#dialog-title').textContent=p.name;$('#dialog-image').src='assets/products/'+p.image;$('#dialog-image').alt='Bolsa de café '+p.name;$('#dialog-description').textContent=p.description+' '+p.origin+'.';$('.dialog-image').style.backgroundColor=p.ground;updateQuantity();const source=button.querySelector('img')||button.closest('.coffee-panel').querySelector('.poster-pack');let state=null;if(animated()&&window.Flip){$$('[data-flip-id="coffee-photo"]').forEach(el=>el.removeAttribute('data-flip-id'));source.dataset.flipId='coffee-photo';state=Flip.getState(source);$('#dialog-image').dataset.flipId='coffee-photo';}showDialog(coffeeDialog);if(state)Flip.from(state,{targets:$('#dialog-image'),duration:.85,ease:'power3.inOut',scale:true});}));
  $('#quantity-minus').addEventListener('click',()=>{quantity=Math.max(1,quantity-1);updateQuantity();});$('#quantity-plus').addEventListener('click',()=>{quantity=Math.min(12,quantity+1);updateQuantity();});
  $('#add-to-cart').addEventListener('click',()=>{coffeeDialog.close();document.dispatchEvent(new CustomEvent('typica:add-to-cart',{detail:{id:selected,quantity,grind:$('#grind').value}}));});
  $('#copy-order').addEventListener('click',async()=>{const p=catalog.find(p=>p.id===selected),text='Hola, Typica. Quisiera consultar '+quantity+' '+(quantity===1?'bolsa':'bolsas')+' de '+p.name+' · 250 g · '+$('#grind').value+'. ¿Me confirman el precio, la disponibilidad y las opciones de entrega?';try{await navigator.clipboard.writeText(text);$('#copy-order .button-label').textContent='Selección copiada';$('#order-status').textContent='Tu selección está copiada. Puedes consultar con tu local.';}catch{$('#order-status').textContent='No se pudo copiar. Consulta tu selección con tu local.';}});

  const video=$('#typica-film'),filmButton=$('#film-toggle');let filmLoaded=false,manualPaused=false;
  function loadFilm(){if(filmLoaded)return;filmLoaded=true;const source=video.querySelector('source');source.src=source.dataset.src;video.load();}
  function syncFilmButton(){filmButton.querySelector('.film-label').textContent=video.paused?'Reproducir vídeo':'Pausar vídeo';filmButton.classList.toggle('is-playing',!video.paused);filmButton.setAttribute('aria-label',video.paused?'Reproducir vídeo de Typica':'Pausar vídeo de Typica');filmButton.title=video.paused?'Reproducir vídeo':'Pausar vídeo';}
  filmButton.addEventListener('click',()=>{loadFilm();if(video.paused){manualPaused=false;video.play().catch(()=>{});}else{manualPaused=true;video.pause();}});
  video.addEventListener('play',syncFilmButton);video.addEventListener('pause',syncFilmButton);
  new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&!reduced.matches&&!manualPaused){loadFilm();video.play().catch(()=>{});}else video.pause();}),{threshold:.3}).observe(video);
  reduced.addEventListener('change',()=>{if(reduced.matches)video.pause();});
  const filmFrame=$('.people-film'),soundButton=$('#film-sound'),soundSticker=$('.sound-sticker'),fullscreenButton=$('#film-fullscreen');
  function syncSound(){soundButton.classList.toggle('is-audible',!video.muted);soundButton.setAttribute('aria-pressed',String(!video.muted));soundButton.setAttribute('aria-label',video.muted?'Activar sonido':'Silenciar vídeo');}
  soundButton.addEventListener('click',()=>{video.muted=!video.muted;syncSound();if(animated())G.fromTo(soundSticker,{rotation:-13,scale:.83},{rotation:0,scale:1,duration:.5,ease:'back.out(1.7)',overwrite:'auto'});});
  video.addEventListener('volumechange',syncSound);syncSound();
  const pointerMotion=G?G.matchMedia():null;
  pointerMotion?.add('(hover: hover) and (pointer: fine)',()=>{
    filmFrame.classList.add('has-sound-cursor');
    G.set(soundSticker,{left:0,top:0,xPercent:-50,yPercent:-50});
    const moveX=G.quickTo(soundSticker,'x',{duration:.32,ease:'power3.out'}),moveY=G.quickTo(soundSticker,'y',{duration:.32,ease:'power3.out'});
    const place=(x,y)=>{const b=filmFrame.getBoundingClientRect(),pad=60;const px=Math.max(pad,Math.min(b.width-pad,x)),py=Math.max(pad,Math.min(b.height-pad,y));if(reduced.matches)G.set(soundSticker,{x:px,y:py});else{moveX(px);moveY(py);}};
    const rest=()=>{const b=filmFrame.getBoundingClientRect();place(b.width-70,b.height-70);};
    const move=e=>{const b=filmFrame.getBoundingClientRect();place(e.clientX-b.left,e.clientY-b.top);};
    soundButton.addEventListener('pointermove',move);soundButton.addEventListener('pointerleave',rest);rest();
    const observer=new ResizeObserver(rest);observer.observe(filmFrame);
    return()=>{observer.disconnect();soundButton.removeEventListener('pointermove',move);soundButton.removeEventListener('pointerleave',rest);filmFrame.classList.remove('has-sound-cursor');G.set(soundSticker,{clearProps:'left,top,transform'});};
  });
  fullscreenButton.hidden=!(document.fullscreenEnabled||video.webkitSupportsFullscreen);
  fullscreenButton.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(filmFrame.requestFullscreen)await filmFrame.requestFullscreen();else video.webkitEnterFullscreen?.();}catch(error){console.warn('Pantalla completa no disponible:',error.message);}});
  document.addEventListener('fullscreenchange',()=>{const active=document.fullscreenElement===filmFrame;fullscreenButton.setAttribute('aria-label',active?'Salir de pantalla completa':'Ver vídeo en pantalla completa');fullscreenButton.title=active?'Salir de pantalla completa':'Pantalla completa';});
  async function initMotion(){
    await document.fonts.ready;if(!hasMotion)return;const mm=G.matchMedia();
    mm.add({all:'(min-width: 0px)',desktop:'(min-width: 901px) and (min-height: 680px)',reduce:'(prefers-reduced-motion: reduce)'},ctx=>{
      const {desktop,reduce}=ctx.conditions;const splits=[];const hero=$('.hero-scene');hero.classList.add('scene',reduce||!desktop?'is-rest':'is-live');hero.dataset.scene='photo-window';
      if(reduce)return()=>{hero.classList.remove('scene','is-rest');};
      if(desktop)document.body.classList.add('motion-ready');
      const intro=G.timeline({defaults:{ease:'power4.out'}}).from('.nav-bar',{y:-90,duration:.8},0);
      const heroWords=$$('.hero-word').flatMap(el=>{
        if(!window.SplitText)return [el];
        const split=SplitText.create(el,{type:'words',wordsClass:'hero-entry-word',aria:'auto'});
        splits.push(split);
        return split.words;
      });
      // Whole words grow into place while arriving from the right.
      intro.from(heroWords,{
        scale:0,transformOrigin:'50% 50%',duration:1,stagger:.05,ease:'expo.out'
      },.08).from(heroWords,{
        xPercent:100,rotation:.001,duration:1,stagger:.05,
        ease:'elastic.out(1,.75)',clearProps:'transform,transformOrigin'
      },.08);
      intro.from('.hero-image',{scale:1.2,duration:1.5,ease:'power2.out'},.08).from('.culture-ticket,.about-ticket,.hero-actions>.cut-button',{x:65,opacity:0,stagger:.09,duration:.8,clearProps:'all'},.25).from('.hero-grid>.sticker,.hero-top .sticker,.hero-bottom .sticker',{scale:0,rotation:-45,stagger:.12,duration:1,ease:'elastic.out(1,.7)'},.55);
      G.fromTo('.hero-image',{yPercent:0},{yPercent:8,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.6}});
      const serifLine=$('.serif-line');
      if(serifLine){
        const handPaths=serifLine.querySelectorAll('.hand-path');
        handPaths.forEach(p=>{const len=p.getTotalLength();G.set(p,{strokeDasharray:len+1,strokeDashoffset:len+1});});
        const lineTl=G.timeline({scrollTrigger:{trigger:serifLine,start:'top 85%',toggleActions:'play reverse play reverse'}});
        lineTl.to(handPaths,{strokeDashoffset:0,duration:.6,stagger:.12,ease:'power3.out'});
      }

      // Animación rápida y suavizada en out para los trazos SVG (Truus lines)
      $$('.draw-path:not(.subtitle-flourish .draw-path)').forEach(p=>{
        G.set(p,{strokeDasharray:'102 102',strokeDashoffset:102});
        G.to(p,{
          strokeDashoffset:0,duration:.6,ease:'power3.out',
          scrollTrigger:{
            trigger:p.closest('.people-pair, .houses-section, .people-photo, .flourish-wrap, .oval-word')||p,
            start:'top 85%',toggleActions:'play reverse play reverse'
          }
        });
      });

      // Stickers apareciendo con escala y rebote suave
      $$('.intro-photos .sticker, .poster-sticker, .film-sticker, .people-photo>.sticker, .house-sticker').forEach(st=>{
        G.from(st,{
          scale:0,opacity:0,duration:.65,ease:'back.out(1.8)',
          scrollTrigger:{
            trigger:st,start:'top 88%',toggleActions:'play reverse play reverse'
          }
        });
      });
      $$('.house').forEach(el=>G.from(el.querySelector('.house-photo'),{y:70,scale:1.08,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true}}));

      ScrollTrigger.refresh();return()=>{document.body.classList.remove('motion-ready');hero.classList.remove('scene','is-live','is-rest');splits.forEach(split=>split.revert());};
    });
    $$('img[loading="lazy"]').forEach(img=>img.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true}));
  }
  initMotion().catch(error=>{console.error('Typica motion:',error);document.body.classList.remove('motion-ready');});
})();
