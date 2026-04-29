/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — FAQ PAGE
   A small enhancement layer over the shared script.js.

   Responsibilities:
     1. Fill in per-chapter question counts ("Five questions in this chapter")
     2. Pulse the chapter numeral when arriving from the hero index
     3. Handle deep-link arrivals (faq.html#chapter-3)

   Everything else — anchor smooth-scroll, the accordion's close-others
   behavior, loader, nav, marquee — is handled by script.js.
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ──────────── UTILITIES ──────────── */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NUM_WORDS = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'
  ];
  const numWord = (n) => NUM_WORDS[n] || String(n);

  /* ═══════════════════════════════════════════════════════════════
     1. PER-CHAPTER QUESTION COUNTS
     ═══════════════════════════════════════════════════════════════ */
  function fillChapterCounts() {
    $$('.faq-chapter').forEach(chapter => {
      const target = $('[data-faq-count]', chapter);
      if (!target) return;

      const count = $$('.faq-row', chapter).length;
      if (!count) return;

      target.textContent = `${numWord(count)} question${count === 1 ? '' : 's'} in this chapter`;
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     2. NUMERAL PULSE — a quiet "you've arrived" gesture
     ═══════════════════════════════════════════════════════════════ */
  function pulseNumeral(chapter) {
    if (prefersReducedMotion) return;
    const num = chapter && chapter.querySelector('.faq-chapter__num');
    if (!num || typeof num.animate !== 'function') return;

    num.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-10px)', offset: 0.5 },
        { transform: 'translateY(0)' }
      ],
      { duration: 1400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     3. CHAPTER LINKS — pulse the target numeral on click
     Fires for any in-page link to a chapter, not just the hero index,
     so future inline references like "see Chapter II below" work too.
     ═══════════════════════════════════════════════════════════════ */
  function bindChapterLinks() {
    $$('a[href^="#chapter-"]').forEach(link => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('href').slice(1);
        const chapter = document.getElementById(id);
        if (!chapter) return;

        // Delay so the pulse lands roughly as the smooth-scroll arrives.
        // Lenis is configured with ~1.6s scrollTo duration; 800ms is mid-flight.
        setTimeout(() => pulseNumeral(chapter), 800);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     4. DEEP LINK ON LOAD
     If the page arrives at faq.html#chapter-3, run the smooth scroll
     ourselves (browsers + Lenis don't always agree on initial hashes)
     and pulse the numeral once the loader has finished.
     ═══════════════════════════════════════════════════════════════ */
  function bindHashOnLoad() {
    const hash = window.location.hash;
    if (!/^#chapter-\d+$/.test(hash)) return;

    const chapter = document.querySelector(hash);
    if (!chapter) return;

    const trigger = () => {
      setTimeout(() => {
        // Prefer the shared Lenis instance if available
        const smooth = window.parkCity && window.parkCity.smoothScroll;
        if (smooth && typeof smooth.scrollTo === 'function') {
          smooth.scrollTo(chapter, { offset: -100 });
        } else {
          chapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        pulseNumeral(chapter);
      }, 200);
    };

    document.addEventListener('app:loaded', trigger, { once: true });
    // Failsafe — never block on a missed loader event
    setTimeout(trigger, 4500);
  }

  /* ═══════════════════════════════════════════════════════════════
     5. CONSOLE SIGNATURE
     ═══════════════════════════════════════════════════════════════ */
  function signature() {
    const css = 'font-family: serif; font-style: italic; color: #b8956a;';
    console.log('%cPark City 3 & 4 — FAQ. Quietly answered.', css);
  }

  /* ═══════════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════════ */
  ready(() => {
    try {
      fillChapterCounts();
      bindChapterLinks();
      bindHashOnLoad();
      signature();
    } catch (err) {
      console.error('[Park City · FAQ] init error:', err);
    }
  });

})();
