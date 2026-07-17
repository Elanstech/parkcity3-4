/* ═══════════════════════════════════════════════════════════════
   PARK CITY 3 & 4 — GALLERY
   Masonry · Filter · Lightbox
   Loads after script.js; reuses window.parkCity for scroll-locking.
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════
     1. MASONRY — CSS grid row-span layout
     Each tile spans however many 8px base rows its image needs, so
     full frames are preserved with no cropping and no layout shift.
     ═══════════════════════════════════════════════════════════════ */
  class Masonry {
    constructor(grid) {
      this.grid  = grid;
      this.items = $$('.g-item', grid);
      this.layout = this.layout.bind(this);

      // Re-measure each tile as its thumbnail finishes loading
      $$('img', grid).forEach(img => {
        if (!img.complete) {
          img.addEventListener('load', () => this.span(img.closest('.g-item')), { once: true });
        }
      });

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(this.layout, 120);
      });

      if (document.fonts && document.fonts.ready) document.fonts.ready.then(this.layout);
      window.addEventListener('load', this.layout);
      this.layout();
    }

    span(item) {
      if (!item || item.classList.contains('is-hidden')) return;
      const cs   = getComputedStyle(this.grid);
      const rowH = parseFloat(cs.gridAutoRows) || 8;
      const gap  = parseFloat(cs.rowGap) || 0;
      const h    = item.querySelector('.g-media').getBoundingClientRect().height;
      item.style.gridRowEnd = 'span ' + Math.max(1, Math.ceil((h + gap) / (rowH + gap)));
    }

    layout() { this.items.forEach(it => this.span(it)); }
  }

  /* ═══════════════════════════════════════════════════════════════
     2. REVEAL — staggered fade/rise on scroll
     ═══════════════════════════════════════════════════════════════ */
  class Reveal {
    constructor(items) {
      if (prefersReducedMotion) {
        items.forEach(i => i.classList.add('is-in'));
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const visible = items.filter(i => !i.classList.contains('is-hidden'));
          const idx = Math.max(0, visible.indexOf(e.target));
          e.target.style.transitionDelay = Math.min(idx, 6) * 60 + 'ms';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

      items.forEach(i => io.observe(i));
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     3. FILTER — category pills toggle tiles, then relayout
     ═══════════════════════════════════════════════════════════════ */
  class Filter {
    constructor(items, pills, onChange) {
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('is-active'));
          pill.classList.add('is-active');

          const cat = pill.dataset.filter;
          items.forEach(it => {
            const show = cat === 'all' || it.dataset.cat === cat;
            it.classList.toggle('is-hidden', !show);
            it.classList.toggle('is-in', show);   // keep shown tiles visible
          });

          if (onChange) onChange();
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     4. LIGHTBOX — full-screen viewer
     Keyboard (Esc / ← / →), swipe, backdrop close, neighbour preload.
     Navigation stays within the currently filtered set.
     ═══════════════════════════════════════════════════════════════ */
  class Lightbox {
    constructor(items) {
      this.items = items;
      this.lb    = $('#lightbox');
      this.img   = $('#lbImg');
      this.label = $('#lbLabel');
      this.title = $('#lbTitle');
      this.count = $('#lbCount');
      if (!this.lb) return;

      this.list = [];
      this.idx  = 0;
      this.startX = 0;

      items.forEach(it => it.addEventListener('click', () => this.open(it)));
      $$('[data-lb-close]', this.lb).forEach(b => b.addEventListener('click', () => this.close()));
      $('[data-lb-prev]', this.lb).addEventListener('click', () => this.go(-1));
      $('[data-lb-next]', this.lb).addEventListener('click', () => this.go(1));

      document.addEventListener('keydown', (e) => {
        if (!this.lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') this.close();
        else if (e.key === 'ArrowLeft')  this.go(-1);
        else if (e.key === 'ArrowRight') this.go(1);
      });

      this.lb.addEventListener('touchstart', (e) => { this.startX = e.changedTouches[0].clientX; }, { passive: true });
      this.lb.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - this.startX;
        if (Math.abs(dx) > 50) this.go(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    visible() { return this.items.filter(it => !it.classList.contains('is-hidden')); }

    lockScroll(on) {
      const lenis = window.parkCity && window.parkCity.smoothScroll && window.parkCity.smoothScroll.lenis;
      if (on) {
        lenis && lenis.stop();
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        lenis && lenis.start();
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    }

    preload(i) {
      if (i < 0 || i >= this.list.length) return;
      const im = new Image();
      im.src = this.list[i].dataset.full;
    }

    render() {
      const it = this.list[this.idx];
      this.lb.classList.add('is-loading');
      this.img.classList.remove('is-ready');

      const full = new Image();
      full.onload  = () => { this.img.src = full.src; this.img.classList.add('is-ready'); this.lb.classList.remove('is-loading'); };
      full.onerror = () => this.lb.classList.remove('is-loading');
      full.src = it.dataset.full;

      this.img.alt = it.dataset.cap;
      this.label.textContent = it.dataset.catlabel;
      this.title.textContent = it.dataset.cap;
      this.count.textContent = (this.idx + 1) + ' / ' + this.list.length;

      this.preload(this.idx + 1);
      this.preload(this.idx - 1);
    }

    open(it) {
      this.list = this.visible();
      this.idx  = this.list.indexOf(it);
      if (this.idx < 0) return;
      this.lb.classList.add('is-open');
      this.lb.setAttribute('aria-hidden', 'false');
      this.lockScroll(true);
      this.render();
    }

    close() {
      this.lb.classList.remove('is-open');
      this.lb.setAttribute('aria-hidden', 'true');
      this.lockScroll(false);
    }

    go(dir) {
      this.idx = (this.idx + dir + this.list.length) % this.list.length;
      this.render();
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════════════ */
  const boot = () => {
    const grid = $('#ggrid');
    if (!grid) return;

    const items = $$('.g-item', grid);
    const masonry = new Masonry(grid);
    new Reveal(items);
    new Filter(items, $$('.gpill'), () => requestAnimationFrame(() => masonry.layout()));
    new Lightbox(items);
  };

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
