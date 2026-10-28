(() => {
  'use strict';
  const section = document.querySelector('.coffee-carousel');
  if (!section) return;
  const screen = section.querySelector('.coffee-screen');
  const stage = section.querySelector('.coffee-panels');
  const panels = [...section.querySelectorAll('.coffee-panel')];
  const tabs = [...section.querySelectorAll('[data-coffee-jump]')];
  const previous = section.querySelector('[data-coffee-step="-1"]');
  const next = section.querySelector('[data-coffee-step="1"]');
  const status = section.querySelector('#coffee-status');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const G = window.gsap;
  let active = 0, moving = false, queued = null, timeline = null;
  const wrap = index => (index + panels.length) % panels.length;
  const parts = panel => [...panel.querySelectorAll('.poster-pack,.poster-sticker')];

  function mark(index) {
    active = index;
    screen.dataset.current = panels[index].id.replace('poster-', '');
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.setAttribute('aria-hidden', String(i !== index));
      panel.inert = i !== index;
    });
  }

  function announce() {
    status.textContent = `${tabs[active].textContent.trim()}. ${panels[active].querySelector('.poster-notes').textContent}`;
  }

  function settle() {
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-current', i === active);
      panel.classList.remove('is-leaving');
      panel.style.zIndex = '';
      panel.querySelector('.poster-copy').style.visibility = '';
      if (G) G.set(parts(panel), { clearProps: 'transform,opacity,visibility,willChange' });
    });
    stage.setAttribute('aria-busy', 'false');
    moving = false;
    timeline = null;
    announce();
    const pending = queued;
    queued = null;
    if (pending && pending.index !== active) select(pending.index, pending.direction);
  }

  function select(index, direction = index > active ? 1 : -1) {
    index = wrap(index);
    if (moving) { queued = { index, direction }; return; }
    if (index === active) return;
    const old = panels[active], incoming = panels[index];
    const oldPack = old.querySelector('.poster-pack');
    const newPack = incoming.querySelector('.poster-pack');
    old.classList.add('is-leaving');
    old.classList.remove('is-current');
    incoming.classList.add('is-current');
    old.style.zIndex = '2';
    incoming.style.zIndex = '3';
    mark(index);

    // Copy switches in place; only the real bags and stickers travel.
    if (!G || reduce.matches) { settle(); return; }
    moving = true;
    stage.setAttribute('aria-busy', 'true');
    incoming.querySelector('.poster-copy').style.visibility = 'hidden';
    G.set([...parts(old), ...parts(incoming)], { willChange: 'transform,opacity' });
    G.set(incoming.querySelector('.poster-sticker'), { autoAlpha: 0, scale: .85 });
    timeline = G.timeline({ onComplete: settle });
    timeline.to(oldPack, {
      xPercent: -18 * direction, y: 14, rotation: -11 * direction,
      scale: .88, autoAlpha: 0, duration: .32, ease: 'power2.in'
    }, 0)
    .to(old.querySelector('.poster-sticker'), { autoAlpha: 0, duration: .18 }, 0)
    .set(old.querySelector('.poster-copy'), { visibility: 'hidden' }, .16)
    .set(incoming.querySelector('.poster-copy'), { visibility: 'visible' }, .16)
    .fromTo(newPack, {
      xPercent: 24 * direction, y: -24, rotation: 14 * direction,
      rotationY: -30 * direction, scale: .84, autoAlpha: 0
    }, {
      xPercent: 0, y: 0, rotation: 0, rotationY: 0,
      scale: 1, autoAlpha: 1, duration: .8, ease: 'power3.out'
    }, .16)
    .to(incoming.querySelector('.poster-sticker'), {
      autoAlpha: 1, scale: 1, duration: .3, ease: 'power3.out'
    }, .46);
  }

  function step(direction) { select(wrap((queued?.index ?? active) + direction), direction); }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : wrap(active + (event.key === 'ArrowRight' ? 1 : -1));
      select(index, event.key === 'ArrowLeft' ? -1 : 1);
      tabs[index].focus({ preventScroll: true });
    });
  });
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));

  let touch = null, swiped = false;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    touch = { x: event.clientX, y: event.clientY, id: event.pointerId };
    swiped = false;
  });
  stage.addEventListener('pointerup', event => {
    if (!touch || touch.id !== event.pointerId) return;
    const dx = event.clientX - touch.x, dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      swiped = true;
      step(dx < 0 ? 1 : -1);
    }
  });
  stage.addEventListener('pointercancel', () => { touch = null; });
  stage.addEventListener('click', event => {
    if (!swiped) return;
    swiped = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  reduce.addEventListener('change', () => {
    if (!reduce.matches || !timeline) return;
    timeline.kill();
    queued = null;
    settle();
  });

  panels.forEach((panel, i) => {
    panel.classList.toggle('is-current', i === 0);
    panel.querySelector('.poster-pack').loading = 'eager';
  });
  stage.id = 'coffee-display';
  mark(0);
  section.classList.add('is-ready');
})();
