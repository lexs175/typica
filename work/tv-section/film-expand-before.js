(() => {
  'use strict';
  const scene = document.querySelector('#film-story');
  if (!scene) return;
  const stage = scene.querySelector('.film-stage');
  const frame = scene.querySelector('.people-film');
  const slot = scene.querySelector('.film-mini-slot');
  const G = window.gsap, ST = window.ScrollTrigger;
  if (!G || !ST) return;
  G.registerPlugin(ST);

  document.fonts.ready.then(() => {
    const media = G.matchMedia();
    media.add({ all: '(min-width:0px)', phone: '(max-width:700px)', reduce: '(prefers-reduced-motion:reduce)' }, context => {
      const { reduce } = context.conditions;
      scene.classList.add('scene', reduce ? 'is-rest' : 'is-live');
      scene.dataset.scene = 'inline-video';
      if (reduce) return () => scene.classList.remove('scene', 'is-rest');

      scene.classList.add('film-animating');

      const source = () => {
        const a = slot.getBoundingClientRect(), b = stage.getBoundingClientRect();
        return { x: a.left - b.left, y: a.top - b.top, width: a.width, height: a.height };
      };

      const target = () => {
        return {
          width: stage.clientWidth,
          height: stage.clientHeight,
          x: 0,
          y: 0
        };
      };

      const controls = scene.querySelectorAll('.film-controls, .film-sound, .film-sticker');
      const flourishPath = scene.querySelector('.subtitle-flourish .draw-path');
      if (flourishPath) {
        G.set(flourishPath, { strokeDasharray: '102 102', strokeDashoffset: 102 });
        G.to(flourishPath, {
          strokeDashoffset: 0,
          duration: .65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.film-subtitle',
            start: 'top 90%',
            toggleActions: 'play reverse play reverse'
          }
        });
      }

      const timeline = G.timeline({
        scrollTrigger: {
          id: 'typica-inline-film',
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          scrub: .65,
          invalidateOnRefresh: true
        }
      });

      timeline.fromTo(frame, {
        x: () => source().x,
        y: () => source().y,
        width: () => source().width,
        height: () => source().height,
        borderRadius: 12
      }, {
        x: 0,
        y: 0,
        width: () => target().width,
        height: () => target().height,
        borderRadius: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 0)
      .to('.film-title-start', { xPercent: -45, duration: .8, ease: 'power2.inOut' }, 0)
      .to('.film-title-end', { xPercent: 45, duration: .8, ease: 'power2.inOut' }, 0)
      .to('.film-title-start, .film-title-end', { autoAlpha: 0, duration: .45, ease: 'power2.in' }, .22)
      .to('.film-subtitle', { y: 24, scale: .96, duration: .75, ease: 'power2.inOut' }, .08)
      .to('.film-subtitle', { autoAlpha: 0, duration: .45, ease: 'power2.in' }, .26)
      .fromTo(controls, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, ease: 'power2.out' }, .75)
      .to({}, { duration: .65 }); // Hold at full screen for an immersive watching window

      return () => scene.classList.remove('film-animating', 'scene', 'is-live');
    });

    ST.refresh();
  });
})();
