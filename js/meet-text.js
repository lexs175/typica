(() => {
  'use strict';
  const section = document.querySelector('#de-cerca');
  const G = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
  if (!section || !G || !ST || !Split) return;
  const stage = section.querySelector('.meet-stage');
  const track = section.querySelector('.meet-track');
  const heading = section.querySelector('.meet-heading');
  G.registerPlugin(ST, Split);

  document.fonts.ready.then(() => {
    const media = G.matchMedia();
    media.add({ all: '(min-width: 0px)', phone: '(max-width: 700px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      section.classList.add('scene', context.conditions.reduce ? 'is-rest' : 'is-live');
      section.dataset.scene = 'meet-letters';
      if (context.conditions.reduce) return () => section.classList.remove('scene', 'is-rest');

      section.classList.add('meet-live');
      const split = Split.create(heading, { type: 'words,chars', wordsClass: 'meet-word', charsClass: 'meet-char', aria: 'auto' });
      const travel = G.fromTo(track, {
        x: () => stage.clientWidth * .72
      }, {
        x: () => -track.offsetWidth + stage.clientWidth * .08,
        ease: 'none',
        scrollTrigger: {
          id: 'typica-meet-travel', trigger: section,
          start: 'top 70%', end: 'bottom bottom', scrub: .5,
          invalidateOnRefresh: true
        }
      });

      // Each character gets its own random offset, generated once per setup.
      split.chars.forEach(letter => {
        const offsetY = G.utils.random(-250, 250);
        const angle = G.utils.random(-30, 30);
        G.fromTo(letter, { yPercent: offsetY, rotation: angle }, {
          yPercent: 0, rotation: 0, ease: 'elastic.out(1.2, 1)',
          scrollTrigger: {
            trigger: letter, containerAnimation: travel,
            start: 'left 90%', end: 'left 10%', scrub: .5
          }
        });
      });

      section.querySelectorAll('.meet-sticker-anchor').forEach(anchor => {
        G.fromTo(anchor.querySelector('img'), {
          scale: 0, yPercent: G.utils.random(-200, 200), rotation: G.utils.random(-30, 30)
        }, {
          scale: 1, yPercent: 0, rotation: 0, ease: 'elastic.out(1.2, 1)',
          scrollTrigger: {
            trigger: anchor, containerAnimation: travel,
            start: 'left 90%', end: 'left 10%', scrub: .5
          }
        });
      });

      return () => {
        split.revert();
        section.classList.remove('meet-live', 'scene', 'is-live');
      };
    });
    ST.refresh();
  }).catch(error => console.error('Typica meet text:', error));
})();
