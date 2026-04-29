/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — GUIDES PAGE
   A small enhancement layer over the shared script.js.

   Responsibilities:
     1. Fill in per-chapter policy counts
     2. Scroll-spy: highlight the active chapter & policy in the TOC
     3. TOC clicks auto-open the target policy panel
     4. Handle deep-link arrivals (guides.html#policy-3-4 etc.)
     5. Open all panels for printing, restore after

   Anchor smooth-scroll, loader, nav, marquee, reveals — all handled
   by script.js. The .guides-row accordion uses its own class so
   script.js's FAQPreview never touches it; multiple panels can stay
   open simultaneously.
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

  const NUM_WORDS = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'
  ];
  const numWord = (n) => NUM_WORDS[n] || String(n);

  /* ═══════════════════════════════════════════════════════════════
     1. PER-CHAPTER POLICY COUNTS
     Skips the newsletters chapter — it has its own static label.
     ═══════════════════════════════════════════════════════════════ */
  function fillChapterCounts() {
    $$('.guides-chapter').forEach(chapter => {
      const target = $('[data-guides-count]', chapter);
      if (!target) return;

      const count = $$('.guides-row', chapter).length;
      if (!count) return;

      target.textContent = `${numWord(count)} ${count === 1 ? 'policy' : 'policies'} in this chapter`;
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     2. SCROLL-SPY
     Tracks which chapter and which policy the user is currently
     reading, and highlights the matching TOC entries.

     Approach: on each rAF-throttled scroll frame, find the topmost
     section whose top is at or above a virtual trigger line near
     the top of the viewport. That's the "active" section. Sections
     are in document order, so we just iterate and pick the last
     one to cross the line.
     ═══════════════════════════════════════════════════════════════ */
  class ScrollSpy {
    constructor() {
      this.chapters = $$('.guides-chapter[id]').map(el => ({ id: el.id, el }));
      this.policies = $$('.guides-row[id]').map(el => ({ id: el.id, el }));

      if (!this.chapters.length) return;

      this.lastChapter = undefined;
      this.lastPolicy = undefined;
      this.ticking = false;
      this.triggerY = 140; // px from viewport top — slightly below the nav

      this.boundRequest = this.requestUpdate.bind(this);
      window.addEventListener('scroll', this.boundRequest, { passive: true });
      window.addEventListener('resize', this.boundRequest, { passive: true });

      // Initial run, plus another after fonts/images settle
      this.requestUpdate();
      window.addEventListener('load', () => this.requestUpdate(), { once: true });
    }

    requestUpdate() {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
    }

    update() {
      let activeChapter = null;
      for (const { id, el } of this.chapters) {
        if (el.getBoundingClientRect().top <= this.triggerY) {
          activeChapter = id;
        } else {
          break;
        }
      }

      let activePolicy = null;
      for (const { id, el } of this.policies) {
        if (el.getBoundingClientRect().top <= this.triggerY) {
          activePolicy = id;
        } else {
          break;
        }
      }

      if (activeChapter !== this.lastChapter) {
        this.setActiveChapter(activeChapter);
        this.lastChapter = activeChapter;
      }
      if (activePolicy !== this.lastPolicy) {
        this.setActivePolicy(activePolicy);
        this.lastPolicy = activePolicy;
      }
    }

    setActiveChapter(id) {
      $$('.guides-toc__chapter.is-active, .guides-toc__divider.is-active')
        .forEach(el => el.classList.remove('is-active'));
      if (!id) return;
      const link = document.querySelector(`.guides-toc__c-link[href="#${id}"]`);
      const item = link && link.closest('.guides-toc__chapter, .guides-toc__divider');
      if (item) item.classList.add('is-active');
    }

    setActivePolicy(id) {
      $$('[data-toc-policy].is-active').forEach(el => el.classList.remove('is-active'));
      if (!id) return;
      const link = document.querySelector(`[data-toc-policy][href="#${id}"]`);
      if (link) link.classList.add('is-active');
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     3. TOC CLICKS — auto-open the target policy panel
     If a user taps a policy in the TOC, expand the panel as the
     smooth scroll lands. Without this they'd arrive at a closed
     accordion and have to click again, which feels broken.
     Chapter links don't auto-open anything — chapters are containers,
     not collapsible panels.
     ═══════════════════════════════════════════════════════════════ */
  function bindTocPolicyLinks() {
    $$('[data-toc-policy]').forEach(link => {
      link.addEventListener('click', () => {
        const hash = link.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return;
        const target = document.querySelector(hash);
        if (!target || !target.classList.contains('guides-row')) return;

        const details = target.querySelector('details');
        if (!details || details.open) return;

        // Open mid-flight on Lenis's ~1.6s scrollTo
        setTimeout(() => { details.open = true; }, 600);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     4. DEEP LINK ON LOAD
     Browsers + Lenis don't always agree on initial hash scrolling,
     especially with the loader running. Re-run scroll once
     app:loaded fires. If the target is a policy, open its panel.
     ═══════════════════════════════════════════════════════════════ */
  function bindHashOnLoad() {
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#top') return;

    let target;
    try {
      target = document.querySelector(hash);
    } catch (e) {
      return; // malformed selector — bail
    }
    if (!target) return;

    const trigger = () => {
      setTimeout(() => {
        const smooth = window.parkCity && window.parkCity.smoothScroll;
        if (smooth && typeof smooth.scrollTo === 'function') {
          smooth.scrollTo(target, { offset: -100 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // If we landed on a policy, open it
        if (target.classList.contains('guides-row')) {
          const details = target.querySelector('details');
          if (details) details.open = true;
        }
      }, 200);
    };

    document.addEventListener('app:loaded', trigger, { once: true });
    setTimeout(trigger, 4500); // failsafe
  }

  /* ═══════════════════════════════════════════════════════════════
     5. PRINT BEHAVIOR
     People will print this for the building reference binder. Open
     every panel before printing, restore the user's exact prior
     state afterward.
     ═══════════════════════════════════════════════════════════════ */
  function bindPrintBehavior() {
    const panels = $$('.guides-row details');
    if (!panels.length) return;

    const expandAll = () => {
      panels.forEach(d => {
        d.dataset.wasOpen = d.open ? '1' : '0';
        d.open = true;
      });
    };

    const restore = () => {
      panels.forEach(d => {
        if (d.dataset.wasOpen !== undefined) {
          d.open = d.dataset.wasOpen === '1';
          delete d.dataset.wasOpen;
        }
      });
    };

    // Modern path: beforeprint / afterprint
    window.addEventListener('beforeprint', expandAll);
    window.addEventListener('afterprint', restore);

    // Safari fallback: matchMedia('print')
    if (window.matchMedia) {
      const mql = window.matchMedia('print');
      const handler = (e) => (e.matches ? expandAll() : restore());
      if (mql.addEventListener) mql.addEventListener('change', handler);
      else if (mql.addListener) mql.addListener(handler);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     6. CONSOLE SIGNATURE
     ═══════════════════════════════════════════════════════════════ */
  function signature() {
    const css = 'font-family: serif; font-style: italic; color: #b8956a;';
    console.log('%cPark City 3 & 4 — Building Guides. Plainly written.', css);
  }

  /* ═══════════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════════ */
  ready(() => {
    try {
      fillChapterCounts();
      new ScrollSpy();
      bindTocPolicyLinks();
      bindHashOnLoad();
      bindPrintBehavior();
      signature();
    } catch (err) {
      console.error('[Park City · Guides] init error:', err);
    }
  });

})();
