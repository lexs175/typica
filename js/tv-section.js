(() => {
  'use strict';
  const scene = document.querySelector('#typica-tv');
  if (!scene) return;
  const stage = scene.querySelector('.tv-stage');
  const art = scene.querySelector('.tv-art');
  const video = scene.querySelector('video');
  const title = scene.querySelector('.tv-heading');
  const wallStickers = scene.querySelector('.tv-wall-stickers');
  const invitation = scene.querySelector('.tv-invitation');
  const controls = scene.querySelector('.tv-controls');
  const play = scene.querySelector('[data-tv-play]');
  const sound = scene.querySelector('[data-tv-sound]');
  const soundSticker = sound.querySelector('.sound-sticker');
  const fullscreen = scene.querySelector('[data-tv-fullscreen]');
  const status = scene.querySelector('.tv-status');
  const G = window.gsap, ST = window.ScrollTrigger;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const artwork = { width: 1672, height: 941 };
  // Measured from the generated set, in normalized image coordinates.
  const aperture = { x: 491 / 1672, y: 225 / 941, width: 579 / 1672, height: 443 / 941 };
  let source = {}, timeline = null, loaded = false, manuallyPaused = false;
  let isVisible = false, staticExpanded = false, resizeFrame = 0;

  function measure() {
    const width = stage.clientWidth, height = stage.clientHeight;
    let imageWidth, imageHeight, x, y;
    if (width <= 700) {
      imageWidth = width * 1.85;
      imageHeight = imageWidth * artwork.height / artwork.width;
      x = (width - imageWidth) / 2;
      y = height - imageHeight;
    } else {
      const scale = Math.max(width / artwork.width, height / artwork.height);
      imageWidth = artwork.width * scale;
      imageHeight = artwork.height * scale;
      x = (width - imageWidth) / 2;
      y = (height - imageHeight) / 2;
    }
    stage.style.setProperty('--tv-art-x', `${x}px`);
    stage.style.setProperty('--tv-art-y', `${y}px`);
    stage.style.setProperty('--tv-art-width', `${imageWidth}px`);
    stage.style.setProperty('--tv-art-height', `${imageHeight}px`);
    source = {
      x: x + imageWidth * aperture.x,
      y: y + imageHeight * aperture.y,
      width: imageWidth * aperture.width,
      height: imageHeight * aperture.height
    };
  }
  function expandedGeometry() {
    return {
      scale: Math.max(stage.clientWidth / source.width, stage.clientHeight / source.height) * 1.12,
      x: stage.clientWidth / 2 - (source.x + source.width / 2),
      y: stage.clientHeight / 2 - (source.y + source.height / 2)
    };
  }
  function placeScene(expanded = false) {
    const target = expanded ? expandedGeometry() : { x: 0, y: 0, scale: 1 };
    if (G) G.set(art, target);
    else {
      art.style.transform = `translate(${target.x}px, ${target.y}px) scale(${target.scale})`;
    }
  }
  function loadVideo() {
    if (loaded) return;
    loaded = true;
    video.preload = 'auto';
    video.load();
  }
  async function startVideo() {
    loadVideo();
    try { await video.play(); }
    catch { syncControls(); }
  }
  function syncControls() {
    play.classList.toggle('is-playing', !video.paused);
    const label = video.paused ? 'Reproducir vídeo' : 'Pausar vídeo';
    play.querySelector('.film-label').textContent = label;
    play.setAttribute('aria-label', label + ' del televisor');
    play.title = label;
    sound.classList.toggle('is-audible', !video.muted);
    sound.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar vídeo');
    sound.setAttribute('aria-pressed', String(!video.muted));
  }
  function setExpanded(expanded) {
    stage.classList.toggle('tv-is-expanded', expanded);
    controls.hidden = !expanded;
    sound.hidden = !expanded;
  }
  function staticView(expanded) {
    staticExpanded = expanded;
    placeScene(expanded);
    setExpanded(expanded);
    title.style.visibility = expanded ? 'hidden' : '';
    wallStickers.style.visibility = expanded ? 'hidden' : '';
    invitation.style.visibility = expanded ? 'hidden' : '';
  }

  video.controls = false;
  setExpanded(false);
  scene.classList.add('tv-is-ready');
  video.muted = true;
  syncControls();
  ['play', 'pause', 'volumechange', 'ended'].forEach(event => video.addEventListener(event, syncControls));
  play.addEventListener('click', () => {
    if (video.paused) { manuallyPaused = false; startVideo(); }
    else { manuallyPaused = true; video.pause(); }
  });
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.paused && !manuallyPaused) startVideo();
    syncControls();
    if (G && !reduced.matches) G.fromTo(soundSticker, { rotation: -13, scale: .83 }, {
      rotation: 0, scale: 1, duration: .5, ease: 'back.out(1.7)', overwrite: 'auto'
    });
  });
  fullscreen.hidden = !(stage.requestFullscreen || video.webkitEnterFullscreen);
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.requestFullscreen) await stage.requestFullscreen();
      else video.webkitEnterFullscreen();
    } catch { status.textContent = 'La pantalla completa no está disponible en este navegador.'; }
  });
  document.addEventListener('fullscreenchange', () => {
    const active = document.fullscreenElement === stage;
    stage.classList.toggle('tv-native-fullscreen', active);
    measure();
    if (active) {
      timeline?.scrollTrigger.disable(false);
      placeScene(true); setExpanded(true);
    } else if (timeline) {
      timeline.scrollTrigger.enable(); ST.refresh();
    } else staticView(staticExpanded);
    fullscreen.setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Ver vídeo en pantalla completa');
    fullscreen.title = active ? 'Salir de pantalla completa' : 'Pantalla completa';
  });

  G?.matchMedia().add('(hover: hover) and (pointer: fine)', () => {
    stage.classList.add('has-sound-cursor');
    G.set(soundSticker, { left: 0, top: 0, xPercent: -50, yPercent: -50 });
    const moveX = G.quickTo(soundSticker, 'x', { duration: .32, ease: 'power3.out' });
    const moveY = G.quickTo(soundSticker, 'y', { duration: .32, ease: 'power3.out' });
    const place = (x, y) => {
      const b = stage.getBoundingClientRect(), pad = 60;
      const point = { x: Math.max(pad, Math.min(b.width - pad, x)), y: Math.max(pad, Math.min(b.height - pad, y)) };
      if (reduced.matches) G.set(soundSticker, point);
      else { moveX(point.x); moveY(point.y); }
    };
    const rest = () => { const b = stage.getBoundingClientRect(); place(b.width - 70, b.height - 70); };
    const move = event => { const b = stage.getBoundingClientRect(); place(event.clientX - b.left, event.clientY - b.top); };
    sound.addEventListener('pointermove', move);
    sound.addEventListener('pointerleave', rest);
    const observer = new ResizeObserver(rest); observer.observe(stage); rest();
    return () => {
      observer.disconnect();
      sound.removeEventListener('pointermove', move); sound.removeEventListener('pointerleave', rest);
      stage.classList.remove('has-sound-cursor');
      G.set(soundSticker, { clearProps: 'left,top,transform' });
    };
  });
  invitation.addEventListener('click', () => {
    if (!manuallyPaused) startVideo();
    if (timeline?.scrollTrigger && !reduced.matches) {
      const trigger = timeline.scrollTrigger;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * .83, behavior: 'smooth' });
    } else { staticView(true); play.focus({ preventScroll: true }); }
  });
  scene.addEventListener('keydown', event => {
    if (event.key === 'Escape' && staticExpanded && !document.fullscreenElement) {
      staticView(false);
      invitation.focus({ preventScroll: true });
    }
  });

  const preloadObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { loadVideo(); preloadObserver.disconnect(); }
  }, { rootMargin: '450px' });
  preloadObserver.observe(scene);
  const playbackObserver = new IntersectionObserver(entries => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !reduced.matches && !manuallyPaused) startVideo();
    else if (!isVisible) video.pause();
  }, { threshold: .18 });
  playbackObserver.observe(video);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else if (isVisible && !manuallyPaused && !reduced.matches) startVideo();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) video.pause(); });

  async function init() {
    await document.fonts.ready;
    measure(); placeScene();
    if (G && ST) {
      G.registerPlugin(ST);
      G.matchMedia().add({ normal: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
        measure(); staticView(false);
        if (context.conditions.reduce) { staticView(false); return; }
        scene.classList.add('tv-has-motion');
        measure(); placeScene();
        timeline = G.timeline({
          onUpdate() { setExpanded(this.time() >= 1.139); },
          scrollTrigger: {
          id: 'typica-tv-expansion', trigger: scene,
          start: 'top top', end: 'bottom bottom', scrub: .65,
          invalidateOnRefresh: true,
        } });
        // The video is behind the PNG aperture and shares its exact transform.
        timeline.fromTo(art, { x: 0, y: 0, scale: 1 }, {
          scale: () => expandedGeometry().scale,
          x: () => expandedGeometry().x,
          y: () => expandedGeometry().y,
          duration: 1, ease: 'power2.inOut'
        }, .14)
        .to(title, { y: -70, opacity: 0, duration: .38, ease: 'power1.in' }, .16)
        .to(wallStickers, { opacity: 0, duration: .3 }, .14)
        .to(invitation, { y: 20, autoAlpha: 0, duration: .22, ease: 'power1.in' }, .14)
        .to({}, { duration: .56 });
        return () => {
          scene.classList.remove('tv-has-motion');
          setExpanded(false);
          timeline = null;
        };
      });
      ST.refresh();
    }
    new ResizeObserver(() => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        measure();
        if (document.fullscreenElement === stage) { placeScene(true); setExpanded(true); }
        else if (timeline) ST.refresh();
        else placeScene(staticExpanded);
      });
    }).observe(stage);

    // A direct link to this new section must land here after existing scenes refresh.
    if (location.hash === '#typica-tv') {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        window.scrollTo({ top: scene.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
      }));
    }
  }
  init().catch(error => {
    console.error('Typica TV:', error);
    scene.classList.remove('tv-has-motion');
    video.controls = true;
    controls.hidden = true;
  });
})();
